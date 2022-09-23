import type {
	BaseNode as EsBaseNode,
	Identifier as EsIdentifier,
	Program as EsProgram,
	SwitchCase as EsSwitchCase,
	CatchClause as EsCatchClause,
	VariableDeclarator as EsVariableDeclarator,
	ExpressionStatement as EsExpressionStatement,
	BlockStatement as EsBlockStatement,
	EmptyStatement as EsEmptyStatement,
	DebuggerStatement as EsDebuggerStatement,
	WithStatement as EsWithStatement,
	ReturnStatement as EsReturnStatement,
	LabeledStatement as EsLabeledStatement,
	BreakStatement as EsBreakStatement,
	ContinueStatement as EsContinueStatement,
	IfStatement as EsIfStatement,
	SwitchStatement as EsSwitchStatement,
	ThrowStatement as EsThrowStatement,
	TryStatement as EsTryStatement,
	WhileStatement as EsWhileStatement,
	DoWhileStatement as EsDoWhileStatement,
	ForStatement as EsForStatement,
	ForInStatement as EsForInStatement,
	ForOfStatement as EsForOfStatement,
	ClassDeclaration as EsClassDeclaration,
	FunctionDeclaration as EsFunctionDeclaration,
	VariableDeclaration as EsVariableDeclaration,
	ModuleDeclaration as EsModuleDeclaration,
	ImportDeclaration as EsImportDeclaration,
	ExportDefaultDeclaration as EsExportDefaultDeclaration,
	ExportNamedDeclaration as EsExportNamedDeclaration,
	ExportAllDeclaration as EsExportAllDeclaration,
	ThisExpression as EsThisExpression,
	ArrayExpression as EsArrayExpression,
	ObjectExpression as EsObjectExpression,
	FunctionExpression as EsFunctionExpression,
	ArrowFunctionExpression as EsArrowFunctionExpression,
	YieldExpression as EsYieldExpression,
	UnaryExpression as EsUnaryExpression,
	UpdateExpression as EsUpdateExpression,
	BinaryExpression as EsBinaryExpression,
	AssignmentExpression as EsAssignmentExpression,
	LogicalExpression as EsLogicalExpression,
	MemberExpression as EsMemberExpression,
	ConditionalExpression as EsConditionalExpression,
	CallExpression as EsCallExpression,
	NewExpression as EsNewExpression,
	SequenceExpression as EsSequenceExpression,
	TaggedTemplateExpression as EsTaggedTemplateExpression,
	ClassExpression as EsClassExpression,
	AwaitExpression as EsAwaitExpression,
	ImportExpression as EsImportExpression,
	ChainExpression as EsChainExpression,
	SimpleLiteral as EsSimpleLiteral,
	RegExpLiteral as EsRegExpLiteral,
	BigIntLiteral as EsBigIntLiteral,
	TemplateLiteral as EsTemplateLiteral,
	PrivateIdentifier as EsPrivateIdentifier,
	Property as EsProperty,
	MetaProperty as EsMetaProperty,
	PropertyDefinition as EsPropertyDefinition,
	AssignmentProperty as EsAssignmentProperty,
	Super as EsSuper,
	TemplateElement as EsTemplateElement,
	SpreadElement as EsSpreadElement,
	ObjectPattern as EsObjectPattern,
	ArrayPattern as EsArrayPattern,
	RestElement as EsRestElement,
	AssignmentPattern as EsAssignmentPattern,
	Class as EsClass,
	ClassBody as EsClassBody,
	StaticBlock as EsStaticBlock,
	MethodDefinition as EsMethodDefinition,
	ModuleSpecifier as EsModuleSpecifier,
	ImportSpecifier as EsImportSpecifier,
	ImportNamespaceSpecifier as EsImportNamespaceSpecifier,
	ImportDefaultSpecifier as EsImportDefaultSpecifier,
	ExportSpecifier as EsExportSpecifier
} from 'estree';

import type {
	JSXAttribute as EsJsxAttribute,
	JSXClosingElement as EsJsxClosingElement,
	JSXClosingFragment as EsJsxClosingFragment,
	JSXElement as EsJsxElement,
	JSXEmptyExpression as EsJsxEmptyExpression,
	JSXExpressionContainer as EsJsxExpressionContainer,
	JSXFragment as EsJsxFragment,
	JSXIdentifier as EsJsxIdentifier,
	JSXMemberExpression as EsJsxMemberExpression,
	JSXNamespacedName as EsJsxNamespacedName,
	JSXOpeningElement as EsJsxOpeningElement,
	JSXOpeningFragment as EsJsxOpeningFragment,
	JSXSpreadAttribute as EsJsxSpreadAttribute,
	JSXSpreadChild as EsJsxSpreadChild,
	JSXText as EsJsxText
} from 'estree-jsx';

export function esNodeIs<T extends keyof EsNodeMap>(node: EsNode, type: T): node is EsNodeMap[T] {
	return node ? node.type === type : false;
}

export function resolveEstreePropertyPath(
	node: EsProperty,
	parents: EsNode[],
	attributeName: string
): string | undefined {
	if (!esNodeIs(parents[2], 'ArrayExpression') && !esNodeIs(parents[2], 'ObjectExpression')) return;
	if (!esNodeIs(node.key, 'Identifier')) return;

	const names = [node.key.name];

	for (let i = parents.length - 1; i > 1; i--) {
		const parent = parents[i];
		if (esNodeIs(parent, 'ArrayExpression') || esNodeIs(parent, 'ObjectExpression')) continue;
		if (esNodeIs(parent, 'Property')) {
			if (!esNodeIs(parent.key, 'Identifier')) return;
			names.push(parent.key.name);
			continue;
		}

		return;
	}

	names.push(attributeName);

	return names.reverse().join('.');
}

/**
 * ============================================================
 */

export type {
	EsBaseNode,
	EsIdentifier,
	EsProgram,
	EsSwitchCase,
	EsCatchClause,
	EsVariableDeclarator,
	EsExpressionStatement,
	EsBlockStatement,
	EsEmptyStatement,
	EsDebuggerStatement,
	EsWithStatement,
	EsReturnStatement,
	EsLabeledStatement,
	EsBreakStatement,
	EsContinueStatement,
	EsIfStatement,
	EsSwitchStatement,
	EsThrowStatement,
	EsTryStatement,
	EsWhileStatement,
	EsDoWhileStatement,
	EsForStatement,
	EsForInStatement,
	EsForOfStatement,
	EsClassDeclaration,
	EsFunctionDeclaration,
	EsVariableDeclaration,
	EsModuleDeclaration,
	EsImportDeclaration,
	EsExportDefaultDeclaration,
	EsExportNamedDeclaration,
	EsExportAllDeclaration,
	EsThisExpression,
	EsArrayExpression,
	EsObjectExpression,
	EsFunctionExpression,
	EsArrowFunctionExpression,
	EsYieldExpression,
	EsUnaryExpression,
	EsUpdateExpression,
	EsBinaryExpression,
	EsAssignmentExpression,
	EsLogicalExpression,
	EsMemberExpression,
	EsConditionalExpression,
	EsCallExpression,
	EsNewExpression,
	EsSequenceExpression,
	EsTaggedTemplateExpression,
	EsClassExpression,
	EsAwaitExpression,
	EsImportExpression,
	EsChainExpression,
	EsSimpleLiteral,
	EsRegExpLiteral,
	EsBigIntLiteral,
	EsTemplateLiteral,
	EsPrivateIdentifier,
	EsProperty,
	EsMetaProperty,
	EsPropertyDefinition,
	EsAssignmentProperty,
	EsSuper,
	EsTemplateElement,
	EsSpreadElement,
	EsObjectPattern,
	EsArrayPattern,
	EsRestElement,
	EsAssignmentPattern,
	EsClass,
	EsClassBody,
	EsStaticBlock,
	EsMethodDefinition,
	EsModuleSpecifier,
	EsImportSpecifier,
	EsImportNamespaceSpecifier,
	EsImportDefaultSpecifier,
	EsExportSpecifier
};

export type {
	EsJsxAttribute,
	EsJsxClosingElement,
	EsJsxClosingFragment,
	EsJsxElement,
	EsJsxEmptyExpression,
	EsJsxExpressionContainer,
	EsJsxFragment,
	EsJsxIdentifier,
	EsJsxMemberExpression,
	EsJsxNamespacedName,
	EsJsxOpeningElement,
	EsJsxOpeningFragment,
	EsJsxSpreadAttribute,
	EsJsxSpreadChild,
	EsJsxText
};

export type EsNode = EsNodeMap[keyof EsNodeMap];

export type EsNodeMap = EsExpressionMap &
	EsLiteralMap &
	EsFunctionMap &
	EsPatternMap &
	EsStatementMap &
	EsJsxMap & {
		CatchClause: EsCatchClause;
		Class: EsClass;
		ClassBody: EsClassBody;
		MethodDefinition: EsMethodDefinition;
		ModuleDeclaration: EsModuleDeclaration;
		ModuleSpecifier: EsModuleSpecifier;
		PrivateIdentifier: EsPrivateIdentifier;
		Program: EsProgram;
		Property: EsProperty;
		PropertyDefinition: EsPropertyDefinition;
		SpreadElement: EsSpreadElement;
		Super: EsSuper;
		SwitchCase: EsSwitchCase;
		TemplateElement: EsTemplateElement;
		VariableDeclarator: EsVariableDeclarator;
	};

export type EsExpressionMap = EsLiteralMap & {
	ArrayExpression: EsArrayExpression;
	ArrowFunctionExpression: EsArrowFunctionExpression;
	AssignmentExpression: EsAssignmentExpression;
	AwaitExpression: EsAwaitExpression;
	BinaryExpression: EsBinaryExpression;
	CallExpression: EsCallExpression;
	ChainExpression: EsChainExpression;
	ClassExpression: EsClassExpression;
	ConditionalExpression: EsConditionalExpression;
	FunctionExpression: EsFunctionExpression;
	Identifier: EsIdentifier;
	ImportExpression: EsImportExpression;
	LogicalExpression: EsLogicalExpression;
	MemberExpression: EsMemberExpression;
	MetaProperty: EsMetaProperty;
	NewExpression: EsNewExpression;
	ObjectExpression: EsObjectExpression;
	SequenceExpression: EsSequenceExpression;
	TaggedTemplateExpression: EsTaggedTemplateExpression;
	TemplateLiteral: EsTemplateLiteral;
	ThisExpression: EsThisExpression;
	UnaryExpression: EsUnaryExpression;
	UpdateExpression: EsUpdateExpression;
	YieldExpression: EsYieldExpression;
};

export interface EsLiteralMap {
	Literal: EsSimpleLiteral | EsRegExpLiteral | EsBigIntLiteral;
	SimpleLiteral: EsSimpleLiteral;
	RegExpLiteral: EsRegExpLiteral;
	BigIntLiteral: EsBigIntLiteral;
}

export interface EsFunctionMap {
	FunctionDeclaration: EsFunctionDeclaration;
	FunctionExpression: EsFunctionExpression;
	ArrowFunctionExpression: EsArrowFunctionExpression;
}

export interface EsPatternMap {
	Identifier: EsIdentifier;
	ObjectPattern: EsObjectPattern;
	ArrayPattern: EsArrayPattern;
	RestElement: EsRestElement;
	AssignmentPattern: EsAssignmentPattern;
	MemberExpression: EsMemberExpression;
}

export type EsStatementMap = EsDeclarationMap & {
	ExpressionStatement: EsExpressionStatement;
	BlockStatement: EsBlockStatement;
	StaticBlock: EsStaticBlock;
	EmptyStatement: EsEmptyStatement;
	DebuggerStatement: EsDebuggerStatement;
	WithStatement: EsWithStatement;
	ReturnStatement: EsReturnStatement;
	LabeledStatement: EsLabeledStatement;
	BreakStatement: EsBreakStatement;
	ContinueStatement: EsContinueStatement;
	IfStatement: EsIfStatement;
	SwitchStatement: EsSwitchStatement;
	ThrowStatement: EsThrowStatement;
	TryStatement: EsTryStatement;
	WhileStatement: EsWhileStatement;
	DoWhileStatement: EsDoWhileStatement;
	ForStatement: EsForStatement;
	ForInStatement: EsForInStatement;
	ForOfStatement: EsForOfStatement;
};

export interface EsDeclarationMap {
	FunctionDeclaration: EsFunctionDeclaration;
	VariableDeclaration: EsVariableDeclaration;
	ClassDeclaration: EsClassDeclaration;
}

export interface EsJsxMap {
	JSXAttribute: EsJsxAttribute;
	JSXClosingElement: EsJsxClosingElement;
	JSXClosingFragment: EsJsxClosingFragment;
	JSXElement: EsJsxElement;
	JSXEmptyExpression: EsJsxEmptyExpression;
	JSXExpressionContainer: EsJsxExpressionContainer;
	JSXFragment: EsJsxFragment;
	JSXIdentifier: EsJsxIdentifier;
	JSXMemberExpression: EsJsxMemberExpression;
	JSXNamespacedName: EsJsxNamespacedName;
	JSXOpeningElement: EsJsxOpeningElement;
	JSXOpeningFragment: EsJsxOpeningFragment;
	JSXSpreadAttribute: EsJsxSpreadAttribute;
	JSXSpreadChild: EsJsxSpreadChild;
	JSXText: EsJsxText;
}
