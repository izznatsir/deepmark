import type { UnNode } from './ast/unist.js';

import { parse as parseYaml } from 'yaml';
import { esNodeIs, resolveEstreePropertyPath } from './ast/estree.js';
import { eswalk } from './ast/eswalk.js';
import { mdNodeIs, mdNodeIsJsxElement, MdNodeType } from './ast/mdast.js';
import { unwalk } from './ast/unwalk.js';
import { type Config, isDefault, isHtmlTag } from './config.js';
import { isArray, isEmptyArray, isEmptyString, isObject, isString } from './utils.js';

export function extractMdastStrings(
	mdast: UnNode,
	{ markdownNodes, frontmatterFields, htmlElements, jsxComponents }: Config
): string[] {
	const strings: string[] = [];

	unwalk(
		mdast,
		(node, __, _) => {
			if (mdNodeIs(node, 'text')) {
				pushTidyString(strings, node.value);
				return;
			}

			if (mdNodeIsJsxElement(node) && node.name) {
				if (isHtmlTag(node.name)) {
					for (const attribute of node.attributes) {
						if (!mdNodeIs(attribute, 'mdxJsxAttribute')) continue;

						const isIncludedShalowly =
							htmlElements.include[node.name].attributes.includes(attribute.name) &&
							!htmlElements.exclude.includes(node.name);

						if (!isIncludedShalowly) continue;

						if (isString(attribute.value)) {
							strings.push(attribute.value.trim());
						} else if (attribute.value?.data?.estree) {
							const estree = attribute.value.data.estree;

							eswalk(estree, {
								SimpleLiteral(esnode, _) {
									if (isString(esnode.value)) pushTidyString(strings, esnode.value);
								}
							});
						}
					}
				} else {
					for (const attribute of node.attributes) {
						if (!mdNodeIs(attribute, 'mdxJsxAttribute')) continue;

						const elementName: string = node.name;

						if (isDefault(jsxComponents.include) || !jsxComponents.include[elementName]) continue;

						const isIncludedShalowly =
							jsxComponents.include[elementName].attributes.includes(attribute.name) &&
							!jsxComponents.exclude.includes(elementName);

						if (isString(attribute.value)) {
							if (!isIncludedShalowly) continue;

							strings.push(attribute.value.trim());
						} else if (attribute.value?.data?.estree) {
							const estree = attribute.value.data.estree;

							eswalk(estree, {
								SimpleLiteral(esnode, _) {
									if (!isIncludedShalowly) return;
									if (isString(esnode.value)) pushTidyString(strings, esnode.value);
								},
								JSXText(esnode, _) {
									if (!isIncludedShalowly) return;
									pushTidyString(strings, esnode.value);
								},
								Property(esnode, parents) {
									if (
										isDefault(jsxComponents.include) ||
										jsxComponents.exclude.includes(elementName) ||
										!esNodeIs(esnode, 'Identifier')
									)
										return false;

									const propertyPath = resolveEstreePropertyPath(esnode, parents, attribute.name);

									if (
										!propertyPath ||
										!jsxComponents.include[elementName].attributes.includes(propertyPath)
									)
										return false;
								}
							});
						}
					}
				}
			}

			if (mdNodeIs(node, 'yaml')) {
				if (isEmptyArray(frontmatterFields.include)) return;
				if (isEmptyString(node.value)) return;

				const object: Record<string, any> = parseYaml(node.value);

				for (const key in object) {
					if (!frontmatterFields.include.includes(key)) continue;

					const value = object[key];

					if (isString(value)) {
						strings.push(value);
						continue;
					}

					if (isArray(value)) {
						for (const item of value) {
							if (!isString(item)) continue;
							strings.push(item);
						}
					}
				}

				return;
			}
		},
		(node, parent) => {
			if (
				!markdownNodes.include.includes(node.type as MdNodeType) ||
				markdownNodes.exclude.includes(node.type as MdNodeType)
			)
				return false;

			if (parent && mdNodeIs(node, 'text') && mdNodeIsJsxElement(parent) && parent.name) {
				if (isHtmlTag(parent.name)) {
					if (
						(htmlElements.include[parent.name] && !htmlElements.include[parent.name].children) ||
						htmlElements.exclude.includes(parent.name)
					)
						return false;
				} else {
					if (
						(!isDefault(jsxComponents.include) &&
							!jsxComponents.include[parent.name] &&
							!jsxComponents.include[parent.name].children) ||
						jsxComponents.exclude.includes(parent.name)
					)
						return false;
				}

				return true;
			}

			if (mdNodeIsJsxElement(node) && node.name) {
				if (isHtmlTag(node.name)) {
					if (!htmlElements.include[node.name] || htmlElements.exclude.includes(node.name))
						return false;
				} else {
					if (
						(!isDefault(jsxComponents.include) && !jsxComponents.include[node.name]) ||
						jsxComponents.exclude.includes(node.name)
					) {
						return false;
					}
				}

				return true;
			}

			return true;
		}
	);

	return strings;
}

export function extractDocusaurusStrings(object: Record<string, any>): string[] {
	const strings: string[] = [];

	for (const key in object) {
		const value = object[key];

		if (isString(value)) {
			strings.push(value);
			continue;
		}

		if (isObject(value)) {
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

function pushTidyString(strings: string[], string: string) {
	if (!/^\s*$/.test(string)) {
		strings.push(string.replace(/(^\n|\r|\t|\v)+\s*/, '').replace(/\s+$/, ' '));
	}
}
