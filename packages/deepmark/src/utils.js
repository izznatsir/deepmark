import { generate, GENERATOR } from 'astring';
import fs from 'fs-extra';
import { mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import np from 'path';
import { remark } from 'remark';
import remark_comment from 'remark-comment';
import remark_frontmatter from 'remark-frontmatter';
import remark_mdx from 'remark-mdx';
import { visit } from 'unist-util-visit';
import { eswalk } from './eswalk.js';

/**
 * @param { string[] } paths
 * @returns { string }
 */
export function resolve_path(...paths) {
	return np.resolve(process.cwd(), ...paths);
}

/**
 * @param { string } path
 * @returns { Promise<boolean> }
 */
export async function is_directory_exist(path) {
	try {
		const resolved_path = resolve_path(path);
		const stat = await fs.stat(resolved_path);
		if (stat.isDirectory()) return true;
		return false;
	} catch {
		return false;
	}
}

/**
 * @param { string } path
 * @returns { Promise<boolean> }
 */
export async function is_file_readable(path) {
	try {
		await fs.access(path, fs.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}

/**
 * @param { string } base
 * @param { string } path
 * @returns { string }
 */
export function get_path_tail(base, path) {
	const resolved_base = resolve_path(base);
	const resolved_path = resolve_path(path);

	return resolved_path.slice(resolved_base.length + 1);
}

/**
 * @param { string | string[] } string_or_array
 * @returns { string[] }
 */
export function get_string_array(string_or_array) {
	return Array.isArray(string_or_array) ? string_or_array : [string_or_array];
}

/**
 * @param { string } path
 * @returns { boolean }
 */
export function is_markdown(path) {
	return is_md(path) || is_mdx(path);
}

/**
 * @param { string } path
 * @returns { boolean }
 */
export function is_md(path) {
	return path.endsWith('.md');
}

/**
 * @param { string } path
 * @returns { boolean }
 */
export function is_mdx(path) {
	return path.endsWith('.mdx');
}

/**
 * @param { string } path
 * @returns { boolean }
 */
export function is_ast_json(path) {
	return path.endsWith('.ast.json');
}

/**
 * @param { string } path
 * @returns { boolean }
 */
export function is_md_json(path) {
	return path.endsWith('.md.json');
}

/**
 * @param { string } path
 * @returns { boolean }
 */
export function is_mdx_json(path) {
	return path.endsWith('.mdx.json');
}

/**
 * @param { string } path
 * @returns { boolean }
 */
export function is_json(path) {
	return path.endsWith('.json') && !is_ast_json(path);
}

/**
 * Get `mdast`.
 *
 * @param { string } markdown
 * @returns { import('remark-mdx').Root }
 */
export function get_mdast(markdown) {
	return remark().use(remark_frontmatter, ['yaml']).parse(markdown);
}

/**
 * Get MDX flavored `mdast`.
 *
 * @param { string } markdown
 * @returns { import('remark-mdx').Root }
 */
export function get_mdxast(markdown) {
	return (
		remark()
			.use(remark_frontmatter, ['yaml'])
			.use(remark_mdx)
			// @ts-ignore
			.use(remark_comment, { ast: true })
			.parse(markdown)
	);
}

/**
 * @param { { type: string } | null } parent
 * @returns { boolean }
 */
export function is_mdast_root_child(parent) {
	return parent && parent.type === 'root' ? true : false;
}

/**
 * @param { { type: string } } node
 * @returns { boolean }
 */
export function is_mdast_frontmatter(node) {
	return node.type === 'yaml' ? true : false;
}

/**
 * @param { { type: string, children?: { type: string }[] } } node
 * @returns { boolean }
 */
export function is_mdxast_jsx_element(node) {
	return is_mdxast_jsx_flow_element(node) || is_mdxast_jsx_text_element(node);
}

/**
 * @param { { type: string, children?: { type: string }[] } } node
 * @returns { boolean }
 */
export function is_mdxast_jsx_flow_element(node) {
	return node.type === 'mdxJsxFlowElement' ? true : false;
}

/**
 * @param { { type: string, children?: { type: string }[] } } node
 * @returns { boolean }
 */
export function is_mdxast_jsx_text_element(node) {
	return node.type === 'mdxJsxTextElement' ||
		(node.type === 'paragraph' && node.children && node.children[0].type === 'mdxJsxTextElement')
		? true
		: false;
}

/**
 * @param { import('remark-mdx').Root } ast
 * @param { string } source_path
 * @param { import('@types').Config } config
 * @returns { string[] }
 */
export function get_translatable_strings(
	ast,
	source_path,
	{
		components = {},
		frontmatter = [],
		ignoredNodes = ['code', 'comment', 'mdxFlowExpression', 'mdxjsEsm']
	}
) {
	const names = Object.keys(components);
	const fields = frontmatter;

	/** @type { string[] } */
	const strings = [];

	visit(ast, (node, __, parent) => {
		if (!is_mdast_root_child(parent) || ignoredNodes.includes(node.type)) return;

		if (is_mdast_frontmatter(node)) {
		}

		if (is_mdx(source_path)) {
			if (is_mdxast_jsx_element(node)) {
				/** @type { import("mdast-util-mdx").MdxJsxFlowElement | undefined } */
				const jsx_element_node = is_mdxast_jsx_flow_element(node)
					? node
					: // @ts-expect-error
					node.children
					? // @ts-expect-error
					  node.children[0]
					: undefined;

				if (!jsx_element_node) return;

				const { name, attributes, children } = jsx_element_node;

				if (!name || (name && !names.includes(name))) return;

				if (attributes) {
					for (const attribute of attributes) {
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
									if (node.key.type === 'SimpleLiteral' || node.key.type === 'PrivateIdentifier')
										return;
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
