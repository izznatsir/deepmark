import type { TargetLanguageCode } from 'deepl-node';
import type { Config, JSXElement, MdRoot, MdxJsxFlowElement, MdxJsxTextElement } from '$types';

import { parse as parse_yaml, stringify as stringify_yaml } from 'yaml';
import {
	is_mdast_root,
	is_mdast_yaml,
	is_mdast_jsx_attribute,
	is_mdast_jsx_element,
	is_mdast_jsx_flow_element,
	is_mdast_jsx_text_element,
	is_mdast_paragraph_jsx_text_element,
	is_estree_identifier,
	is_estree_jsx_element,
	get_estree,
	get_js,
	get_markdown,
	get_mdast,
	resolve_estree_property_path,
	is_estree_expression_statement,
	is_mdast_jsx_attribute_value_expression
} from '$utils';
import { eswalk } from '../eswalk.js';
import { unwalk } from '../unwalk.js';

export function replace(
	root: MdRoot,
	translations: { [Language in TargetLanguageCode]?: string[] },
	{ components_attributes, frontmatter, ignore_components, ignore_nodes }: Config
): { [Language in TargetLanguageCode]?: string } {
	const replaced: { [Language in TargetLanguageCode]?: string } = {};

	for (const language in translations) {
		const _translations = translations[language as TargetLanguageCode];

		if (!_translations) continue;

		unwalk(root, (node, parent) => {
			if (!is_mdast_root(parent) || ignore_nodes.includes(node.type)) return;

			if (is_mdast_yaml(node)) {
				if (frontmatter.length === 0) return;

				const object: Record<string, any> = parse_yaml(node.value);

				for (const key in object) {
					const value = object[key];
					if (frontmatter.includes(key) && typeof value === 'string') {
						object[key] = _translations.pop();
					}
				}

				node.value = stringify_yaml(object);

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

						if (!attribute.value) continue;

						if (typeof attribute.value === 'string') {
							if (!components_attributes[jsx_node.name!].includes(name)) continue;
							attribute.value = _translations.pop();
						} else if (
							is_mdast_jsx_attribute_value_expression(attribute.value) &&
							attribute.value.data?.estree
						) {
							const estree = attribute.value.data.estree;

							eswalk(estree, {
								Literal(node) {
									if (typeof node.value === 'string') node.value = _translations.pop()!;
								},
								Property(node, parents) {
									if (!is_estree_identifier(node.key)) return false;

									let property_path = resolve_estree_property_path(node, parents, name);
									if (!property_path) return false;
									if (!components_attributes[jsx_node.name!].includes(property_path)) return false;
								},
								JSXElement(node) {
									const estree = get_estree(_translations.pop()!);

									if (
										!is_estree_expression_statement(estree.body[0]) ||
										!is_estree_jsx_element(estree.body[0].expression)
									)
										return;

									const translated_node = estree.body[0].expression;

									for (const property in node) {
										node[property as keyof JSXElement] =
											translated_node[property as keyof JSXElement];
									}
								}
							});

							const attribute_value = get_js(estree);
							const attribute_estree = get_estree(attribute_value);

							attribute.value.value = attribute_value;
							attribute.value.data.estree = attribute_estree;
						}
					}
				}

				if (
					(!components_attributes[name] || components_attributes[name].includes('children')) &&
					children.length > 0
				) {
					for (const child of children) {
						const mdast = get_mdast(_translations.pop()!);
						const translated_node = mdast.children[0];

						if (
							(is_mdast_jsx_flow_element(child) && is_mdast_jsx_flow_element(translated_node)) ||
							(is_mdast_jsx_text_element(child) && is_mdast_jsx_text_element(translated_node))
						) {
							for (const property in child) {
								// @ts-ignore
								child[property] = translated_node[property];
							}

							continue;
						}

						if (
							is_mdast_jsx_text_element(child) &&
							is_mdast_paragraph_jsx_text_element(translated_node)
						) {
							for (const property in child) {
								// @ts-ignore
								child[property] = translated_node.children[0][property];
							}

							continue;
						}
					}
				}

				return;
			}

			const translated_node = get_mdast(_translations.pop()!);

			for (const property in node) {
				// @ts-ignore
				node[property] = translated_node[property];
			}
		});

		replaced[language as TargetLanguageCode] = get_markdown(root);
	}

	return replaced;
}
