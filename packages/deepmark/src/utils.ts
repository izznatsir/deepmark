import { generate, GENERATOR } from 'astring';
import fs from 'fs-extra';
import { mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import np from 'path';
import { remark } from 'remark';
import remark_comment from 'remark-comment';
import remark_frontmatter from 'remark-frontmatter';
import remark_mdx from 'remark-mdx';
import { JSX } from './astring-jsx.js';
import { esxwalk } from './eswalk.js';
import { unwalk } from './unwalk.js';

import type { Paragraph, Root as MdastRoot, YAML } from 'mdast';
import type { MdxJsxFlowElement, MdxJsxTextElement } from 'mdast-util-mdx';
import type { Root as MdxastRoot } from 'remark-mdx';
import type { Config } from '$types';
import type { Node as UnNode, Parent as UnParent } from './unwalk.js';

export function resolve_path(...paths: string[]): string {
	return np.resolve(process.cwd(), ...paths);
}

export async function is_directory_exist(path: string): Promise<boolean> {
	try {
		const resolved_path = resolve_path(path);
		const stat = await fs.stat(resolved_path);
		if (stat.isDirectory()) return true;
		return false;
	} catch {
		return false;
	}
}

export async function is_file_readable(path: string): Promise<boolean> {
	try {
		await fs.access(path, fs.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}

export function get_path_tail(base: string, path: string): string {
	const resolved_base = resolve_path(base);
	const resolved_path = resolve_path(path);

	return resolved_path.slice(resolved_base.length + 1);
}

export function get_string_array(string_or_array: string | string[]): string[] {
	return Array.isArray(string_or_array) ? string_or_array : [string_or_array];
}

export function is_markdown(path: string): boolean {
	return is_md(path) || is_mdx(path);
}

export function is_md(path: string): boolean {
	return path.endsWith('.md');
}

export function is_mdx(path: string): boolean {
	return path.endsWith('.mdx');
}

export function is_ast_json(path: string): boolean {
	return path.endsWith('.ast.json');
}

export function is_md_json(path: string): boolean {
	return path.endsWith('.md.json');
}

export function is_mdx_json(path: string): boolean {
	return path.endsWith('.mdx.json');
}

export function is_json(path: string): boolean {
	return path.endsWith('.json') && !is_ast_json(path);
}

/**
 * Get `mdast`.
 */
export function get_mdast(markdown: string): MdastRoot {
	return remark().use(remark_frontmatter, ['yaml']).parse(markdown);
}

/**
 * Get MDX flavored `mdast`.
 */
export function get_mdxast(markdown: string): MdxastRoot {
	return (
		remark()
			.use(remark_frontmatter, ['yaml'])
			.use(remark_mdx)
			// @ts-ignore
			.use(remark_comment, { ast: true })
			.parse(markdown)
	);
}

export function is_mdast_root(parent: UnNode | null): parent is MdastRoot {
	return parent && parent.type === 'root' ? true : false;
}

export function is_mdast_yaml(node: UnNode): node is YAML {
	return node.type === 'yaml' ? true : false;
}

export function is_mdast_paragraph(node: UnNode): node is Paragraph {
	return node.type === 'paragraph' ? true : false;
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
	return node.type === 'mdxJsxFlowElement' ? true : false;
}

export function is_mdast_jsx_text_element(node: UnNode | UnParent): node is MdxJsxTextElement {
	return node.type === 'mdxJsxTextElement' ? true : false;
}

interface MdxJsxInParagraph extends Paragraph {
	children: [MdxJsxTextElement];
}

export function is_mdast_paragraph_jsx_text_element(
	node: UnNode | UnParent
): node is MdxJsxInParagraph {
	return is_mdast_paragraph(node) && is_mdast_jsx_text_element(node.children[0]) ? true : false;
}

export function get_translatable_strings(
	ast: MdastRoot,
	source_path: string,
	{
		components = {},
		frontmatter = [],
		ignoredNodes = ['code', 'comment', 'mdxFlowExpression', 'mdxjsEsm']
	}: Config
): string[] {
	const names = Object.keys(components);
	const fields = frontmatter;

	const strings: string[] = [];

	unwalk(ast, (node, parent) => {
		if (!is_mdast_root(parent) || ignoredNodes.includes(node.type)) return;

		if (is_mdast_yaml(node)) {
		}

		if (is_mdx(source_path)) {
			if (is_mdast_jsx_element(node)) {
				const jsx_element_node =
					is_mdast_jsx_flow_element(node) || is_mdast_jsx_text_element(node)
						? node
						: is_mdast_paragraph_jsx_text_element(node)
						? ((node as Paragraph).children[0] as MdxJsxTextElement)
						: undefined;

				if (!jsx_element_node) return;

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

							esxwalk(estree, {
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
