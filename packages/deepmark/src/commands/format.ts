import type { FormatOptions } from '../features/index.js';
import type { Config } from '../types/index.js';

import fg from 'fast-glob';
import fs from 'fs-extra';
import { format_markdown } from '../features/index.js';
import { get_string_array, is_directory_exist, resolve_path } from '../utilities/index.js';

export function create_format_handler(config: Config) {
	const {
		directories: { sources }
	} = config;

	return async (options: FormatOptions) => {
		const source_dirs = get_string_array(sources);

		for (const source_dir of source_dirs) {
			if (!is_directory_exist(source_dir)) continue;

			const source_pattern = source_dir.replace(/\/$/, '') + '/**/*.{md,mdx}';
			const source_paths = (await fg(source_pattern)).map((path) => resolve_path(path));

			for (const source_path of source_paths) {
				const output_path = source_path;

				const markdown = await fs.readFile(source_path, { encoding: 'utf-8' });
				const formatted = await format_markdown(markdown, options);

				await fs.writeFile(output_path, formatted);
			}
		}
	};
}
