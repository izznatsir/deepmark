import type { Config } from '../types/index.js';

import fs from 'fs-extra';
import np from 'path';
import { describe, test } from 'vitest';
import userConfig from './deepmark.config.mjs';
import { resolveConfig } from '../utilities/index.js';
import { extractMdastStrings, prepare } from '../features/index.js';

const config = resolveConfig(userConfig);
const base = 'src/__test__/samples';

async function extract(path: string, config: Config): Promise<string[]> {
	const resolved = np.resolve(process.cwd(), base, path);
	const markdown = await fs.readFile(resolved, { encoding: 'utf-8' });
	return extractMdastStrings(await prepare(markdown), config);
}

describe('frontmatter', () => {
	test('ignore empty frontmatter', async ({ expect }) => {
		const strings = await extract('frontmatter/empty.md', config);
		expect(strings.length).toBe(0);
	});

	test('filter frontmatter fields based on configuration', async ({ expect }) => {
		config.include.frontmatterFields = ['title', 'tags'];

		const strings = await extract('frontmatter/index.md', config);
		expect(strings).toEqual(['A Short Title', 'tagone', 'tagtwo']);

		config.include.frontmatterFields = [];
	});
});

describe('jsx', () => {
	test('recursively extract strings from nested jsx components', async ({ expect }) => {
		const strings = await extract('jsx/nested.mdx', config);
		expect(strings).toEqual([
			'This is a paragraph.',
			'This is a span.',
			'This is a text inside a custom component.'
		]);
	});

	test('recursively extract strings from jsx components inside attributes', async ({ expect }) => {
		config.include.elements.jsxAttributes = {
			Card: ['header'],
			List: ['items']
		};

		const strings = await extract('jsx/jsx-in-prop.mdx', config);
		expect(strings).toEqual([
			'This is a text inside a custom component.',
			'This is the text of jsx item one. ',
			'This the nested text of jsx item one.',
			'This is the text of jsx item two. ',
			'This the nested text of jsx item two.'
		]);

		config.include.elements.jsxAttributes = {};
	});

	test('ignore <code> and <pre> components by default', async ({ expect }) => {
		const strings = await extract('jsx/code-and-pre.mdx', config);
		expect(strings).toEqual(['This is a text. ']);
	});
});
