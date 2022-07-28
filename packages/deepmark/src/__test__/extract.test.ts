import type { UserConfig } from '../types/index.js';

import fs from 'fs-extra';
import np from 'path';
import { describe, test } from 'vitest';
import user_config from './deepmark.config.mjs';
import { resolve_config } from '../utilities/index.js';
import { extract_mdast_strings, prepare } from '../features/index.js';

const config = await resolve_config(user_config);
const base = 'src/__test__/samples';

async function extract(path: string, config: Required<UserConfig>): Promise<string[]> {
	const resolved = np.resolve(process.cwd(), base, path);
	const markdown = await fs.readFile(resolved, { encoding: 'utf-8' });
	return extract_mdast_strings(await prepare(markdown), config);
}

describe.skip('frontmatter', () => {
	test('ignore empty frontmatter', async ({ expect }) => {
		const strings = await extract('frontmatter/empty.md', config);
		expect(strings.length).toBe(0);
	});

	test('filter frontmatter fields based on configuration', async ({ expect }) => {
		const strings = await extract('frontmatter/index.md', config);
		expect(strings).toEqual(['A Short Title', 'tagone', 'tagtwo']);
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

	config.components_attributes = {
		Card: ['header'],
		List: ['items']
	};

	test('recursively extract strings from jsx components inside attributes', async ({ expect }) => {
		const strings = await extract('jsx/jsx-in-prop.mdx', config);
		console.log(strings);
		expect(strings).toEqual([
			'This is a text inside a custom component.',
			'This is the text of jsx item one. ',
			'This the nested text of jsx item one.',
			'This is the text of jsx item two. ',
			'This the nested text of jsx item two.'
		]);
	});

	config.components_attributes = {};
});
