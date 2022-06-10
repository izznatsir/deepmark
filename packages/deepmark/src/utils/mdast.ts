import type {
	Config,
	MdLink,
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
	MdEmphasis,
	MdNodeUnion
} from '$types';

import { generate, GENERATOR } from 'astring';
import { toMarkdown } from 'mdast-util-to-markdown';
import { remark } from 'remark';
import remark_comment from 'remark-comment';
import remark_frontmatter from 'remark-frontmatter';
import remark_mdx from 'remark-mdx';
import { is_mdx } from './fs.js';
import { JSX } from '../astring-jsx.js';
import { eswalk } from '../eswalk.js';
import { unwalk } from '../unwalk.js';

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
): node is MdxJsxFlowElement | MdxJsxTextElement | MdxJsxInParagraph {
	return (
		is_mdast_jsx_flow_element(node) ||
		is_mdast_jsx_text_element(node) ||
		is_mdast_paragraph_jsx_text_element(node)
	);
}

export function is_mdast_jsx_flow_element(node: UnNode | UnParent): node is MdxJsxFlowElement {
	return node.type === 'mdxJsxFlowElement';
}

export function is_mdast_jsx_text_element(node: UnNode | UnParent): node is MdxJsxTextElement {
	return node.type === 'mdxJsxTextElement';
}

export function is_mdast_paragraph_jsx_text_element(
	node: UnNode | UnParent
): node is MdxJsxInParagraph {
	return is_mdast_paragraph(node) && is_mdast_jsx_text_element(node.children[0]);
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
	return (
		remark()
			.use(remark_frontmatter, ['yaml'])
			.use(remark_mdx)
			// @ts-ignore
			.use(remark_comment, { ast: true })
			.parse(markdown)
	);
}

export function get_markdown(ast: MdRoot): string {
	return (
		remark()
			.use(remark_frontmatter, ['yaml'])
			.use(remark_mdx)
			// @ts-ignore
			.use(remark_comment, { ast: true })
			.stringify(ast)
	);
}
