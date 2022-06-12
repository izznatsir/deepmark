import type { Config, DocusaurusTranslations, MdContent, MdRoot } from '../types/index.js';

import { mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { parse as parse_yaml } from 'yaml';
import {
	eswalk,
	generate,
	GENERATOR,
	JSX,
	is_mdast_root,
	is_mdast_yaml,
	is_mdast_jsx_attribute,
	is_mdast_jsx_element,
	is_mdast_jsx_flow_element,
	is_mdast_jsx_text_element,
	is_estree_identifier,
	resolve_estree_property_path,
	unwalk,
	is_mdast_list,
	is_mdast_paragraph
} from '../utilities/index.js';

export function extract_mdast_strings(
	mdast: MdRoot,
	{ components_attributes, frontmatter, ignore_components, ignore_nodes }: Config
): string[] {
	const strings: string[] = [];

	unwalk(mdast, (node, parent) => {
		if (!is_mdast_root(parent) || ignore_nodes.includes(node.type)) return;

		if (is_mdast_yaml(node)) {
			if (frontmatter.length === 0) return;

			const object: Record<string, any> = parse_yaml(node.value);

			for (const key in object) {
				if (!frontmatter.includes(key)) continue;

				const value = object[key];

				if (typeof value === 'string') {
					strings.push(value);
					continue;
				}

				if (Array.isArray(value)) {
					for (const item of value) {
						if (typeof item !== 'string') continue;
						strings.push(item);
					}
				}
			}

			return;
		}

		if (is_mdast_jsx_element(node)) {
			const jsx_node =
				is_mdast_jsx_flow_element(node) || is_mdast_jsx_text_element(node)
					? node
					: node.children[0];

			const { attributes, children, name } = jsx_node;

			if (!name || ignore_components.includes(name)) return;

			if (attributes) {
				for (const attribute of attributes) {
					if (!is_mdast_jsx_attribute(attribute)) continue;

					const { name, value } = attribute;

					if (typeof value === 'string') {
						if (!components_attributes[jsx_node.name!]?.includes(name)) continue;
						strings.push(value);
					} else if (value?.data?.estree) {
						const estree = value.data.estree;

						eswalk(estree, {
							Literal(node) {
								if (typeof node.value === 'string') strings.push(node.value);
							},
							Property(node, parents) {
								if (!is_estree_identifier(node.key)) return false;

								let property_path = resolve_estree_property_path(node, parents, name);
								if (!property_path) return false;
								if (!components_attributes[jsx_node.name!]?.includes(property_path)) return false;
							},
							JSXElement(node) {
								strings.push(generate(node, { generator: { ...GENERATOR, ...JSX } }));
							}
						});
					}
				}
			}

			if (
				(!components_attributes[name] || components_attributes[name].includes('children')) &&
				children.length > 0
			) {
				for (const child of children) {
					const string = toMarkdown(child, { extensions: [mdxToMarkdown()] }).trimEnd();
					strings.push(string);
				}
			}

			return;
		}

		if (is_mdast_list(node)) {
			for (const item of node.children) {
				for (const child of item.children) {
					if (!is_mdast_paragraph(child)) continue;

					const string = toMarkdown(child, { extensions: [mdxToMarkdown()] }).trimEnd();
					strings.push(string);
				}
			}

			return;
		}

		const string = toMarkdown(node as MdContent, { extensions: [mdxToMarkdown()] }).trimEnd();
		strings.push(string);
	});

	return strings;
}

export function extract_docusaurus_strings(object: DocusaurusTranslations): string[] {
	const strings: string[] = [];

	for (const key in object) {
		const value = object[key];

		if (typeof value === 'string') {
			strings.push(value);
			continue;
		}

		if (typeof value === 'object') {
			if ('message' in value) {
				strings.push(value.message);
				if ('description' in value) strings.push(value.description);
				continue;
			}

			if ('type' in value) {
				if ('title' in value) strings.push(value.title!);
				if ('description' in value) strings.push(value.description!);
				continue;
			}
		}
	}

	return strings;
}
