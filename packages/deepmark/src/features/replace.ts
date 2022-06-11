import type { TargetLanguageCode } from 'deepl-node';
import type { Config, DocusaurusTranslations, JSXElement, MdRoot } from '$types';

import { parse as parse_yaml, stringify as stringify_yaml } from 'yaml';
import {
	eswalk,
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
	is_mdast_jsx_attribute_value_expression,
	is_mdast_text,
	is_mdast_paragraph,
	unwalk
} from '$utils';

export function replace_mdast_strings(
	mdast: MdRoot,
	strings: { [Language in TargetLanguageCode]?: string[] },
	{ components_attributes, frontmatter, ignore_components, ignore_nodes }: Config
): { [Language in TargetLanguageCode]?: string } {
	const markdowns: { [Language in TargetLanguageCode]?: string } = {};

	for (const language in strings) {
		const _strings = strings[language as TargetLanguageCode]?.reverse();

		if (!_strings) continue;

		unwalk(mdast, (node, parent) => {
			if (!is_mdast_root(parent) || ignore_nodes.includes(node.type)) return;

			if (node.position) delete node.position;

			if (is_mdast_yaml(node)) {
				if (frontmatter.length === 0) return;

				const object: Record<string, any> = parse_yaml(node.value);

				for (const key in object) {
					if (!frontmatter.includes(key)) continue;

					const value = object[key];

					if (typeof value === 'string') {
						object[key] = _strings.pop();
						continue;
					}

					if (Array.isArray(value)) {
						object[key] = value.map((item) => {
							if (typeof item !== 'string') return item;
							return _strings.pop();
						});
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
							attribute.value = _strings.pop();
						} else if (
							is_mdast_jsx_attribute_value_expression(attribute.value) &&
							attribute.value.data?.estree
						) {
							const estree = attribute.value.data.estree;

							eswalk(estree, {
								Literal(node) {
									if (typeof node.value === 'string') node.value = _strings.pop()!;
								},
								Property(node, parents) {
									if (!is_estree_identifier(node.key)) return false;

									let property_path = resolve_estree_property_path(node, parents, name);
									if (!property_path) return false;
									if (!components_attributes[jsx_node.name!].includes(property_path)) return false;
								},
								JSXElement(node) {
									const estree = get_estree(_strings.pop()!);

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
						const mdast = get_mdast(_strings.pop()!);
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

						if (is_mdast_paragraph(child) && is_mdast_paragraph(translated_node)) {
							child.children = translated_node.children;

							continue;
						}

						if (is_mdast_text(child) && is_mdast_paragraph(translated_node)) {
							if (is_mdast_text(translated_node.children[0]))
								child.value = translated_node.children[0].value;

							continue;
						}

						console.log(translated_node);
					}
				}

				return;
			}

			const translated_node = get_mdast(_strings.pop()!).children[0];

			for (const property in node) {
				// @ts-ignore
				node[property] = translated_node[property];
			}
		});

		markdowns[language as TargetLanguageCode] = get_markdown(mdast);
	}

	return markdowns;
}

export function replace_docusaurus_strings(
	object: DocusaurusTranslations,
	strings: { [Language in TargetLanguageCode]?: string[] }
): { [Language in TargetLanguageCode]?: string } {
	const keys = Object.keys(object);
	const jsons: { [Language in TargetLanguageCode]?: string } = {};

	for (const language in strings) {
		const _strings = strings[language as TargetLanguageCode];
		for (let i = 0; i < _strings!.length; i++) {
			object[keys[i]].message = _strings![i];
		}

		jsons[language as TargetLanguageCode] = JSON.stringify(object);
	}

	return jsons;
}
