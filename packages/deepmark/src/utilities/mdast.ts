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

export function isMdastEmphasis(node: UnNode): node is MdEmphasis {
	return node.type === 'emphasis';
}

export function isMdastFlowExpression(node: UnNode): node is MdxFlowExpression {
	return node.type === 'mdxFlowExpression';
}

export function isMdastInlineCode(node: UnNode): node is MdInlineCode {
	return node.type === 'inlineCode';
}

export function isMdastJsxElement(
	node: UnNode | UnParent
): node is MdxJsxFlowElement | MdxJsxTextElement {
	return isMdastJsxFlowElement(node) || isMdastJsxTextElement(node);
}

export function isMdastJsxFlowElement(node: UnNode | UnParent): node is MdxJsxFlowElement {
	return node.type === 'mdxJsxFlowElement';
}

export function isMdastJsxTextElement(node: UnNode | UnParent): node is MdxJsxTextElement {
	return node.type === 'mdxJsxTextElement';
}

export function isMdastJsxAttribute(node: UnNode): node is MdxJsxAttribute {
	return node.type === 'mdxJsxAttribute';
}

export function isMdastJsxAttributeValueExpression(
	node: UnNode
): node is MdxJsxAttributeValueExpression {
	return node.type === 'mdxJsxAttributeValueExpression';
}

export function isMdastLink(node: UnNode): node is MdLink {
	return node.type === 'link';
}

export function isMdastList(node: UnNode): node is MdList {
	return node.type === 'list';
}

export function isMdastListItem(node: UnNode): node is MdListItem {
	return node.type === 'listItem';
}

export function isMdastParagraph(node: UnNode): node is MdParagraph {
	return node.type === 'paragraph';
}

export function isMdastRoot(node: UnNode | undefined): node is MdRoot {
	return node ? node.type === 'root' : false;
}

export function isMdastText(node: UnNode): node is MdText {
	return node.type === 'text';
}

export function isMdastTextExpression(node: UnNode): node is MdxTextExpression {
	return node.type === 'mdxTextExpression';
}

export function isMdastStrong(node: UnNode): node is MdStrong {
	return node.type === 'strong';
}

export function isMdastYaml(node: UnNode): node is MdYaml {
	return node.type === 'yaml';
}

/**
 * Get MDX flavored `mdast`.
 */
export function getMdast(markdown: string): MdRoot {
	return fromMarkdown(markdown, {
		extensions: [frontmatter('yaml'), mdxjs(), htmlComment()],
		mdastExtensions: [frontmatterFromMarkdown('yaml'), mdxFromMarkdown(), htmlCommentFromMarkdown()]
	});
}

export function getMarkdown(mdast: MdRoot): string {
	return toMarkdown(mdast, {
		extensions: [frontmatterToMarkdown('yaml'), mdxToMarkdown(), htmlCommentToMarkdown()],
		join: [
			(__, _, parent) => {
				if (isMdastJsxElement(parent)) {
					return 0;
				}

				return 1;
			}
		]
	});
}
