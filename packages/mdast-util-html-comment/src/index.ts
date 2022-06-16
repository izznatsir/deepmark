import type { Extension } from 'mdast-util-from-markdown';
import type { Options } from 'mdast-util-to-markdown';

export function htmlCommentFromMarkdown(): Extension {
	return {
		canContainEols: ['htmlComment'],
		enter: {
			htmlComment() {
				this.buffer();
			}
		},
		exit: {
			htmlComment(token) {
				const string = this.resume();

				this.enter(
					{
						// @ts-ignore
						type: 'htmlComment',
						value: string.slice(0, -3)
					},
					token
				);

				this.exit(token);
			}
		}
	};
}

export function htmlCommentToMarkdown(): Options {
	return {
		handlers: {
			htmlComment(node) {
				return `<!--${node.value as string}-->`;
			}
		}
	};
}
