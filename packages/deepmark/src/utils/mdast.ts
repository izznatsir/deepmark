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
	MdxTextExpression,
	UnNode,
	UnParent
} from '$types';

import { generate, GENERATOR } from 'astring';
import { mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { remark } from 'remark';
import remark_comment from 'remark-comment';
import remark_frontmatter from 'remark-frontmatter';
import remark_mdx from 'remark-mdx';
import { is_mdx } from './fs.js';
import { JSX } from '../astring-jsx.js';
import { eswalk } from '../eswalk.js';
import { unwalk } from '../unwalk.js';

export function is_mdast_root(node: UnNode | undefined): node is MdRoot {
	return node ? node.type === 'root' : false;
}

export function is_mdast_yaml(node: UnNode): node is MdYaml {
	return node.type === 'yaml';
}

export function is_mdast_paragraph(node: UnNode): node is MdParagraph {
	return node.type === 'paragraph';
}

export function is_mdast_text(node: UnNode): node is MdText {
	return node.type === 'text';
}

export function is_mdast_flow_expression(node: UnNode): node is MdxFlowExpression {
	return node.type === 'mdxFlowExpression';
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

export function is_mdast_link(node: UnNode): node is MdLink {
	return node.type === 'link'
}

export function is_mdast_text_expression(node: UnNode): node is MdxTextExpression {
	return node.type === 'mdxTextExpression';
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

export function get_markdown(ast: MdRoot) {
	return (
		remark()
			.use(remark_frontmatter, ['yaml'])
			.use(remark_mdx)
			// @ts-ignore
			.use(remark_comment, { ast: true })
			.stringify(ast)
	);
}

export function get_translatable_strings(
	ast: MdRoot,
	source_path: string,
	{
		components = {},
		frontmatter = [],
		ignored_nodes = ['code', 'comment', 'mdxFlowExpression', 'mdxjsEsm']
	}: Config
): string[] {
	const names = Object.keys(components);
	const fields = frontmatter;

	const strings: string[] = [];

	unwalk(ast, (node, parent) => {
		if (!is_mdast_root(parent) || ignored_nodes.includes(node.type)) return;

		if (is_mdast_yaml(node)) {
		}

		if (is_mdx(source_path)) {
			if (is_mdast_jsx_element(node)) {
				const jsx_element_node =
					is_mdast_jsx_flow_element(node) || is_mdast_jsx_text_element(node)
						? node
						: node.children[0];

				const { name, attributes, children } = jsx_element_node;

				if (!name || (name && !names.includes(name))) return;

				if (attributes) {
					for (const attribute of attributes) {
						if (attribute.type !== 'mdxJsxAttribute') continue;
						if (!components[name].includes(attribute.name)) continue;

						if (typeof attribute.value === 'string') {
							strings.push(attribute.value);
						} else if (attribute.value?.data?.estree) {
							const estree = attribute.value.data.estree;

							if (!estree) continue;

							eswalk(estree, {
								Literal(node) {
									if (typeof node.value === 'string') strings.push(node.value);
								},
								Property(node) {
									if (node.key.type !== 'Identifier') return;

									const name = `${attribute.name}.${node.key.name}`;
									if (!names.includes(name)) return false;
								},
								JSXElement(node) {
									strings.push(generate(node, { generator: { ...GENERATOR, ...JSX } }));
								}
							});
						}
					}
				}

				if (children.length > 0) {
					for (const child of children) {
						const string = toMarkdown(child, { extensions: [mdxToMarkdown()] });
						strings.push(string);
					}
				}
			}
		}
	});

	return strings;
}
