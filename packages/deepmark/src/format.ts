import prettier from 'prettier';
import { getMarkdown, getMdast, mdNodeIs } from './ast/mdast.js';
import { unwalk } from './ast/unwalk.js';

async function format(markdown: string) {
	/**
	 * `printWidth` is set to Infinity and `proseWrap` is set to never
	 * to avoid unnecessary linebreaks that break translation result
	 */
	const mdast = getMdast(
		prettier.format(markdown, {
			parser: 'mdx',
			printWidth: Infinity,
			proseWrap: 'never',
			useTabs: true
		})
	);

	/**
	 * remove empty surface flow expression nodes that sometimes
	 * are produced by prettier
	 */
	unwalk(
		mdast,
		(node, parent, index) => {
			if (mdNodeIs(node, 'mdxFlowExpression') && expressionIsEmpty(node.value)) {
				(parent!.children[index!] as unknown) = undefined;
			}
		},
		(node, parent) => {
			delete node.position;
			return mdNodeIs(parent, 'root');
		}
	);

	return getMarkdown(mdast);
}

function expressionIsEmpty(text: string): boolean {
	const regex = /^('|")\s*('|")$/;
	return regex.test(text);
}
