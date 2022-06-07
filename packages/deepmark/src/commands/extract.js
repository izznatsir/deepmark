import fg from 'fast-glob';
import fs from 'fs-extra';
import np from 'path';
import {
	get_mdast,
	get_mdxast,
	get_path_tail,
	get_string_array,
	get_translatable_strings,
	is_directory_exist,
	is_markdown,
	is_md,
	resolve_path
} from '../utils.js';

/**
 * @param { import('$types').Config } config
 * @returns { import('$types').CommandHandler }
 */
export function create_extract_handler(config) {
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
				const output_path = resolve_path(output_dir, get_path_tail(output_dir, source_path));

				await extract(source_path, output_path, config);

				/** @type { string[] } */
				const strings = [];

				await fs.outputFile(output_path, JSON.stringify(strings));
			}
		}
	};
}

/**
 *
 * @param { string } source_path
 * @param { string } output_path
 * @param { import('$types').Config } config
 * @returns { Promise<{ source: string; output: string } | undefined> }
 */
export async function extract(source_path, output_path, config) {
	if (is_markdown(source_path)) {
		const markdown = await fs.readFile(source_path, { encoding: 'utf-8' });

		const ast = is_md(source_path) ? get_mdast(markdown) : get_mdxast(markdown);
		const strings = get_translatable_strings(ast, source_path, config);

		await fs.outputFile(output_path.concat('.ast'), JSON.stringify(ast));
		await fs.outputFile(output_path.concat('.json'), JSON.stringify(strings));
	} else {
		return {
			source: source_path,
			output: output_path
		};
	}
}
