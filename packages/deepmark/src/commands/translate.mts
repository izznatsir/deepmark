import type { TargetLanguageCode } from 'deepl-node';
import type { CommandHandler, Config, Context } from '$types';

import fg from 'fast-glob';
import fs from 'fs-extra';
import np from 'path';
import {
	extract_docusaurus_strings,
	extract_mdast_strings,
	prepare,
	replace_docusaurus_strings,
	replace_mdast_strings,
	translate
} from '../features/index.mjs';
import {
	get_path_tail,
	get_string_array,
	is_directory_exist,
	is_json,
	is_markdown,
	join_path,
	resolve_path
} from '../utilities/index.mjs';

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
			const output_dir = output_dirs[i];
			if (!is_directory_exist(source_dir)) continue;

			const source_pattern = np.join(source_dir, '**/*.*');
			const source_paths = (await fg(source_pattern)).map((path) => resolve_path(path));

			const translatable_paths = source_paths.filter((path) => is_markdown(path) || is_json(path));
			const copyable_paths = source_paths.filter((path) => !is_markdown(path) && !is_json(path));

			for (const source_path of translatable_paths) {
				const output_path = join_path(output_dir, get_path_tail(source_dir, source_path));

				if (is_markdown(source_path)) {
					const markdown = await fs.readFile(source_path, { encoding: 'utf-8' });
					const root = prepare(markdown);
					const strings = extract_mdast_strings(root, config);
					const translations = await translate(strings, config, context);
					const markdowns = replace_mdast_strings(root, translations, config);

					for (const language in markdowns) {
						const _markdown = markdowns[language as TargetLanguageCode];
						await fs.outputFile(_markdown!, output_path.replace('%language%', language));
					}

					continue;
				}

				if (is_json(source_path)) {
					const json = await fs.readFile(source_path, { encoding: 'utf-8' });
					const object = JSON.parse(json);
					const strings = extract_docusaurus_strings(object);
					const translations = await translate(strings, config, context);
					const jsons = replace_docusaurus_strings(object, translations);

					for (const language in jsons) {
						const _json = jsons[language as TargetLanguageCode];
						await fs.outputFile(_json!, output_path.replace('%language%', language));
					}

					continue;
				}
			}

			for (const source_path of copyable_paths) {
				const output_path = join_path(output_dir, get_path_tail(source_dir, source_path));

				for (const language in output_languages) {
					await fs.copyFile(source_path, output_path.replace('%language%', language));
				}
			}
		}

		context.memory.serialize();
	};
}
