import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { frontmatter } from 'micromark-extension-frontmatter';
import { mdxjs } from 'micromark-extension-mdxjs';
import type { Options } from 'prettier';
import prettier from 'prettier';
import { comment, commentFromMarkdown, commentToMarkdown } from 'remark-comment';
import type { UnNode } from '../types/index.js';
import {
	is_mdast_flow_expression,
	is_mdast_jsx_flow_element,
	is_mdast_jsx_text_element,
	is_mdast_root,
	unwalk
} from '../utilities/index.js';

export async function format_markdown(markdown: string) {
	// Get mdast.
	const mdast = fromMarkdown(markdown, 'utf-8', {
		extensions: [frontmatter('yaml'), mdxjs(), comment],
		mdastExtensions: [frontmatterFromMarkdown('yaml'), mdxFromMarkdown(), [commentFromMarkdown, {}]]
	});

	// Remove useless surface nodes.
	unwalk(mdast, (node, parent, index) => {
		if (!is_mdast_root(parent)) return;

		if (is_mdast_empty_text_expression(node)) {
			(parent.children[index!] as unknown) = undefined;
		}
	});

	// Serialize. Inside JSX elements, there will be no blank line between blocks.
	const clean = toMarkdown(mdast, {
		extensions: [frontmatterToMarkdown('yaml'), mdxToMarkdown(), commentToMarkdown()],
		join: [
			(__, _, parent) => {
				if (is_mdast_jsx_flow_element(parent) || is_mdast_jsx_text_element(parent)) {
					return 0;
				}

				return 1;
			}
		]
	});

	const config_or_null = await prettier.resolveConfig(process.cwd());
	const config = config_or_null
		? config_or_null
		: ({
				printWidth: Infinity,
				proseWrap: 'never'
		  } as Options);

	// Format with prettier.
	return prettier.format(clean, {
		parser: 'mdx',
		...config
	});
}

function is_mdast_empty_text_expression(node: UnNode): boolean {
	if (!is_mdast_flow_expression(node)) return false;

	const regex = /^('|")\s*('|")$/;
	return regex.test(node.value);
}
