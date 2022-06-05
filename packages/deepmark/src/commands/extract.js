import fg from 'fast-glob';
import fs from 'fs-extra';
import np from 'path';
import { get_path_tail, get_string_array, is_directory_exist, resolve_path } from '../utils.js';

/**
 * @param { import("../types.js").Config } config
 * @returns { import("../types.js").CommandHandler }
 */
export function extract({ sourceLanguage, directories: { extraction }, frontmatter, components }) {
	return async () => {
		const source_dirs = get_string_array(extraction.source)
		const output_dirs = get_string_array(extraction.output)

		for (let i = 0; i < source_dirs.length; i++) {
			const source_dir = source_dirs[i].replace('%language%', sourceLanguage);
			if (!is_directory_exist(source_dir)) continue;

			const source_pattern = np.join(source_dir, '**/*.{md,mdx}');
			const source_paths = (await fg(source_pattern)).map((path) => resolve_path(path));

			const output_dir = output_dirs[i].replace('%language%', sourceLanguage);

			for (const source_path of source_paths) {
				const output_path = resolve_path(output_dir, get_path_tail(output_dir, source_path));

				/** @type { string[] } */
				const strings = [];

				await fs.outputFile(output_path, JSON.stringify(strings));
			}
		}
	};
}
