import type {
	Root,
	Blockquote,
	Break,
	Code,
	Definition,
	Delete,
	Emphasis,
	Footnote,
	FootnoteDefinition,
	FootnoteReference,
	HTML,
	Heading,
	Image,
	ImageReference,
	InlineCode,
	Link,
	LinkReference,
	List,
	ListItem,
	Literal,
	Paragraph,
	Parent,
	Strong,
	Table,
	TableCell,
	TableRow,
	Text,
	ThematicBreak,
	YAML
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

declare module 'mdast' {
	export interface PhrasingContentMap extends StaticPhrasingContentMap {
		mdxFlowExpression: MdxFlowExpression;
		mdxJsxAttribute: MdxJsxAttribute;
		mdxJsxAttributeValueExpression: MdxJsxAttributeValueExpression;
		mdxJsxExpressionAttribute: MdxJsxExpressionAttribute;
		mdxJsxFlowElement: MdxJsxFlowElement;
		mdxJsxTextElement: MdxJsxTextElement;
		mdxTextExpression: MdxTextExpression;
		mdxjsEsm: MdxjsEsm;
	}
}

export type {
	Root as MdRoot,
	Blockquote as MdBlockquote,
	Break as MdBreak,
	Code as MdCode,
	Content as MdContent,
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
	Literal as MdLiteral,
	Paragraph as MdParagraph,
	Parent as MdParent,
	Strong as MdStrong,
	Table as MdTable,
	TableCell as MdTableCell,
	TableRow as MdTableRow,
	Text as MdText,
	ThematicBreak as MdThematicBreak,
	YAML as MdYaml
} from 'mdast';

export type {
	MdxFlowExpression,
	MdxJsxAttribute,
	MdxJsxAttributeValueExpression,
	MdxJsxExpressionAttribute,
	MdxJsxFlowElement,
	MdxJsxTextElement,
	MdxTextExpression,
	MdxjsEsm
} from 'mdast-util-mdx';

export interface MdxJsxInParagraph extends Paragraph {
	children: [MdxJsxTextElement];
}

export type MdNodeUnion =
	| Root
	| Blockquote
	| Break
	| Code
	| Definition
	| Delete
	| Emphasis
	| Footnote
	| FootnoteDefinition
	| FootnoteReference
	| HTML
	| Heading
	| Image
	| ImageReference
	| InlineCode
	| Link
	| LinkReference
	| List
	| ListItem
	| Literal
	| Paragraph
	| Parent
	| Strong
	| Table
	| TableCell
	| TableRow
	| Text
	| ThematicBreak
	| YAML
	| MdxFlowExpression
	| MdxJsxAttribute
	| MdxJsxAttributeValueExpression
	| MdxJsxExpressionAttribute
	| MdxJsxFlowElement
	| MdxJsxTextElement
	| MdxTextExpression
	| MdxjsEsm;

export type MdParentUnion =
	| Root
	| Paragraph
	| Heading
	| Blockquote
	| List
	| ListItem
	| Table
	| TableRow
	| TableCell
	| Footnote
	| FootnoteDefinition
	| Emphasis
	| Strong
	| Delete
	| Link
	| LinkReference
	| MdxJsxFlowElement
	| MdxJsxTextElement;
