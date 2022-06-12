import type { UnNode, UnParent } from '$types';

export function is_unist_parent(node: UnNode): node is UnParent {
	return 'children' in node;
}
