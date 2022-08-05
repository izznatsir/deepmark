import type { Config, DocusaurusTranslations, MdRoot } from '../types/index.js';

import { parse as parseYaml } from 'yaml';
import {
	HTML_TAGS,
	eswalk,
	isArray,
	isEmptyArray,
	isEmptyString,
	isEstreeIdentifier,
	isMdastJsxAttribute,
	isMdastJsxElement,
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

			if (isMdastJsxElement(node) && node.name) {
				if (HTML_TAGS.includes(node.name)) {
					for (const attribute of node.attributes) {
						if (!isMdastJsxAttribute(attribute)) continue;

						const elementName = node.name;

						const isIncludedShalowly =
							include.elements.htmlAttributes[elementName].includes(attribute.name) &&
							(!exclude.elements.htmlAttributes[elementName] ||
								!exclude.elements.htmlAttributes[elementName].includes(attribute.name));

						if (!isIncludedShalowly) continue;

						if (isString(attribute.value)) {
							strings.push(attribute.value.trim());
						} else if (attribute.value?.data?.estree) {
							const estree = attribute.value.data.estree;

							eswalk(estree, {
								Literal(esnode, _) {
									if (isString(esnode.value)) pushTidyString(strings, esnode.value);
								}
							});
						}
					}
				} else {
					for (const attribute of node.attributes) {
						if (!isMdastJsxAttribute(attribute)) continue;

						const elementName = node.name;

						if (!include.elements.jsxAttributes[elementName]) continue;

						const isIncludedShalowly =
							include.elements.jsxAttributes[elementName].includes(attribute.name) &&
							(!exclude.elements.jsxAttributes[elementName] ||
								!exclude.elements.jsxAttributes[elementName].includes(attribute.name));

						if (isString(attribute.value)) {
							if (!isIncludedShalowly) continue;

							strings.push(attribute.value.trim());
						} else if (attribute.value?.data?.estree) {
							const estree = attribute.value.data.estree;

							eswalk(estree, {
								Literal(esnode, _) {
									if (!isIncludedShalowly) return;
									if (isString(esnode.value)) pushTidyString(strings, esnode.value);
								},
								JSXText(esnode, _) {
									if (!isIncludedShalowly) return;
									pushTidyString(strings, esnode.value);
								},
								Property(esnode, parents) {
									if (!isEstreeIdentifier(esnode.key)) return false;

									const propertyPath = resolveEstreePropertyPath(esnode, parents, attribute.name);

									if (
										!propertyPath ||
										!include.elements.jsxAttributes[elementName].includes(propertyPath) ||
										(exclude.elements.jsxAttributes[elementName] &&
											exclude.elements.jsxAttributes[elementName].includes(propertyPath))
									)
										return false;
								}
							});
						}
					}
				}
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
		(node, parent) => {
			if (
				(include.elements.markdown.length > 0 && !include.elements.markdown.includes(node.type)) ||
				(exclude.elements.markdown.length > 0 && exclude.elements.markdown.includes(node.type))
			)
				return false;

			if (parent && isMdastText(node) && isMdastJsxElement(parent) && parent.name) {
				if (HTML_TAGS.includes(parent.name)) {
					if (
						(include.elements.htmlAttributes[parent.name] &&
							!include.elements.htmlAttributes[parent.name].includes('children')) ||
						(exclude.elements.htmlAttributes[parent.name] &&
							exclude.elements.htmlAttributes[parent.name].includes('children'))
					)
						return false;
				} else {
					if (
						(include.elements.jsxAttributes[parent.name] &&
							!include.elements.jsxAttributes[parent.name].includes('children')) ||
						(exclude.elements.jsxAttributes[parent.name] &&
							exclude.elements.jsxAttributes[parent.name].includes('children'))
					)
						return false;
				}

				return true;
			}

			if (isMdastJsxElement(node) && node.name) {
				if (HTML_TAGS.includes(node.name)) {
					if (
						(include.elements.html.length > 0 && !include.elements.html.includes(node.name)) ||
						(exclude.elements.html.length > 0 && exclude.elements.html.includes(node.name))
					)
						return false;
				} else {
					if (
						(include.elements.jsx.length > 0 && !include.elements.jsx.includes(node.name)) ||
						(exclude.elements.jsx.length > 0 && exclude.elements.jsx.includes(node.name))
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
