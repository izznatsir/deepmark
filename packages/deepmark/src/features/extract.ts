import type { Config, DocusaurusTranslations, MdRoot } from '../types/index.js';

import { parse as parseYaml } from 'yaml';
import {
	eswalk,
	isArray,
	isEmptyArray,
	isEmptyString,
	isEstreeIdentifier,
	isMdastJsxAttribute,
	isMdastJsxElement,
	isMdastJsxFlowElement,
	isMdastText,
	isMdastYaml,
	isObject,
	isString,
	resolveEstreePropertyPath,
	unwalk
} from '../utilities/index.js';

export function extractMdastStrings(mdast: MdRoot, { include, exclude }: Config): string[] {
	const strings: string[] = [];

	unwalk(
		mdast,
		(node, __, _) => {
			if (isMdastText(node)) {
				pushTidyString(strings, node.value);
				return;
			}

			if (isMdastJsxFlowElement(node)) {
				const { attributes, name } = node;

				if (!name || exclude.elements.jsx.includes(name)) return;

				if (attributes) {
					for (const attribute of attributes) {
						if (!isMdastJsxAttribute(attribute)) continue;

						const { name, value } = attribute;

						if (isString(value)) {
							if (!include.elements.jsxAttributes[node.name!]?.includes(name)) continue;
							strings.push(value.trim());
						} else if (value?.data?.estree) {
							const estree = value.data.estree;

							eswalk(estree, {
								Literal(esnode, _) {
									if (!include.elements.jsxAttributes[node.name!]?.includes(name)) return;
									if (isString(esnode.value)) pushTidyString(strings, esnode.value);
								},
								JSXText(esnode, _) {
									if (!include.elements.jsxAttributes[node.name!]?.includes(name)) return;
									pushTidyString(strings, esnode.value);
								},
								Property(esnode, parents) {
									if (!isEstreeIdentifier(esnode.key)) return false;

									const propertyPath = resolveEstreePropertyPath(esnode, parents, name);
									if (!propertyPath) return false;
									if (!include.elements.jsxAttributes[node.name!]?.includes(propertyPath))
										return false;
								}
							});
						}
					}
				}

				return;
			}

			if (isMdastYaml(node)) {
				if (isEmptyArray(include.frontmatterFields)) return;
				if (isEmptyString(node.value)) return;

				const object: Record<string, any> = parseYaml(node.value);

				for (const key in object) {
					if (!include.frontmatterFields.includes(key)) continue;

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
		(node) => {
			if (exclude.elements.markdown.includes(node.type)) return false;
			if (isMdastJsxElement(node) && node.name && exclude.elements.jsx.includes(node.name))
				return false;

			return true;
		}
	);

	return strings;
}

export function extractDocusaurusStrings(object: DocusaurusTranslations): string[] {
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
