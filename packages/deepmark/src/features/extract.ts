import type { Config, DocusaurusTranslations, MdRoot } from '../types/index.js';

import { parse as parse_yaml } from 'yaml';
import {
	eswalk,
	is_array,
	is_empty_array,
	is_empty_string,
	is_estree_identifier,
	is_mdast_jsx_attribute,
	is_mdast_jsx_flow_element,
	is_mdast_text,
	is_mdast_yaml,
	is_object,
	is_string,
	resolve_estree_property_path,
	unwalk
} from '../utilities/index.js';

export function extract_mdast_strings(
	mdast: MdRoot,
	{ components_attributes, frontmatter, ignore_components, ignore_nodes }: Config
): string[] {
	const strings: string[] = [];

	unwalk(
		mdast,
		(node, __, _) => {
			if (is_mdast_text(node)) {
				if (!/^\s*$/.test(node.value)) {
					strings.push(node.value);
				}

				return;
			}

			if (is_mdast_jsx_flow_element(node)) {
				const { attributes, name } = node;

				if (!name || ignore_components.includes(name)) return;

				if (attributes) {
					for (const attribute of attributes) {
						if (!is_mdast_jsx_attribute(attribute)) continue;

						const { name, value } = attribute;

						if (is_string(value)) {
							if (!components_attributes[node.name!]?.includes(name)) continue;
							strings.push(value);
						} else if (value?.data?.estree) {
							const estree = value.data.estree;

							eswalk(estree, {
								Literal(esnode, _) {
									if (is_string(esnode.value)) strings.push(esnode.value);
								},
								JSXText(esnode, _) {
									if (!/^\s*$/.test(esnode.value)) {
										strings.push(esnode.value.replace(/(\n|\r|\t|\v)+\s*/, ''));
									}
								},
								Property(esnode, parents) {
									if (!is_estree_identifier(esnode.key)) return false;

									const property_path = resolve_estree_property_path(esnode, parents, name);
									if (!property_path) return false;
									if (!components_attributes[node.name!]?.includes(property_path)) return false;
								}
							});
						}
					}
				}

				return;
			}

			if (is_mdast_yaml(node)) {
				if (is_empty_array(frontmatter)) return;
				if (is_empty_string(node.value)) return;

				const object: Record<string, any> = parse_yaml(node.value);

				for (const key in object) {
					if (!frontmatter.includes(key)) continue;

					const value = object[key];

					if (is_string(value)) {
						strings.push(value);
						continue;
					}

					if (is_array(value)) {
						for (const item of value) {
							if (!is_string(item)) continue;
							strings.push(item);
						}
					}
				}

				return;
			}
		},
		(type) => !ignore_nodes.includes(type)
	);

	return strings;
}

export function extract_docusaurus_strings(object: DocusaurusTranslations): string[] {
	const strings: string[] = [];

	for (const key in object) {
		const value = object[key];

		if (is_string(value)) {
			strings.push(value);
			continue;
		}

		if (is_object(value)) {
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
