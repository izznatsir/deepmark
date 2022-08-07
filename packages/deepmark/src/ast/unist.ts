import type { Position as UnPosition } from 'unist';

export function unNodeIsParent(node: UnNode): node is UnParent {
	return 'children' in node;
}

/**
 * ============================================================
 */

export interface UnNode {
	type: string;
	position?: UnPosition;
	data?: unknown;
}

export interface UnParent extends UnNode {
	children: (UnNode | UnParent)[];
}
