import type { Node as EsNode } from 'estree';
import type { EsNodes } from './estree.js';

export type EsNodeTypes = keyof EsNodes;

export interface EsProcessor {
	(node: EsNode | null): void;
}

export interface EsVisitor<NodeType extends keyof EsNodes> {
	(node: EsNodes[NodeType]): boolean | void;
}

export type EsVisitors = {
	[NodeType in keyof EsNodes]?: EsVisitor<NodeType>;
};

export interface EsWalker<NodeType extends keyof EsNodes> {
	(node: EsNodes[NodeType], process: EsProcessor): void;
}

export type EsWalkers = {
	[NodeType in keyof Partial<EsNodes>]: EsWalker<NodeType>;
};
