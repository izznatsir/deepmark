import type { Config } from '$types';

import fg from 'fast-glob';
import fs from 'fs-extra';
import np from 'path';
import { format } from '../features/index.mjs';
import { get_string_array, is_directory_exist, resolve_path } from '../utilities/index.mjs';

export function create_format_handler(config: Config) {
	const {
		directories: { sources }
	} = config;

	return async () => {
		const source_dirs = get_string_array(sources);

		for (const source_dir of source_dirs) {
			if (!is_directory_exist(source_dir)) continue;

			const source_pattern = np.join(source_dir, '**/*.{md,mdx}');
			const source_paths = (await fg(source_pattern)).map((path) => resolve_path(path));

			for (const source_path of source_paths) {
				const output_path = source_path;

				const markdown = await fs.readFile(source_path, { encoding: 'utf-8' });
				const formatted = await format(markdown);

				await fs.writeFile(output_path, formatted);
			}
		}
	};
}
