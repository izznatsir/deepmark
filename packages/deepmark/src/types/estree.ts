import type {
	Identifier,
	Program,
	Function,
	SwitchCase,
	CatchClause,
	VariableDeclarator,
	ExpressionStatement,
	BlockStatement,
	EmptyStatement,
	DebuggerStatement,
	WithStatement,
	ReturnStatement,
	LabeledStatement,
	BreakStatement,
	ContinueStatement,
	IfStatement,
	SwitchStatement,
	ThrowStatement,
	TryStatement,
	WhileStatement,
	DoWhileStatement,
	ForStatement,
	ForInStatement,
	ForOfStatement,
	ClassDeclaration,
	FunctionDeclaration,
	VariableDeclaration,
	ModuleDeclaration,
	ImportDeclaration,
	ExportDefaultDeclaration,
	ExportNamedDeclaration,
	ExportAllDeclaration,
	ThisExpression,
	ArrayExpression,
	ObjectExpression,
	FunctionExpression,
	ArrowFunctionExpression,
	YieldExpression,
	UnaryExpression,
	UpdateExpression,
	BinaryExpression,
	AssignmentExpression,
	LogicalExpression,
	MemberExpression,
	ConditionalExpression,
	CallExpression,
	NewExpression,
	SequenceExpression,
	TaggedTemplateExpression,
	ClassExpression,
	AwaitExpression,
	ImportExpression,
	ChainExpression,
	SimpleLiteral,
	RegExpLiteral,
	BigIntLiteral,
	TemplateLiteral,
	PrivateIdentifier,
	Property,
	MetaProperty,
	PropertyDefinition,
	AssignmentProperty,
	Super,
	TemplateElement,
	SpreadElement,
	ObjectPattern,
	ArrayPattern,
	RestElement,
	AssignmentPattern,
	Class,
	ClassBody,
	StaticBlock,
	MethodDefinition,
	ModuleSpecifier,
	ImportSpecifier,
	ImportNamespaceSpecifier,
	ImportDefaultSpecifier,
	ExportSpecifier,
	Node
} from 'estree';

import type {
	JSXAttribute,
	JSXClosingElement,
	JSXClosingFragment,
	JSXElement,
	JSXEmptyExpression,
	JSXExpressionContainer,
	JSXFragment,
	JSXIdentifier,
	JSXMemberExpression,
	JSXNamespacedName,
	JSXOpeningElement,
	JSXOpeningFragment,
	JSXSpreadAttribute,
	JSXSpreadChild,
	JSXText
} from 'estree-jsx';

export type { Node as EsNode, Program as EsProgram } from 'estree';

export interface EsNodes {
	Identifier: Identifier;
	Program: Program;
	Function: Function;
	SwitchCase: SwitchCase;
	CatchClause: CatchClause;
	VariableDeclarator: VariableDeclarator;
	ExpressionStatement: ExpressionStatement;
	BlockStatement: BlockStatement;
	EmptyStatement: EmptyStatement;
	DebuggerStatement: DebuggerStatement;
	WithStatement: WithStatement;
	ReturnStatement: ReturnStatement;
	LabeledStatement: LabeledStatement;
	BreakStatement: BreakStatement;
	ContinueStatement: ContinueStatement;
	IfStatement: IfStatement;
	SwitchStatement: SwitchStatement;
	ThrowStatement: ThrowStatement;
	TryStatement: TryStatement;
	WhileStatement: WhileStatement;
	DoWhileStatement: DoWhileStatement;
	ForStatement: ForStatement;
	ForInStatement: ForInStatement;
	ForOfStatement: ForOfStatement;
	ClassDeclaration: ClassDeclaration;
	FunctionDeclaration: FunctionDeclaration;
	VariableDeclaration: VariableDeclaration;
	ModuleDeclaration: ModuleDeclaration;
	ImportDeclaration: ImportDeclaration;
	ExportDefaultDeclaration: ExportDefaultDeclaration;
	ExportNamedDeclaration: ExportNamedDeclaration;
	ExportAllDeclaration: ExportAllDeclaration;
	ThisExpression: ThisExpression;
	ArrayExpression: ArrayExpression;
	ObjectExpression: ObjectExpression;
	FunctionExpression: FunctionExpression;
	ArrowFunctionExpression: ArrowFunctionExpression;
	YieldExpression: YieldExpression;
	UnaryExpression: UnaryExpression;
	UpdateExpression: UpdateExpression;
	BinaryExpression: BinaryExpression;
	AssignmentExpression: AssignmentExpression;
	LogicalExpression: LogicalExpression;
	MemberExpression: MemberExpression;
	ConditionalExpression: ConditionalExpression;
	CallExpression: CallExpression;
	NewExpression: NewExpression;
	SequenceExpression: SequenceExpression;
	TaggedTemplateExpression: TaggedTemplateExpression;
	ClassExpression: ClassExpression;
	AwaitExpression: AwaitExpression;
	ImportExpression: ImportExpression;
	ChainExpression: ChainExpression;
	Literal: SimpleLiteral;
	RegExpLiteral: RegExpLiteral;
	BigIntLiteral: BigIntLiteral;
	TemplateLiteral: TemplateLiteral;
	PrivateIdentifier: PrivateIdentifier;
	Property: Property;
	MetaProperty: MetaProperty;
	PropertyDefinition: PropertyDefinition;
	AssignmentProperty: AssignmentProperty;
	Super: Super;
	TemplateElement: TemplateElement;
	SpreadElement: SpreadElement;
	ObjectPattern: ObjectPattern;
	ArrayPattern: ArrayPattern;
	RestElement: RestElement;
	AssignmentPattern: AssignmentPattern;
	Class: Class;
	ClassBody: ClassBody;
	StaticBlock: StaticBlock;
	MethodDefinition: MethodDefinition;
	ModuleSpecifier: ModuleSpecifier;
	ImportSpecifier: ImportSpecifier;
	ImportNamespaceSpecifier: ImportNamespaceSpecifier;
	ImportDefaultSpecifier: ImportDefaultSpecifier;
	ExportSpecifier: ExportSpecifier;
	JSXAttribute: JSXAttribute;
	JSXClosingElement: JSXClosingElement;
	JSXClosingFragment: JSXClosingFragment;
	JSXElement: JSXElement;
	JSXEmptyExpression: JSXEmptyExpression;
	JSXExpressionContainer: JSXExpressionContainer;
	JSXFragment: JSXFragment;
	JSXIdentifier: JSXIdentifier;
	JSXMemberExpression: JSXMemberExpression;
	JSXNamespacedName: JSXNamespacedName;
	JSXOpeningElement: JSXOpeningElement;
	JSXOpeningFragment: JSXOpeningFragment;
	JSXSpreadAttribute: JSXSpreadAttribute;
	JSXSpreadChild: JSXSpreadChild;
	JSXText: JSXText;
}
