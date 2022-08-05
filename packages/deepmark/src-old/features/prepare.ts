import type { MdRoot, MdxJsxTextElement } from '../types/index.js';

import { formatMarkdown } from './index.js';
import {
	getMdast,
	isMdastEmphasis,
	isMdastFlowExpression,
	isMdastInlineCode,
	isMdastJsxFlowElement,
	isMdastJsxTextElement,
	isMdastLink,
	isMdastStrong,
	isMdastText,
	unwalk
} from '../utilities/index.js';

export async function prepare(
	markdown: string,
	config: { convert: boolean } = { convert: true }
): Promise<MdRoot> {
	const mdast = getMdast(
		await formatMarkdown(markdown, {
			printWidth: Infinity,
			proseWrap: 'never',
			useTabs: true
		})
	);

	unwalk(mdast, (node, parent, index) => {
		if (node.position) delete node.position;

		if (isMdastJsxFlowElement(node) || isMdastJsxTextElement(node)) {
			for (const attribute of node.attributes) {
				if (typeof attribute.value === 'string') {
					attribute.value = attribute.value.trim();
				}
			}
			return;
		}

		if (isMdastFlowExpression(node) && isMdastJsxFlowElement(parent!)) {
			if (index === 0 && isMdastEmptyTextExpression(node.value)) {
				(parent.children[index] as unknown) = undefined;
			}
			return;
		}

		if (isMdastText(node)) {
			node.value = linebreaksToWhitespaces(node.value);
			return;
		}

		if (!config.convert) return;

		if (isMdastEmphasis(node)) {
			(node as unknown as MdxJsxTextElement).type = 'mdxJsxTextElement';
			(node as unknown as MdxJsxTextElement).name = 'em';
			(node as unknown as MdxJsxTextElement).attributes = [];
			return;
		}

		if (isMdastInlineCode(node)) {
			(node as unknown as MdxJsxTextElement).children = [{ ...node, type: 'text' }];
			(node as unknown as MdxJsxTextElement).type = 'mdxJsxTextElement';
			(node as unknown as MdxJsxTextElement).name = 'code';
			(node as unknown as MdxJsxTextElement).attributes = [];
			return;
		}

		if (isMdastLink(node)) {
			(node as unknown as MdxJsxTextElement).type = 'mdxJsxTextElement';
			(node as unknown as MdxJsxTextElement).name = 'a';
			(node as unknown as MdxJsxTextElement).attributes = [
				{ type: 'mdxJsxAttribute', name: 'href', value: node.url }
			];

			delete node.title;
			delete (node as unknown as { url?: string }).url;
			return;
		}

		if (isMdastStrong(node)) {
			(node as unknown as MdxJsxTextElement).type = 'mdxJsxTextElement';
			(node as unknown as MdxJsxTextElement).name = 'strong';
			(node as unknown as MdxJsxTextElement).attributes = [];
			return;
		}
	});

	return mdast;
}

function isMdastEmptyTextExpression(text: string): boolean {
	const regex = /^('|")\s*('|")$/;
	return regex.test(text);
}

function linebreaksToWhitespaces(text: string): string {
	return text.replace(/^.(\n|\r\n).*$/, ' ');
}
