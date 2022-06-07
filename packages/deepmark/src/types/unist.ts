import type { Position } from 'unist';

export interface UnNode {
	type: string;
	position?: Position;
	data?: unknown;
}

export interface UnParent extends UnNode {
	children: (UnNode | UnParent)[];
}
