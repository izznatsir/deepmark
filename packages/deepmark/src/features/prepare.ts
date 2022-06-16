import type { MdRoot, MdxJsxTextElement } from '../types/index.js';

import { format_markdown } from '../features/index.js';
import {
	get_mdast,
	is_mdast_emphasis,
	is_mdast_flow_expression,
	is_mdast_inline_code,
	is_mdast_jsx_flow_element,
	is_mdast_jsx_text_element,
	is_mdast_link,
	is_mdast_strong,
	is_mdast_text,
	unwalk
} from '../utilities/index.js';

export async function prepare(
	markdown: string,
	config: { convert: boolean } = { convert: true }
): Promise<MdRoot> {
	const _markdown = await format_markdown(markdown, { prettier: false });
	const mdast = get_mdast(_markdown);

	unwalk(
		mdast,
		(node, parent, index) => {
			if (node.position) delete node.position;

			if (is_mdast_jsx_flow_element(node) || is_mdast_jsx_text_element(node)) {
				for (const attribute of node.attributes) {
					if (typeof attribute.value === 'string') {
						attribute.value = attribute.value.trim();
					}
				}
				return;
			}

			if (is_mdast_flow_expression(node) && is_mdast_jsx_flow_element(parent!)) {
				if (index === 0 && is_mdast_empty_text_expression(node.value)) {
					(parent.children[index] as unknown) = undefined;
				}
				return;
			}

			if (is_mdast_text(node)) {
				node.value = linebreaks_to_whitespaces(node.value);
				return;
			}

			if (!config.convert) return;

			if (is_mdast_emphasis(node)) {
				(node as unknown as MdxJsxTextElement).type = 'mdxJsxTextElement';
				(node as unknown as MdxJsxTextElement).name = 'em';
				(node as unknown as MdxJsxTextElement).attributes = [];
				return;
			}

			if (is_mdast_inline_code(node)) {
				(node as unknown as MdxJsxTextElement).children = [{ ...node, type: 'text' }];
				(node as unknown as MdxJsxTextElement).type = 'mdxJsxTextElement';
				(node as unknown as MdxJsxTextElement).name = 'code';
				(node as unknown as MdxJsxTextElement).attributes = [];
				return;
			}

			if (is_mdast_link(node)) {
				(node as unknown as MdxJsxTextElement).type = 'mdxJsxTextElement';
				(node as unknown as MdxJsxTextElement).name = 'a';
				(node as unknown as MdxJsxTextElement).attributes = [
					{ type: 'mdxJsxAttribute', name: 'href', value: node.url }
				];

				delete node.title;
				delete (node as unknown as { url?: string }).url;
				return;
			}

			if (is_mdast_strong(node)) {
				(node as unknown as MdxJsxTextElement).type = 'mdxJsxTextElement';
				(node as unknown as MdxJsxTextElement).name = 'strong';
				(node as unknown as MdxJsxTextElement).attributes = [];
				return;
			}
		},
		true
	);

	return mdast;
}

function is_mdast_empty_text_expression(text: string): boolean {
	const regex = /^('|")\s*('|")$/;
	return regex.test(text);
}

function linebreaks_to_whitespaces(text: string): string {
	return text.replace(/^.(\n|\r\n).*$/, ' ');
}
