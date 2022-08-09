import type {
	Root as MdRoot,
	Blockquote as MdBlockquote,
	Break as MdBreak,
	Code as MdCode,
	Definition as MdDefinition,
	Delete as MdDelete,
	Emphasis as MdEmphasis,
	Footnote as MdFootnote,
	FootnoteDefinition as MdFootnoteDefinition,
	FootnoteReference as MdFootnoteReference,
	HTML as MdHTML,
	Heading as MdHeading,
	Image as MdImage,
	ImageReference as MdImageReference,
	InlineCode as MdInlineCode,
	Link as MdLink,
	LinkReference as MdLinkReference,
	List as MdList,
	ListItem as MdListItem,
	Paragraph as MdParagraph,
	Strong as MdStrong,
	Table as MdTable,
	TableCell as MdTableCell,
	TableRow as MdTableRow,
	Text as MdText,
	ThematicBreak as MdThematicBreak,
	YAML as MdYaml
} from 'mdast';

import type {
	MdxFlowExpression,
	MdxJsxAttribute,
	MdxJsxAttributeValueExpression,
	MdxJsxExpressionAttribute,
	MdxJsxFlowElement,
	MdxJsxTextElement,
	MdxTextExpression,
	MdxjsEsm
} from 'mdast-util-mdx';

import type { UnNode } from './unist.js';

import { fromMarkdown } from 'mdast-util-from-markdown';
import { frontmatterFromMarkdown, frontmatterToMarkdown } from 'mdast-util-frontmatter';
import { htmlCommentFromMarkdown, htmlCommentToMarkdown } from 'mdast-util-html-comment';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { frontmatter } from 'micromark-extension-frontmatter';
import { htmlComment } from 'micromark-extension-html-comment';
import { mdxjs } from 'micromark-extension-mdxjs';

declare module 'mdast' {
	export interface PhrasingContentMap extends StaticPhrasingContentMap {
		mdxJsxFlowElement: MdxJsxFlowElement;
		mdxJsxTextElement: MdxJsxTextElement;
		mdxFlowExpression: MdxFlowExpression;
		mdxTextExpression: MdxTextExpression;
	}
}

export function mdNodeIs<T extends MdNodeType>(
	node: UnNode | undefined,
	type: T
): node is T extends MdRoot['type']
	? MdRoot
	: T extends MdBlockquote['type']
	? MdBlockquote
	: T extends MdBreak['type']
	? MdBreak
	: T extends MdCode['type']
	? MdCode
	: T extends MdDefinition['type']
	? MdDefinition
	: T extends MdDelete['type']
	? MdDelete
	: T extends MdEmphasis['type']
	? MdEmphasis
	: T extends MdFootnote['type']
	? MdFootnote
	: T extends MdFootnoteDefinition['type']
	? MdFootnoteDefinition
	: T extends MdFootnoteReference['type']
	? MdFootnoteReference
	: T extends MdHTML['type']
	? MdHTML
	: T extends MdHeading['type']
	? MdHeading
	: T extends MdImage['type']
	? MdImage
	: T extends MdImageReference['type']
	? MdImageReference
	: T extends MdInlineCode['type']
	? MdInlineCode
	: T extends MdLink['type']
	? MdLink
	: T extends MdLinkReference['type']
	? MdLinkReference
	: T extends MdList['type']
	? MdList
	: T extends MdListItem['type']
	? MdListItem
	: T extends MdParagraph['type']
	? MdParagraph
	: T extends MdStrong['type']
	? MdStrong
	: T extends MdTable['type']
	? MdTable
	: T extends MdTableCell['type']
	? MdTableCell
	: T extends MdTableRow['type']
	? MdTableRow
	: T extends MdText['type']
	? MdText
	: T extends MdThematicBreak['type']
	? MdThematicBreak
	: T extends MdYaml
	? MdYaml
	: T extends MdxFlowExpression['type']
	? MdxFlowExpression
	: T extends MdxJsxAttribute['type']
	? MdxJsxAttribute
	: T extends MdxJsxAttributeValueExpression['type']
	? MdxJsxAttributeValueExpression
	: T extends MdxJsxExpressionAttribute['type']
	? MdxJsxExpressionAttribute
	: T extends MdxJsxFlowElement['type']
	? MdxJsxFlowElement
	: T extends MdxJsxTextElement['type']
	? MdxJsxTextElement
	: T extends MdxTextExpression['type']
	? MdxTextExpression
	: MdxjsEsm {
	return node ? node.type === type : false;
}

export function mdNodeIsJsxElement(node: UnNode): node is MdxJsxFlowElement | MdxJsxTextElement {
	return mdNodeIs(node, 'mdxJsxFlowElement') || mdNodeIs(node, 'mdxJsxTextElement');
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
				if (mdNodeIsJsxElement(parent)) {
					return 0;
				}

				return 1;
			}
		]
	});
}

/**
 * ============================================================
 */

export type MdNodeType =
	| MdRoot['type']
	| MdBlockquote['type']
	| MdBreak['type']
	| MdCode['type']
	| MdDefinition['type']
	| MdDelete['type']
	| MdEmphasis['type']
	| MdFootnote['type']
	| MdFootnoteDefinition['type']
	| MdFootnoteReference['type']
	| MdHTML['type']
	| MdHeading['type']
	| MdImage['type']
	| MdImageReference['type']
	| MdInlineCode['type']
	| MdLink['type']
	| MdLinkReference['type']
	| MdList['type']
	| MdListItem['type']
	| MdParagraph['type']
	| MdStrong['type']
	| MdTable['type']
	| MdTableCell['type']
	| MdTableRow['type']
	| MdText['type']
	| MdThematicBreak['type']
	| MdYaml['type']
	| MdxFlowExpression['type']
	| MdxJsxAttribute['type']
	| MdxJsxAttributeValueExpression['type']
	| MdxJsxExpressionAttribute['type']
	| MdxJsxFlowElement['type']
	| MdxJsxTextElement['type']
	| MdxTextExpression['type']
	| MdxjsEsm['type'];

export type {
	MdRoot,
	MdBlockquote,
	MdBreak,
	MdCode,
	MdDefinition,
	MdDelete,
	MdEmphasis,
	MdFootnote,
	MdFootnoteDefinition,
	MdFootnoteReference,
	MdHTML,
	MdHeading,
	MdImage,
	MdImageReference,
	MdInlineCode,
	MdLink,
	MdLinkReference,
	MdList,
	MdListItem,
	MdParagraph,
	MdStrong,
	MdTable,
	MdTableCell,
	MdTableRow,
	MdText,
	MdThematicBreak,
	MdYaml
};

export type {
	MdxFlowExpression,
	MdxJsxAttribute,
	MdxJsxAttributeValueExpression,
	MdxJsxExpressionAttribute,
	MdxJsxFlowElement,
	MdxJsxTextElement,
	MdxTextExpression,
	MdxjsEsm
};
