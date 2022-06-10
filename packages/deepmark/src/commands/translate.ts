import type { CommandHandler, Config, Context } from '$types';

import fg from 'fast-glob';
import fs from 'fs-extra';
import np from 'path';
import {
	get_path_tail,
	get_string_array,
	is_directory_exist,
	is_json,
	is_markdown,
	resolve_path
} from '$utils';
import { extract } from '../features/extract.js';
import { replace } from '../features/replace.js';
import { prepare } from '../features/prepare.js';
import { translate } from '../features/translate.js';
import type { TargetLanguageCode } from 'deepl-node';

export function create_translate_handler(config: Config, context: Context): CommandHandler {
	const {
		source_language,
		output_languages,
		directories: { sources, outputs }
	} = config;

	return async () => {
		const source_dirs = get_string_array(sources);
		const output_dirs = get_string_array(outputs);

		for (let i = 0; i < source_dirs.length; i++) {
			const source_dir = source_dirs[i].replace('%language%', source_language);
			if (!is_directory_exist(source_dir)) continue;

			const source_pattern = np.join(source_dir, '**/*.*');
			const source_paths = (await fg(source_pattern)).map((path) => resolve_path(path));

			const translatable_paths = source_paths.filter((path) => is_markdown(path) || is_json(path));
			const copyable_paths = source_paths.filter((path) => !is_markdown(path) && !is_json(path));

			for (const source_path of translatable_paths) {
				const output_path = '';

				if (is_markdown(source_path)) {
					const markdown = await fs.readFile(source_path, { encoding: 'utf-8' });
					const root = prepare(markdown);
					const sources = extract(root, config);
					const translations = await translate(sources, config, context);
					const markdowns = replace(root, translations, config);

					for (const language in markdowns) {
						const _markdown = markdowns[language as TargetLanguageCode];
						await fs.outputFile(_markdown!, output_path.replace('%language%', language));
					}

					continue;
				}

				if (is_json(source_path)) {
					continue;
				}
			}

			for (const source_path of copyable_paths) {
				const destination_path = '';
				await fs.copyFile(source_path, destination_path);
			}
		}
	};
}
