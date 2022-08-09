import type { EsNode, EsNodeMap, EsProgram } from './estree.js';

export const DEFAULT_ESWALKERS: EsWalkers = {
	Program(node, parents, process) {
		parents.push(node);
		for (const statement of node.body) {
			process(statement, parents);
		}
		parents.pop();
	},
	ExpressionStatement(node, parents, process) {
		parents.push(node);
		process(node.expression, parents);
		parents.pop();
	},
	ArrayExpression(node, parents, process) {
		parents.push(node);
		for (const element of node.elements) {
			process(element, parents);
		}
		parents.pop();
	},
	ObjectExpression(node, parents, process) {
		parents.push(node);
		for (const property of node.properties) {
			process(property, parents);
		}
		parents.pop();
	},
	Property(node, parents, process) {
		parents.push(node);
		process(node.key, parents);
		process(node.value, parents);
		parents.pop();
	},
	JSXElement(node, parents, process) {
		parents.push(node);
		for (const child of node.children) {
			process(child, parents);
		}
		parents.pop();
	}
};

export function eswalk(
	ast: EsProgram,
	visitors: EsVisitors,
	walkers: EsWalkers = DEFAULT_ESWALKERS
) {
	const process: EsProcessor = (node, parents) => {
		if (!node) return;

		const type = node.type as keyof EsNodeMap;

		const visit = visitors[type] as EsVisitor<typeof type>;
		const walk = walkers[type] as EsWalker<typeof type>;

		let keepWalking = true;

		if (visit !== undefined) {
			const signal = visit(node, parents);
			keepWalking = signal === undefined || signal === true ? true : false;
		}

		if (keepWalking && walk) walk(node, parents, process);
	};

	process(ast, []);
}

export interface EsProcessor {
	(node: EsNode | null, parents: EsNode[]): void;
}

export interface EsVisitor<NodeType extends keyof EsNodeMap> {
	(node: EsNodeMap[NodeType], parents: EsNode[]): boolean | void;
}

export type EsVisitors = {
	[NodeType in keyof EsNodeMap]?: EsVisitor<NodeType>;
};

export interface EsWalker<NodeType extends keyof EsNodeMap> {
	(node: EsNodeMap[NodeType], parents: EsNode[], process: EsProcessor): void;
}

export type EsWalkers = {
	[NodeType in keyof Partial<EsNodeMap>]: EsWalker<NodeType>;
};
