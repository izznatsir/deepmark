import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter';
import { htmlCommentFromMarkdown, htmlCommentToMarkdown } from 'mdast-util-html-comment';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { frontmatter } from 'micromark-extension-frontmatter';
import { htmlComment } from 'micromark-extension-html-comment';
import { mdxjs } from 'micromark-extension-mdxjs';
import type { Options } from 'prettier';
import prettier from 'prettier';
import type { UnNode } from '../types/index.js';
import {
	is_mdast_flow_expression,
	is_mdast_jsx_flow_element,
	is_mdast_jsx_text_element,
	is_mdast_root,
	get_markdown,
	get_mdast,
	unwalk
} from '../utilities/index.js';

export async function format_markdown(markdown: string) {
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
	const clean = get_markdown(mdast);

	// Format with Prettier.
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
