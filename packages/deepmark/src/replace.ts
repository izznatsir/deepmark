import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import {
	EsJsxElement,
	EsJsxIdentifier,
	esNodeIs,
	resolveEstreePropertyPath
} from './ast/estree.js';
import { eswalk } from './ast/eswalk.js';
import type { MdNodeType, MdRoot } from './ast/mdast.js';
import { mdNodeIs, mdNodeIsJsxElement } from './ast/mdast.js';
import { unwalk } from './ast/unwalk.js';
import {
	type Config,
	isHtmlTag,
	isFrontmatterFieldIncluded,
	isHtmlElementIncluded,
	isHtmlElementAttributeIncluded,
	isJsonOrYamlPropertyIncluded,
	isJsxComponentIncluded,
	isJsxComponentAttributeIncluded,
	isMarkdownNodeIncluded,
	isHtmlElementChildrenIncluded,
	isJsxComponentChildrenIncluded
} from './config.js';
import { isArray, isEmptyArray, isEmptyString, isObject, isString } from './utils.js';

export function replaceMdastStrings({
	mdast,
	config,
	strings
}: {
	mdast: MdRoot;
	strings: string[];
	config: Config;
}): MdRoot {
	strings = strings.reverse();

	unwalk(
		mdast,
		(node, __, _) => {
			if (mdNodeIs(node, 'text')) {
				node.value = strings.pop()!;
				return;
			}

			if (mdNodeIsJsxElement(node) && node.name) {
				if (isHtmlTag(node.name)) {
					for (const attribute of node.attributes) {
						if (!mdNodeIs(attribute, 'mdxJsxAttribute')) continue;

						if (
							!isHtmlElementAttributeIncluded({ tag: node.name, attribute: attribute.name, config })
						)
							continue;

						if (isString(attribute.value)) {
							strings.push(attribute.value.trim());
						} else if (attribute.value?.data?.estree) {
							const estree = attribute.value.data.estree;

							eswalk(estree, {
								SimpleLiteral(esnode, _) {
									if (isString(esnode.value)) esnode.value = strings.pop()!;
								}
							});
						}
					}
				} else {
					for (const attribute of node.attributes) {
						if (!mdNodeIs(attribute, 'mdxJsxAttribute')) continue;

						const componentName: string = node.name;

						const isAttributeIncluded = isJsxComponentAttributeIncluded({
							name: componentName,
							attribute: attribute.name,
							config
						});

						if (isString(attribute.value)) {
							if (!isAttributeIncluded) continue;

							strings.push(attribute.value.trim());
						} else if (attribute.value?.data?.estree) {
							if (
								!config.jsxComponents.include[componentName] ||
								!config.jsxComponents.include[componentName].attributes.some(
									(attrName) =>
										attrName === attribute.name || attrName.startsWith(`${attribute.name}.`)
								)
							)
								continue;

							const estree = attribute.value.data.estree;

							eswalk(estree, {
								SimpleLiteral(esnode, _) {
									if (isString(esnode.value)) esnode.value = strings.pop()!;
								},
								JSXElement(esnode, _) {
									const name = (esnode.openingElement.name as EsJsxIdentifier).name;

									if (isHtmlTag(name)) {
										if (
											!isHtmlElementIncluded({ tag: name, config }) ||
											!isHtmlElementChildrenIncluded({ tag: name, config })
										)
											return false;
									} else if (
										!isJsxComponentIncluded({ name: name, config }) ||
										!isJsxComponentChildrenIncluded({ name: name, config })
									)
										return false;
								},
								JSXAttribute(esnode, parents) {
									const name =
										typeof esnode.name.name === 'string' ? esnode.name.name : esnode.name.name.name;
									const parentName = (
										(parents[parents.length - 1] as EsJsxElement).openingElement
											.name as EsJsxIdentifier
									).name;

									if (isHtmlTag(parentName)) {
										if (
											!isHtmlElementAttributeIncluded({ tag: parentName, attribute: name, config })
										)
											return false;
									} else if (
										!config.jsxComponents.include[name] ||
										!config.jsxComponents.include[name].attributes.some(
											(attrName) =>
												attrName === attribute.name || attrName.startsWith(`${attribute.name}.`)
										)
									) {
										return false;
									}
								},
								JSXText(esnode, _) {
									esnode.value = strings.pop()!;
								},
								Property(esnode, parents) {
									if (!esNodeIs(esnode, 'Identifier')) return false;

									const propertyPath = resolveEstreePropertyPath(esnode, parents, attribute.name);

									if (
										!propertyPath ||
										!isJsxComponentAttributeIncluded({
											name: componentName,
											attribute: propertyPath,
											config
										})
									)
										return false;
								}
							});
						}
					}
				}
			}

			if (mdNodeIs(node, 'yaml')) {
				if (isEmptyArray(config.frontmatterFields.include)) return;
				if (isEmptyString(node.value)) return;

				const object: Record<string, any> = parseYaml(node.value);

				for (const field in object) {
					if (!isFrontmatterFieldIncluded({ field, config })) continue;

					const value = object[field];

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
			if (!isMarkdownNodeIncluded({ type: node.type as MdNodeType, config })) return false;

			if (parent && mdNodeIsJsxElement(parent) && parent.name) {
				if (isHtmlTag(parent.name)) {
					if (!isHtmlElementChildrenIncluded({ tag: parent.name, config })) return false;
				} else {
					if (!isJsxComponentChildrenIncluded({ name: parent.name, config })) return false;
				}

				return true;
			}

			if (mdNodeIsJsxElement(node) && node.name) {
				if (isHtmlTag(node.name)) {
					if (!isHtmlElementIncluded({ tag: node.name, config })) return false;
				} else {
					if (!isJsxComponentIncluded({ name: node.name, config })) return false;
				}

				return true;
			}

			return true;
		}
	);

	return mdast;
}

export function replaceJsonOrYamlStrings({
	source,
	type = 'json',
	strings,
	config
}: {
	source: string;
	type?: 'json' | 'yaml';
	strings: string[];
	config: Config;
}): string {
	if (isEmptyArray(config.jsonOrYamlProperties.include)) return source;

	const parsed = type === 'json' ? JSON.parse(source) : parseYaml(source);

	process({ value: parsed });

	function process(args: { value: unknown; parent?: never; property?: never; index?: never }): void;
	function process(args: {
		value: unknown;
		parent: unknown[];
		property?: string | number | symbol;
		index: number;
	}): void;
	function process(args: {
		value: unknown;
		parent: Record<string | number | symbol, unknown>;
		property: string | number | symbol;
		index?: never;
	}): void;
	function process({
		value,
		parent,
		property,
		index
	}: {
		value: unknown;
		parent?: unknown[] | Record<string | number | symbol, unknown>;
		property?: string | number | symbol;
		index?: number;
	}) {
		if (isArray(value)) {
			for (const [index, item] of value.entries()) {
				process({ value: item, parent: value, property, index });
			}
			return;
		}

		if (isObject(value)) {
			for (const property in value) {
				const item = (value as Record<string | number | symbol, unknown>)[property];
				process({ value: item, parent: value, property });
			}
			return;
		}

		if (typeof value === 'string') {
			if (property && isJsonOrYamlPropertyIncluded({ property, config })) {
				if (isArray(parent) && index) {
					parent[index] = strings.pop();

					return;
				}

				if (isObject(parent)) {
					parent[property] = strings.pop();

					return;
				}
			}
			return;
		}
	}

	if (type === 'json') return JSON.stringify(parsed);
	return stringifyYaml(parsed);
}
