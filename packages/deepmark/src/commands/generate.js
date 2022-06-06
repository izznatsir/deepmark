import fg from 'fast-glob';
import fs from 'fs-extra';
import np from 'path';
import { get_path_tail, get_string_array, is_directory_exist, resolve_path } from '../utils.js';

/**
 * @param { import('@types').Config } config
 * @returns { import('@types').CommandHandler }
 */
export function generate({ outputLanguages, directories: { generation } }) {
	return async () => {
		const source_dirs = get_string_array(generation.source);
		const output_dirs = get_string_array(generation.output);

		for (let i = 0; i < source_dirs.length; i++) {
			for (const language of outputLanguages) {
				const source_dir = source_dirs[i].replace('%language%', language);
				if (!is_directory_exist(source_dir)) continue;

				const source_pattern = np.join(source_dir, '**/*.{md,mdx}.ast');
				const source_paths = (await fg(source_pattern)).map((path) => resolve_path(path));

				const output_dir = output_dirs[i].replace('%language%', language);

				for (const source_path of source_paths) {
					const output_path = resolve_path(
						output_dir,
						get_path_tail(output_dir, source_path)
					).slice(0, -4);

					const markdown = '';

					await fs.outputFile(output_path, markdown);
				}
			}
		}
	};
}
