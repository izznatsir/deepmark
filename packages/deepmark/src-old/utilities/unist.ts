import type { UnNode, UnParent } from '../types/index.js';

export function isUnistParent(node: UnNode): node is UnParent {
	return 'children' in node;
}
