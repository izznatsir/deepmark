import type { Options as PrettierOptions } from 'prettier';
import type { UnNode } from '../types/index.js';

import prettier from 'prettier';
import {
	is_mdast_flow_expression,
	is_mdast_root,
	get_markdown,
	get_mdast,
	unwalk
} from '../utilities/index.js';

export async function format_markdown(
	markdown: string,
	prettier_options?: Omit<PrettierOptions, 'parser'>
) {
	const mdast = get_mdast(markdown);

	// Remove useless surface nodes.
	unwalk(
		mdast,
		(node, parent, index) => {
			if (is_mdast_empty_text_expression(node)) {
				(parent!.children[index!] as unknown) = undefined;
			}
		},
		(_, parent) => is_mdast_root(parent)
	);

	const config_or_null = await prettier.resolveConfig(process.cwd());
	const config = prettier_options
		? prettier_options
		: config_or_null
		? config_or_null
		: ({
				printWidth: Infinity,
				proseWrap: 'never',
				useTabs: true
		  } as PrettierOptions);

	return prettier.format(get_markdown(mdast), {
		parser: 'mdx',
		...config
	});
}

function is_mdast_empty_text_expression(node: UnNode): boolean {
	if (!is_mdast_flow_expression(node)) return false;

	const regex = /^('|")\s*('|")$/;
	return regex.test(node.value);
}
