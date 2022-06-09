import type { Config } from '$types';

import fs from 'fs-extra';
import { get_mdast, get_translatable_strings, is_md, is_markdown } from '$utils';

export async function extract(
	source_path: string,
	output_path: string,
	config: Config
): Promise<{ source: string; output: string } | void> {
	if (is_markdown(source_path)) {
		const markdown = await fs.readFile(source_path, { encoding: 'utf-8' });

		const ast = is_md(source_path) ? get_mdast(markdown) : get_mdast(markdown);
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
