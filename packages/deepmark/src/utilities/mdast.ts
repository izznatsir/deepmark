import type {
	MdLink,
	MdList,
	MdListItem,
	MdParagraph,
	MdRoot,
	MdText,
	MdYaml,
	MdxFlowExpression,
	MdxJsxFlowElement,
	MdxJsxTextElement,
	MdxJsxInParagraph,
	MdxJsxAttribute,
	MdxJsxAttributeValueExpression,
	MdxTextExpression,
	UnNode,
	UnParent,
	MdStrong,
	MdInlineCode,
	MdEmphasis
} from '../types/index.js';

import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter';
import { htmlCommentFromMarkdown, htmlCommentToMarkdown } from 'mdast-util-html-comment';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { frontmatter } from 'micromark-extension-frontmatter';
import { htmlComment } from 'micromark-extension-html-comment';
import { mdxjs } from 'micromark-extension-mdxjs';

export function is_mdast_emphasis(node: UnNode): node is MdEmphasis {
	return node.type === 'emphasis';
}

export function is_mdast_flow_expression(node: UnNode): node is MdxFlowExpression {
	return node.type === 'mdxFlowExpression';
}

export function is_mdast_inline_code(node: UnNode): node is MdInlineCode {
	return node.type === 'inlineCode';
}

export function is_mdast_jsx_element(
	node: UnNode | UnParent
): node is MdxJsxFlowElement | MdxJsxTextElement {
	return is_mdast_jsx_flow_element(node) || is_mdast_jsx_text_element(node);
}

export function is_mdast_jsx_flow_element(node: UnNode | UnParent): node is MdxJsxFlowElement {
	return node.type === 'mdxJsxFlowElement';
}

export function is_mdast_jsx_text_element(node: UnNode | UnParent): node is MdxJsxTextElement {
	return node.type === 'mdxJsxTextElement';
}

export function is_mdast_jsx_attribute(node: UnNode): node is MdxJsxAttribute {
	return node.type === 'mdxJsxAttribute';
}

export function is_mdast_jsx_attribute_value_expression(
	node: UnNode
): node is MdxJsxAttributeValueExpression {
	return node.type === 'mdxJsxAttributeValueExpression';
}

export function is_mdast_link(node: UnNode): node is MdLink {
	return node.type === 'link';
}

export function is_mdast_list(node: UnNode): node is MdList {
	return node.type === 'list';
}

export function is_mdast_list_item(node: UnNode): node is MdListItem {
	return node.type === 'listItem';
}

export function is_mdast_paragraph(node: UnNode): node is MdParagraph {
	return node.type === 'paragraph';
}

export function is_mdast_root(node: UnNode | undefined): node is MdRoot {
	return node ? node.type === 'root' : false;
}

export function is_mdast_text(node: UnNode): node is MdText {
	return node.type === 'text';
}

export function is_mdast_text_expression(node: UnNode): node is MdxTextExpression {
	return node.type === 'mdxTextExpression';
}

export function is_mdast_strong(node: UnNode): node is MdStrong {
	return node.type === 'strong';
}

export function is_mdast_yaml(node: UnNode): node is MdYaml {
	return node.type === 'yaml';
}

/**
 * Get MDX flavored `mdast`.
 */
export function get_mdast(markdown: string): MdRoot {
	return fromMarkdown(markdown, {
		extensions: [frontmatter('yaml'), mdxjs(), htmlComment()],
		mdastExtensions: [frontmatterFromMarkdown('yaml'), mdxFromMarkdown(), htmlCommentFromMarkdown()]
	});
}

export function get_markdown(mdast: MdRoot): string {
	return toMarkdown(mdast, {
		extensions: [frontmatterToMarkdown('yaml'), mdxToMarkdown(), htmlCommentToMarkdown()],
		join: [
			(__, _, parent) => {
				if (is_mdast_jsx_element(parent)) {
					return 0;
				}

				return 1;
			}
		]
	});
}
