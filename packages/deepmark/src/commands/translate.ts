import type { CommandHandler, Config } from '$types';

import fg from 'fast-glob';
import np from 'path';
import { get_path_tail, get_string_array, is_directory_exist, resolve_path } from '$utils';
import { extract } from '../features/extract.js';

export function create_translate_handler(config: Config): CommandHandler {
	const {
		source_language,
		directories: { extraction },
		frontmatter,
		components
	} = config;

	return async () => {
		const source_dirs = get_string_array(extraction.source);
		const output_dirs = get_string_array(extraction.output);

		for (let i = 0; i < source_dirs.length; i++) {
			const source_dir = source_dirs[i].replace('%language%', source_language);
			if (!is_directory_exist(source_dir)) continue;

			const source_pattern = np.join(source_dir, '**/*.{md,mdx}');
			const source_paths = (await fg(source_pattern)).map((path) => resolve_path(path));

			const output_dir = output_dirs[i].replace('%language%', source_language);

			for (const source_path of source_paths) {
				// TODO: fix output path
				const output_path = resolve_path(output_dir, get_path_tail(output_dir, source_path));

				await extract(source_path, output_path, config);

				const strings: string[] = [];
			}
		}
	};
}
