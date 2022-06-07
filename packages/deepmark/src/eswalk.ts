import type { Program as EsProgram } from 'estree';
import type { EsNodeTypes, EsProcessor, EsWalker, EsWalkers, EsVisitor, EsVisitors } from '$types';

export const DEFAULT_ESWALKERS: EsWalkers = {
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
	ast: EsProgram,
	visitors: EsVisitors,
	walkers: EsWalkers = DEFAULT_ESWALKERS
) {
	const process: EsProcessor = (node) => {
		if (!node) return;

		const type = node.type as EsNodeTypes;

		const visitor = visitors[type] as EsVisitor<typeof type>;
		const walker = walkers[type] as EsWalker<typeof type>;

		let keepWalking = true;

		if (visitor !== undefined) {
			const signal = visitor(node);
			keepWalking = signal === undefined || signal === true ? true : false;
		}

		if (keepWalking && walker) walker(node, process);
	};

	process(ast);
}
