import type { Position } from 'unist';

const NEXT = true;
const STOP = false;

export function unwalk(node: Node | Parent, visit: Visitor, inout: boolean = false) {
	let next = true;

	function step(node: Node | Parent, parent: Parent | null) {
		if (!inout) {
			if (!next) return;

			const signal = visit(node, parent);
			next = signal === undefined || NEXT ? NEXT : STOP;
		}

		if (is_parent(node)) {
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

function is_parent(node: Node | Parent): node is Parent {
	return 'children' in node;
}

export interface Node {
	type: string;
	position?: Position;
	data?: unknown;
}

export interface Parent extends Node {
	children: (Node | Parent)[];
}

export interface Visitor {
	(node: Node | Parent, parent: Parent | null): boolean | void;
}
