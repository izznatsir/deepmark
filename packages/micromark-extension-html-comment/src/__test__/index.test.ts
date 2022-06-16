import { test } from 'vitest';
import { htmlComment, htmlCommentToHtml } from '../index.js';
import { micromark } from 'micromark';

test('HTML comment with no value.', ({ expect }) => {
	const markdown = '<!---->';

	const html = micromark(markdown, 'utf-8', {
		extensions: [htmlComment()],
		htmlExtensions: [htmlCommentToHtml()]
	});

	expect(html).toBe('&lt;!----&gt;');
});

test('Single line HTML comment.', ({ expect }) => {
	const markdown = '<!-- This is a comment. -->';

	const html = micromark(markdown, 'utf-8', {
		extensions: [htmlComment()],
		htmlExtensions: [htmlCommentToHtml()]
	});

	expect(html).toBe('&lt;!-- This is a comment. --&gt;');
});

test('Multi lines HTML comment.', ({ expect }) => {
	const markdown = '<!-- This is a \n comment. -->';

	const html = micromark(markdown, 'utf-8', {
		extensions: [htmlComment()],
		htmlExtensions: [htmlCommentToHtml()]
	});

	expect(html).toBe('&lt;!-- This is a \n comment. --&gt;');
});
