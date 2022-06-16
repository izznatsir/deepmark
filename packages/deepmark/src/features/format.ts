import type { Options as PrettierOptions } from 'prettier';
import prettier from 'prettier';
import type { UnNode } from '../types/index.js';
import {
	is_mdast_flow_expression,
	is_mdast_root,
	get_markdown,
	get_mdast,
	unwalk
} from '../utilities/index.js';

export interface FormatOptions {
	prettier: boolean;
}

export async function format_markdown(
	markdown: string,
	options: FormatOptions,
	prettier_options?: PrettierOptions
) {
	// Get mdast.
	const mdast = get_mdast(markdown);

	// Remove useless surface nodes.
	unwalk(mdast, (node, parent, index) => {
		if (!is_mdast_root(parent)) return;

		if (is_mdast_empty_text_expression(node)) {
			(parent.children[index!] as unknown) = undefined;
		}
	});

	// Serialize. Inside JSX elements, there will be no blank line between blocks.
	const _markdown = get_markdown(mdast);

	if (options.prettier) {
		// Format with Prettier.
		const config_or_null = await prettier.resolveConfig(process.cwd());
		const config = config_or_null
			? config_or_null
			: prettier_options
			? prettier_options
			: ({
					printWidth: Infinity,
					proseWrap: 'never'
			  } as PrettierOptions);

		// Format with prettier.
		return prettier.format(_markdown, {
			parser: 'mdx',
			...config
		});
	}

	return _markdown;
}

function is_mdast_empty_text_expression(node: UnNode): boolean {
	if (!is_mdast_flow_expression(node)) return false;

	const regex = /^('|")\s*('|")$/;
	return regex.test(node.value);
}
