import type { TargetLanguageCode } from 'deepl-node';
import type { Config, DocusaurusTranslations, JSXElement, MdRoot } from '../types/index.js';

import { parse as parseYaml, stringify as stringifyYaml } from 'yaml';
import {
	eswalk,
	isMdastRoot,
	isMdastYaml,
	isMdastJsxAttribute,
	isMdastJsxElement,
	isMdastJsxFlowElement,
	isMdastJsxTextElement,
	isEstreeIdentifier,
	isEstreeJsxElement,
	getEstree,
	getJs,
	getMarkdown,
	getMdast,
	resolveEstreePropertyPath,
	isEstreeExpressionStatement,
	isMdastJsxAttributeValueExpression,
	isMdastText,
	isMdastParagraph,
	unwalk,
	isMdastList
} from '../utilities/index.js';

export function replaceMdastStrings(
	mdast: MdRoot,
	strings: { [Language in TargetLanguageCode]?: string[] },
	{ include, exclude }: Config
): { [Language in TargetLanguageCode]?: string } {
	const markdowns: { [Language in TargetLanguageCode]?: string } = {};

	for (const language in strings) {
		const Strings = strings[language as TargetLanguageCode]?.reverse();

		if (!Strings) continue;

		unwalk(mdast, (node, parent) => {
			if (node.position) delete node.position;

			if (!isMdastRoot(parent) || ignore_nodes.includes(node.type)) return;

			if (isMdastYaml(node)) {
				if (frontmatter.length === 0) return;

				const object: Record<string, any> = parseYaml(node.value);

				for (const key in object) {
					if (!frontmatter.includes(key)) continue;

					const value = object[key];

					if (typeof value === 'string') {
						object[key] = Strings.pop();
						continue;
					}

					if (Array.isArray(value)) {
						object[key] = value.map((item) => {
							if (typeof item !== 'string') return item;
							return Strings.pop();
						});
					}
				}

				node.value = stringifyYaml(object);

				return;
			}

			if (isMdastJsxElement(node)) {
				const jsx_node =
					isMdastJsxFlowElement(node) || isMdastJsxTextElement(node) ? node : node.children[0];

				const { attributes, children, name } = jsx_node;

				if (!name || ignore_components.includes(name)) return;

				if (attributes) {
					for (const attribute of attributes) {
						if (!isMdastJsxAttribute(attribute)) continue;

						const { name, value } = attribute;

						if (!attribute.value) continue;

						if (typeof attribute.value === 'string') {
							if (!componentsAttributes[jsx_node.name!]?.includes(name)) continue;
							attribute.value = Strings.pop();
						} else if (
							isMdastJsxAttributeValueExpression(attribute.value) &&
							attribute.value.data?.estree
						) {
							const estree = attribute.value.data.estree;

							eswalk(estree, {
								Literal(node) {
									if (typeof node.value === 'string') node.value = Strings.pop()!;
								},
								Property(node, parents) {
									if (!isEstreeIdentifier(node.key)) return false;

									let propertyPath = resolveEstreePropertyPath(node, parents, name);
									if (!propertyPath) return false;
									if (!componentsAttributes[jsx_node.name!]?.includes(propertyPath)) return false;
								},
								JSXElement(node) {
									const String = Strings.pop()!;
									const estree = getEstree(String);

									if (
										!isEstreeExpressionStatement(estree.body[0]) ||
										!isEstreeJsxElement(estree.body[0].expression)
									)
										return;

									const translated_node = estree.body[0].expression;

									for (const property in node) {
										node[property as keyof JSXElement] =
											translated_node[property as keyof JSXElement];
									}
								}
							});

							const attributeValue = getJs(estree);
							const attributeEstree = getEstree(attributeValue);

							attribute.value.value = attributeValue;
							attribute.value.data.estree = attributeEstree;
						}
					}
				}

				if (
					(!componentsAttributes[name] || componentsAttributes[name].includes('children')) &&
					children.length > 0
				) {
					for (const child of children) {
						if (
							(isMdastJsxFlowElement(child) || isMdastJsxTextElement(child)) &&
							child.name === 'code'
						)
							continue;

						const mdast = getMdast(Strings.pop()!);
						const translated_node = mdast.children[0];

						if (
							(isMdastJsxFlowElement(child) && isMdastJsxFlowElement(translated_node)) ||
							(isMdastJsxTextElement(child) && isMdastJsxTextElement(translated_node))
						) {
							for (const property in child) {
								// @ts-ignore
								child[property] = translated_node[property];
							}

							continue;
						}

						if (isMdastJsxTextElement(child) && isMdastParagraphJsxTextElement(translated_node)) {
							for (const property in child) {
								// @ts-ignore
								child[property] = translated_node.children[0][property];
							}

							continue;
						}

						if (isMdastParagraph(child) && isMdastParagraph(translated_node)) {
							child.children = translated_node.children;

							continue;
						}

						if (isMdastText(child) && isMdastParagraph(translated_node)) {
							if (isMdastText(translated_node.children[0]))
								child.value = translated_node.children[0].value;

							continue;
						}
					}
				}

				return;
			}

			if (isMdastList(node)) {
				for (const item of node.children) {
					for (const child of item.children) {
						if (!isMdastParagraph(child)) continue;

						const String = Strings.pop()!;
						const translated_node = getMdast(String).children[0];

						if (isMdastParagraph(translated_node)) {
							for (const property in child) {
								// @ts-ignore
								child[property] = translated_node[property];
							}
						}
					}
				}

				return;
			}

			const String = Strings.pop()!;
			const translated_node = getMdast(String).children[0];

			for (const property in node) {
				// @ts-ignore
				node[property] = translated_node[property];
			}
		});

		markdowns[language as TargetLanguageCode] = getMarkdown(mdast);
	}

	return markdowns;
}

export function replace_docusaurusStrings(
	object: DocusaurusTranslations,
	strings: { [Language in TargetLanguageCode]?: string[] }
): { [Language in TargetLanguageCode]?: string } {
	const keys = Object.keys(object);
	const jsons: { [Language in TargetLanguageCode]?: string } = {};

	for (const language in strings) {
		const Strings = strings[language as TargetLanguageCode]!.reverse();
		for (const key in object) {
			const value = object[key];

			if (typeof value === 'string') {
				object[key] = Strings.pop()!;
				continue;
			}

			if (typeof value === 'object') {
				if ('message' in value) {
					value.message = Strings.pop()!;
					if ('description' in value) value.description = Strings.pop()!;
					continue;
				}

				if ('type' in value) {
					if ('title' in value) value.title = Strings.pop();
					if ('description' in value) value.description = Strings.pop();
					continue;
				}
			}
		}

		jsons[language as TargetLanguageCode] = JSON.stringify(object);
	}

	return jsons;
}
