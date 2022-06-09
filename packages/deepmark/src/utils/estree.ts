import type {
	EsArrayExpression,
	EsExpressionStatement,
	EsIdentifier,
	EsNode,
	EsObjectExpression,
	EsProgram,
	EsProperty
} from '$types';

export function is_estree_array_expression(node: EsNode): node is EsArrayExpression {
	return node.type === 'ArrayExpression';
}

export function is_estree_identifier(node: EsNode): node is EsIdentifier {
	return node.type === 'Identifier';
}

export function is_estree_expression_statement(node: EsNode): node is EsExpressionStatement {
	return node.type === 'ExpressionStatement';
}

export function is_estree_object_expression(node: EsNode): node is EsObjectExpression {
	return node.type === 'ObjectExpression';
}

export function is_estree_program(node: EsNode): node is EsProgram {
	return node.type === 'Program';
}

export function is_estree_property(node: EsNode): node is EsProperty {
	return node.type === 'Property';
}

export function resolve_estree_property_path(
	node: EsProperty,
	parents: EsNode[]
): string | undefined {
	if (!is_estree_array_expression(parents[2]) || !is_estree_object_expression(parents[2])) return;
	if (!is_estree_identifier(node.key)) return;

	const names = [node.key.name];

	for (let i = parents.length - 1; i > 1; i--) {
		const parent = parents[i];
		if (is_estree_array_expression(parent) || is_estree_object_expression(parent)) continue;
		if (is_estree_property(parent)) {
			if (!is_estree_identifier(parent.key)) return;
			names.push(parent.key.name);
			continue;
		}

		return;
	}

	return names.reverse().join('.');
}
