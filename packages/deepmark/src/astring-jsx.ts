import type {
	JSXAttribute,
	JSXClosingElement,
	JSXClosingFragment,
	JSXElement,
	JSXExpressionContainer,
	JSXFragment,
	JSXIdentifier,
	JSXMemberExpression,
	JSXNamespacedName,
	JSXOpeningElement,
	JSXOpeningFragment,
	JSXSpreadAttribute,
	JSXText
} from 'estree-jsx';

export * from 'astring';

type State = Record<any, any>;

// Make sure that character references don’t pop up.
// For example, the text `&copy;` should stay that way, and not turn into `©`.
// We could encode all `&` (easy but verbose) or look for actual valid
// references (complex but cleanest output).
// Looking for the 2nd character gives us a middle ground.
// The `#` is for (decimal and hexadecimal) numeric references, the letters
// are for the named references.
function encodeJsx(value: string): string {
	return value.replace(/&(?=[#a-z])/gi, '&amp;');
}

export const JSX = {
	// `attr`
	// `attr="something"`
	// `attr={1}`
	JSXAttribute(node: JSXAttribute, state: State) {
		// @ts-expect-error
		this[node.name.type](node.name, state);

		if (node.value !== undefined && node.value !== null) {
			state.write('=');

			// Encode double quotes in attribute values.
			if (node.value.type === 'Literal') {
				state.write('"' + encodeJsx(String(node.value.value)).replace(/"/g, '&quot;') + '"', node);
			} else {
				// @ts-expect-error
				this[node.value.type](node.value, state);
			}
		}
	},
	// `</div>`
	JSXClosingElement(node: JSXClosingElement, state: State) {
		state.write('</');
		// @ts-expect-error
		this[node.name.type](node.name, state);
		state.write('>');
	},
	// `</>`
	JSXClosingFragment(node: JSXClosingFragment, state: State) {
		state.write('</>', node);
	},
	// `<div />`
	// `<div></div>`
	JSXElement(node: JSXElement, state: State) {
		let index = -1;

		this[node.openingElement.type](node.openingElement, state);

		if (node.children) {
			while (++index < node.children.length) {
				// @ts-expect-error
				this[node.children[index].type](node.children[index], state);
			}
		}

		if (node.closingElement) {
			this[node.closingElement.type](node.closingElement, state);
		}
	},
	// `{}` (always in a `JSXExpressionContainer`, which does the curlies)
	JSXEmptyExpression() {},
	// `{expression}`
	JSXExpressionContainer(node: JSXExpressionContainer, state: State) {
		state.write('{');
		// @ts-expect-error
		this[node.expression.type](node.expression, state);
		state.write('}');
	},
	// `<></>`
	JSXFragment(node: JSXFragment, state: State) {
		let index = -1;

		// @ts-expect-error
		this[node.openingFragment.type](node.openingElement, state);

		if (node.children) {
			while (++index < node.children.length) {
				// @ts-expect-error
				this[node.children[index].type](node.children[index], state);
			}
		}

		// @ts-expect-error
		this[node.closingFragment.type](node.closingElement, state);
	},
	// `div`
	JSXIdentifier(node: JSXIdentifier, state: State) {
		state.write(node.name, node);
	},
	// `member.expression`
	JSXMemberExpression(node: JSXMemberExpression, state: State) {
		// @ts-expect-error
		this[node.object.type](node.object, state);
		state.write('.');
		this[node.property.type](node.property, state);
	},
	// `ns:name`
	JSXNamespacedName(node: JSXNamespacedName, state: State) {
		this[node.namespace.type](node.namespace, state);
		state.write(':');
		this[node.name.type](node.name, state);
	},
	JSXOpeningElement(node: JSXOpeningElement, state: State) {
		let index = -1;

		state.write('<');
		// @ts-expect-error
		this[node.name.type](node.name, state);

		if (node.attributes) {
			while (++index < node.attributes.length) {
				state.write(' ');
				// @ts-expect-error
				this[node.attributes[index].type](node.attributes[index], state);
			}
		}

		state.write(node.selfClosing ? ' />' : '>');
	},
	// `<>`
	JSXOpeningFragment(node: JSXOpeningFragment, state: State) {
		state.write('<>', node);
	},
	// `{...argument}`
	JSXSpreadAttribute(node: JSXSpreadAttribute, state: State) {
		state.write('{');
		// @ts-expect-error
		this.SpreadElement(node, state);
		state.write('}');
	},
	// `!`
	JSXText(node: JSXText, state: State) {
		state.write(
			encodeJsx(node.value).replace(/<|\{/g, function ($0) {
				return $0 === '<' ? '&lt;' : '&#123;';
			}),
			node
		);
	}
};
