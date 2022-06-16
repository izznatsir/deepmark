import { test } from 'vitest';
import { mdxHtmlComment } from '../index.js';
import { micromark } from 'micromark';

test('blank', ({expect}) => {
	const markdown = '<!---->';

	const html = micromark(markdown, 'utf-8', {
		extensions: [mdxHtmlComment()]
	});

    expect(html).toBe('<!---->')
});
