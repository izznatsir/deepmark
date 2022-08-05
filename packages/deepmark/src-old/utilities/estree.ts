import type {
	EsArrayExpression,
	EsExpressionStatement,
	EsIdentifier,
	EsNode,
	EsObjectExpression,
	EsProgram,
	EsProperty,
	JSXElement
} from '../types/index.js';

import { Parser as AcornParser } from 'acorn';
import acornJsx from 'acorn-jsx';
import { generate, GENERATOR, JSX } from './astring-jsx.js';

export function getEstree(code: string): EsProgram {
	const JsxParser = AcornParser.extend(acornJsx());
	return JsxParser.parse(code, {
		ecmaVersion: 2020
	}) as unknown as EsProgram;
}

export function getJs(estree: EsProgram): string {
	return generate(estree, {
		generator: { ...GENERATOR, ...JSX },
		lineEnd: ''
	}).replace(/;$/, '');
}

export function isEstreeArrayExpression(node: EsNode): node is EsArrayExpression {
	return node.type === 'ArrayExpression';
}

export function isEstreeIdentifier(node: EsNode): node is EsIdentifier {
	return node.type === 'Identifier';
}

export function isEstreeExpressionStatement(node: EsNode): node is EsExpressionStatement {
	return node.type === 'ExpressionStatement';
}

export function isEstreeJsxElement(node: EsNode): node is JSXElement {
	return node.type === 'JSXElement';
}

export function isEstreeObjectExpression(node: EsNode): node is EsObjectExpression {
	return node.type === 'ObjectExpression';
}

export function isEstreeProgram(node: EsNode): node is EsProgram {
	return node.type === 'Program';
}

export function isEstreeProperty(node: EsNode): node is EsProperty {
	return node.type === 'Property';
}

export function resolveEstreePropertyPath(
	node: EsProperty,
	parents: EsNode[],
	attributeName: string
): string | undefined {
	if (!isEstreeArrayExpression(parents[2]) && !isEstreeObjectExpression(parents[2])) return;
	if (!isEstreeIdentifier(node.key)) return;

	const names = [node.key.name];

	for (let i = parents.length - 1; i > 1; i--) {
		const parent = parents[i];
		if (isEstreeArrayExpression(parent) || isEstreeObjectExpression(parent)) continue;
		if (isEstreeProperty(parent)) {
			if (!isEstreeIdentifier(parent.key)) return;
			names.push(parent.key.name);
			continue;
		}

		return;
	}

	names.push(attributeName);

	return names.reverse().join('.');
}
