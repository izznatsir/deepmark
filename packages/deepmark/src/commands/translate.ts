import type { CommandHandler, Config, Context } from '$types';

import fg from 'fast-glob';
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
				if (is_markdown(source_path)) {
					continue;
				}

				if (is_json(source_path)) {
					continue;
				}
			}

			for (const source_path of copyable_paths) {
			}
		}
	};
}
