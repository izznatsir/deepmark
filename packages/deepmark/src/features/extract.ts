import type { Config, MdContent, MdRoot } from '$types';

import { mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { parse as parse_yaml } from 'yaml';
import { generate, GENERATOR, JSX } from '../astring-jsx.js';
import { eswalk } from '../eswalk.js';
import { unwalk } from '../unwalk.js';
import {
	is_mdast_root,
	is_mdast_yaml,
	is_mdast_jsx_attribute,
	is_mdast_jsx_element,
	is_mdast_jsx_flow_element,
	is_mdast_jsx_text_element,
	is_estree_identifier,
	resolve_estree_property_path
} from '$utils';

export function extract(root: MdRoot, { components, frontmatter, ignore_nodes }: Config): string[] {
	const component_names = Object.keys(components);

	const strings: string[] = [];

	unwalk(root, (node, parent) => {
		if (!is_mdast_root(parent) || ignore_nodes.includes(node.type)) return;

		if (is_mdast_yaml(node)) {
			if (frontmatter.length === 0) return;

			const object: Record<string, any> = parse_yaml(node.value);

			for (const key in object) {
				const value = object[key];
				if (frontmatter.includes(key) && typeof value === 'string') {
					strings.push(value);
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

			if (!name || !component_names.includes(name)) return;

			if (attributes) {
				for (const attribute of attributes) {
					if (!is_mdast_jsx_attribute(attribute)) continue;

					const { name, value } = attribute;

					if (typeof value === 'string') {
						if (!components[jsx_node.name!].includes(name)) continue;
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
								// console.log(property_path);
								if (!property_path) return false;
								if (!components[jsx_node.name!].includes(property_path)) return false;
							},
							JSXElement(node) {
								strings.push(generate(node, { generator: { ...GENERATOR, ...JSX } }));
							}
						});
					}
				}
			}

			if (components[name].includes('children') && children.length > 0) {
				for (const child of children) {
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
