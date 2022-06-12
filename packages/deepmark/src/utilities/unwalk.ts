import type { UnNode, UnParent } from '../types/index.js';

import { is_unist_parent } from './unist.js';

const NEXT = true;
const STOP = false;

export function unwalk(node: UnNode, visit: Visitor, inout: boolean = false) {
	let next = true;

	function step(node: UnNode, parent: UnParent | undefined, index: number | undefined) {
		if (!inout) {
			if (!next) return;

			const signal = visit(node, parent, index);
			next = signal === undefined || NEXT ? NEXT : STOP;
		}

		if (is_unist_parent(node)) {
			for (let i = 0; i < node.children.length; i++) {
				if (!next) break;

				const child = node.children[i];
				step(child, node, i);
			}

			node.children = node.children.filter((child) => child);
		}

		if (inout) {
			if (!next) return;

			const signal = visit(node, parent, index);
			next = signal === undefined || NEXT ? NEXT : STOP;
		}
	}

	step(node, undefined, undefined);
}

export interface Visitor {
	(node: UnNode | UnParent, parent: UnParent | undefined, index: number | undefined):
		| boolean
		| void;
}
