import type { Options as PrettierOptions } from 'prettier';
import type { UnNode } from '../types/index.js';

import prettier from 'prettier';
import {
	isMdastFlowExpression,
	isMdastRoot,
	getMarkdown,
	getMdast,
	unwalk
} from '../utilities/index.js';

export async function formatMarkdown(
	markdown: string,
	prettierOptions?: Omit<PrettierOptions, 'parser'>
) {
	const mdast = getMdast(markdown);

	// Remove useless surface nodes.
	unwalk(
		mdast,
		(node, parent, index) => {
			if (isMdastEmptyTextExpression(node)) {
				(parent!.children[index!] as unknown) = undefined;
			}
		},
		(_, parent) => isMdastRoot(parent)
	);

	const configOrNull = await prettier.resolveConfig(process.cwd());
	const config = prettierOptions
		? prettierOptions
		: configOrNull
		? configOrNull
		: ({
				printWidth: Infinity,
				proseWrap: 'never',
				useTabs: true
		  } as PrettierOptions);

	return prettier.format(getMarkdown(mdast), {
		parser: 'mdx',
		...config
	});
}

function isMdastEmptyTextExpression(node: UnNode): boolean {
	if (!isMdastFlowExpression(node)) return false;

	const regex = /^('|")\s*('|")$/;
	return regex.test(node.value);
}
