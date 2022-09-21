import { parse as parseYaml } from 'yaml';
import { esNodeIs, resolveEstreePropertyPath } from './ast/estree.js';
import { eswalk } from './ast/eswalk.js';
import { mdNodeIs, mdNodeIsJsxElement, MdNodeType } from './ast/mdast.js';
import type { UnNode } from './ast/unist.js';
import { unwalk } from './ast/unwalk.js';
import {
	type Config,
	isHtmlTag,
	isFrontmatterFieldIncluded,
	isHtmlElementIncluded,
	isHtmlElementAttributeIncluded,
	isJsonPropertyIncluded,
	isJsxComponentIncluded,
	isJsxComponentAttributeIncluded,
	isMarkdownNodeIncluded,
	isHtmlElementChildrenIncluded,
	isJsxComponentChildrenIncluded
} from './config.js';
import { isArray, isEmptyArray, isEmptyString, isObject, isString } from './utils.js';

export function extractMdastStrings(mdast: UnNode, config: Config): string[] {
	const { markdownNodes, frontmatterFields, htmlElements, jsxComponents } = config;
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

						if (!isHtmlElementAttributeIncluded(config, node.name, attribute.name)) continue;

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

						const componentName: string = node.name;

						const isAttributeIncluded = isJsxComponentAttributeIncluded(
							config,
							componentName,
							attribute.name
						);

						if (isString(attribute.value)) {
							if (!isAttributeIncluded) continue;

							strings.push(attribute.value.trim());
						} else if (attribute.value?.data?.estree) {
							const estree = attribute.value.data.estree;

							eswalk(estree, {
								SimpleLiteral(esnode, _) {
									if (!isAttributeIncluded) return;
									if (isString(esnode.value)) pushTidyString(strings, esnode.value);
								},
								JSXText(esnode, _) {
									if (!isAttributeIncluded) return;
									pushTidyString(strings, esnode.value);
								},
								Property(esnode, parents) {
									if (
										!isJsxComponentIncluded(config, componentName) ||
										!esNodeIs(esnode, 'Identifier')
									)
										return false;

									const propertyPath = resolveEstreePropertyPath(esnode, parents, attribute.name);

									if (
										!propertyPath ||
										!isJsxComponentAttributeIncluded(config, componentName, propertyPath)
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
					if (!isHtmlElementChildrenIncluded(config, parent.name)) return false;
				} else {
					if (!isJsxComponentChildrenIncluded(config, parent.name)) return false;
				}

				return true;
			}

			if (mdNodeIsJsxElement(node) && node.name) {
				if (isHtmlTag(node.name)) {
					if (!isHtmlElementIncluded(config, node.name)) return false;
				} else {
					if (!isJsxComponentIncluded(config, node.name)) return false;
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
