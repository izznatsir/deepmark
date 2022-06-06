/**
 * @type { import('@types').EstreeWalkers }
 */
export const DEFAULT_WALKERS = {
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

/**
 * @param { import('estree').Program } ast
 * @param { import('@types').EstreeVisitors } visitors
 * @param { import('@types').EstreeWalkers } [walkers]
 */
export function eswalk(ast, visitors, walkers = DEFAULT_WALKERS) {
	/** @type { import('@types').EstreeProcessor } */
	function process(node) {
		if (!node) return;

		const callback = visitors[node.type];
		const walker = walkers[node.type];

		let keepWalking = true;

		if (callback) {
			// @ts-ignore
			const signal = callback(node);
			keepWalking = signal === undefined || signal === true ? true : false;
		}

		// @ts-ignore
		if (walker) walker(node, process);
	}

	process(ast);
}
