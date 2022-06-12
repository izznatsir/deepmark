import type { UnNode, UnParent } from '../types/index.js';

export function is_unist_parent(node: UnNode): node is UnParent {
	return 'children' in node;
}
