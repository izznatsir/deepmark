import type { UnNode, UnParent } from '$types';

const NEXT = true;
const STOP = false;

export function unwalk(node: UnNode | UnParent, visit: Visitor, inout: boolean = false) {
	let next = true;

	function step(node: UnNode | UnParent, parent: UnParent | null) {
		if (!inout) {
			if (!next) return;

			const signal = visit(node, parent);
			next = signal === undefined || NEXT ? NEXT : STOP;
		}

		if (is_unparent(node)) {
			for (const child of node.children) {
				if (!next) break;

				step(child, node);
			}
		}

		if (inout) {
			if (!next) return;

			const signal = visit(node, parent);
			next = signal === undefined || NEXT ? NEXT : STOP;
		}
	}

	step(node, null);
}

function is_unparent(node: UnNode | UnParent): node is UnParent {
	return 'children' in node;
}

export interface Visitor {
	(node: UnNode | UnParent, parent: UnParent | null): boolean | void;
}
