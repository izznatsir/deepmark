import type { Program } from 'estree';
import type { Program as JSXProgram } from 'estree-jsx';
import type {
	EstreeNodeTypes,
	EstreeProcessor,
	EstreeWalker,
	EstreeWalkers,
	EstreeVisitor,
	EstreeVisitors,
	EsxtreeNodeTypes,
	EsxtreeProcessor,
	EsxtreeWalker,
	EsxtreeWalkers,
	EsxtreeVisitor,
	EsxtreeVisitors
} from '@types';

export const DEFAULT_WALKERS: EstreeWalkers = {
	Program(node, process) {
		for (const statement of node.body) {
			process(statement);
		}
	},
	ExpressionStatement(node, process) {
		process(node.expression);
	},
	ArrayExpression(node, process) {
		for (const element of node.elements) {
			process(element);
		}
	},
	ObjectExpression(node, process) {
		for (const property of node.properties) {
			process(property);
		}
	},
	Property(node, process) {
		process(node.key);
		process(node.value);
	}
};

export function eswalk(
	ast: Program,
	visitors: EstreeVisitors,
	walkers: EstreeWalkers = DEFAULT_WALKERS
) {
	const process: EstreeProcessor = (node) => {
		if (!node) return;

		const type = node.type as EstreeNodeTypes;

		const visitor = visitors[type] as EstreeVisitor<typeof type>;
		const walker = walkers[type] as EstreeWalker<typeof type>;

		let keepWalking = true;

		if (visitor !== undefined) {
			const signal = visitor(node);
			keepWalking = signal === undefined || signal === true ? true : false;
		}

		if (keepWalking && walker) walker(node, process);
	};

	process(ast);
}

export function esxwalk(
	ast: JSXProgram,
	visitors: EsxtreeVisitors,
	walkers: EsxtreeWalkers = DEFAULT_WALKERS
) {
	const process: EsxtreeProcessor = (node) => {
		if (!node) return;

		const type = node.type as EsxtreeNodeTypes;

		const visitor = visitors[type] as EsxtreeVisitor<typeof type>;
		const walker = walkers[type] as EsxtreeWalker<typeof type>;

		let keepWalking = true;

		if (visitor !== undefined) {
			const signal = visitor(node);
			keepWalking = signal === undefined || signal === true ? true : false;
		}

		if (keepWalking && walker) walker(node, process);
	};

	process(ast);
}
