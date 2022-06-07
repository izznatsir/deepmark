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

export type MdastNode =
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

export type MdastParent =
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
	| MdxJsxTextElement
