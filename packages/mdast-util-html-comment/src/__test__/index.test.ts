import type { Root } from 'mdast';
import { fromMarkdown } from 'mdast-util-from-markdown';
import { mdxFromMarkdown, mdxToMarkdown } from 'mdast-util-mdx';
import { toMarkdown } from 'mdast-util-to-markdown';
import { htmlComment } from 'micromark-extension-html-comment';
import { mdxjs } from 'micromark-extension-mdxjs';
import { test } from 'vitest';
import { htmlCommentFromMarkdown, htmlCommentToMarkdown } from '../index.js';

test('From MDX.', ({ expect }) => {
	const markdown = '<!-- This an HTML comment inside mdx. -->';
	const mdast = fromMarkdown(markdown, {
		extensions: [mdxjs(), htmlComment()],
		mdastExtensions: [mdxFromMarkdown(), htmlCommentFromMarkdown()]
	});

	delete mdast.position;

	for (const child of mdast.children) {
		delete child.position;
	}

	expect(mdast).toEqual({
		type: 'root',
		children: [
			{
				// @ts-ignore
				type: 'htmlComment',
				value: ' This an HTML comment inside mdx. '
			}
		]
	});
});

test('To MDX.', ({ expect }) => {
	const mdast: Root = {
		type: 'root',
		children: [
			{
				// @ts-ignore
				type: 'htmlComment',
				value: ' This an HTML comment inside mdx. '
			}
		]
	};

	const markdown = toMarkdown(mdast, {
		extensions: [mdxToMarkdown(), htmlCommentToMarkdown()]
	});

	expect(markdown).toBe('<!-- This an HTML comment inside mdx. -->\n');
});
