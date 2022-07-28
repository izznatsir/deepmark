import type { UnNode, UnParent } from '../types/index.js';

import { is_unist_parent } from './unist.js';

const NEXT = true;
const STOP = false;

export function unwalk(
	node: UnNode,
	visit: Visitor,
	filter?: (node: UnNode, parent: UnParent | undefined) => boolean
) {
	let next = true;

	function step(node: UnNode, parent: UnParent | undefined, index: number | undefined) {
		if (filter && !filter(node, parent)) return;

		if (is_unist_parent(node)) {
			for (let i = 0; i < node.children.length; i++) {
				if (!next) break;

				const child = node.children[i];
				step(child, node, i);
			}

			node.children = node.children.filter((child) => child);
		}

		if (!next) return;

		const signal = visit(node, parent, index);
		next = signal === undefined || NEXT ? NEXT : STOP;
	}

	step(node, undefined, undefined);
}

export interface Visitor {
	(node: UnNode | UnParent, parent: UnParent | undefined, index: number | undefined):
		| boolean
		| void;
}
