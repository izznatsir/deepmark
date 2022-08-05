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
			Card: ['children', 'header'],
			List: ['items']
		};

		const strings = await extract('jsx/jsx-in-prop.mdx', config);
		expect(strings).toEqual([
			'This is a text inside a custom component.',
			'This is a text inside a jsx prop.',
			'This is the text of jsx item one. ',
			'This the nested text of jsx item one.',
			'This is the text of jsx item two. ',
			'This the nested text of jsx item two.'
		]);

		config.include.elements.jsxAttributes = {};
	});

	test('ignore <code> and <pre> elements by default', async ({ expect }) => {
		const strings = await extract('jsx/code-and-pre.mdx', config);
		expect(strings).toEqual(['This is a text. ']);
	});

	test('ignore some components via exclude.elements.jsx config', async ({ expect }) => {
		config.exclude.elements.jsx = [];

		const strings = await extract('jsx/exclude.mdx', config);
		expect(strings).toEqual([]);

		config.exclude.elements.jsx = [];
	});

	test('only extract some components via include.elements.jsx config', async ({ expect }) => {
		config.include.elements.jsx = ['Card'];

		const strings = await extract('jsx/include.mdx', config);
		expect(strings).toEqual(["This is the card's content."]);

		config.include.elements.jsx = [];
	});

	test('decide what components to extract if both include and exclude config are set', async ({
		expect
	}) => {
		config.exclude.elements.jsx = [];
		config.include.elements.jsx = [];

		const strings = await extract('jsx/exclude-and-include.mdx', config);
		expect(strings).toEqual([]);

		config.exclude.elements.jsx = [];
		config.include.elements.jsx = [];
	});
});
