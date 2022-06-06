import type * as Estree from 'estree';

export interface EstreeNodes {
	Identifier: Estree.Identifier;
	Program: Estree.Program;
	Function: Estree.Function;
	SwitchCase: Estree.SwitchCase;
	CatchClause: Estree.CatchClause;
	VariableDeclarator: Estree.VariableDeclarator;
	Statement: Estree.Statement;
	ExpressionStatement: Estree.ExpressionStatement;
	BlockStatement: Estree.BlockStatement;
	EmptyStatement: Estree.EmptyStatement;
	DebuggerStatement: Estree.DebuggerStatement;
	WithStatement: Estree.WithStatement;
	ReturnStatement: Estree.ReturnStatement;
	LabeledStatement: Estree.LabeledStatement;
	BreakStatement: Estree.BreakStatement;
	ContinueStatement: Estree.ContinueStatement;
	IfStatement: Estree.IfStatement;
	SwitchStatement: Estree.SwitchStatement;
	ThrowStatement: Estree.ThrowStatement;
	TryStatement: Estree.TryStatement;
	WhileStatement: Estree.WhileStatement;
	DoWhileStatement: Estree.DoWhileStatement;
	ForStatement: Estree.ForStatement;
	ForInStatement: Estree.ForInStatement;
	ForOfStatement: Estree.ForOfStatement;
	ClassDeclaration: Estree.ClassDeclaration;
	FunctionDeclaration: Estree.FunctionDeclaration;
	VariableDeclaration: Estree.VariableDeclaration;
	Declaration: Estree.Declaration;
	ModuleDeclaration: Estree.ModuleDeclaration;
	ImportDeclaration: Estree.ImportDeclaration;
	ExportDefaultDeclaration: Estree.ExportDefaultDeclaration;
	ExportNamedDeclaration: Estree.ExportNamedDeclaration;
	ExportAllDeclaration: Estree.ExportAllDeclaration;
	Expression: Estree.Expression;
	ThisExpression: Estree.ThisExpression;
	ArrayExpression: Estree.ArrayExpression;
	ObjectExpression: Estree.ObjectExpression;
	FunctionExpression: Estree.FunctionExpression;
	ArrowFunctionExpression: Estree.ArrowFunctionExpression;
	YieldExpression: Estree.YieldExpression;
	UnaryExpression: Estree.UnaryExpression;
	UpdateExpression: Estree.UpdateExpression;
	BinaryExpression: Estree.BinaryExpression;
	AssignmentExpression: Estree.AssignmentExpression;
	LogicalExpression: Estree.LogicalExpression;
	MemberExpression: Estree.MemberExpression;
	ConditionalExpression: Estree.ConditionalExpression;
	CallExpression: Estree.CallExpression;
	NewExpression: Estree.NewExpression;
	SequenceExpression: Estree.SequenceExpression;
	TaggedTemplateExpression: Estree.TaggedTemplateExpression;
	ClassExpression: Estree.ClassExpression;
	AwaitExpression: Estree.AwaitExpression;
	ImportExpression: Estree.ImportExpression;
	ChainExpression: Estree.ChainExpression;
	Literal: Estree.Literal;
	TemplateLiteral: Estree.TemplateLiteral;
	PrivateIdentifier: Estree.PrivateIdentifier;
	Property: Estree.Property;
	MetaProperty: Estree.MetaProperty;
	PropertyDefinition: Estree.PropertyDefinition;
	AssignmentProperty: Estree.AssignmentProperty;
	Super: Estree.Super;
	TemplateElement: Estree.TemplateElement;
	SpreadElement: Estree.SpreadElement;
	Pattern: Estree.Pattern;
	ObjectPattern: Estree.ObjectPattern;
	ArrayPattern: Estree.ArrayPattern;
	RestElement: Estree.RestElement;
	AssignmentPattern: Estree.AssignmentPattern;
	Class: Estree.Class;
	ClassBody: Estree.ClassBody;
	StaticBlock: Estree.StaticBlock;
	MethodDefinition: Estree.MethodDefinition;
	ModuleSpecifier: Estree.ModuleSpecifier;
	ImportSpecifier: Estree.ImportSpecifier;
	ImportNamespaceSpecifier: Estree.ImportNamespaceSpecifier;
	ImportDefaultSpecifier: Estree.ImportDefaultSpecifier;
	ExportSpecifier: Estree.ExportSpecifier;
}

export interface EstreeProcessor {
	(node: Estree.Node | null): void;
}

export interface EstreeVisitor<NodeType extends keyof EstreeNodes> {
	(node: EstreeNodes[NodeType]): boolean | void;
}

export type EstreeVisitors = {
	[NodeType in keyof Partial<EstreeNodes>]: EstreeVisitor<NodeType>;
};

export interface EstreeWalker<NodeType extends keyof EstreeNodes> {
	(node: EstreeNodes[NodeType], process: EstreeProcessor): void;
}

export type EstreeWalkers = {
	[NodeType in keyof Partial<EstreeNodes>]: EstreeWalker<NodeType>;
};
