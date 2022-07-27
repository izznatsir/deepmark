import fs from 'fs-extra';
import np from 'path';
import { describe, test } from 'vitest';
import user_config from './deepmark.config.mjs';
import { resolve_config } from '../utilities/index.js';
import { extract_mdast_strings, prepare } from '../features/index.js';

const config = await resolve_config(user_config);
const cwd = process.cwd();
const dir = 'src/__test__/samples';

async function extract(path: string): Promise<string[]> {
	const resolved = np.resolve(cwd, dir, path);
	const value = await fs.readFile(resolved, { encoding: 'utf-8' });
	return extract_mdast_strings(await prepare(value), config);
}

describe('frontmatter', () => {
	test('ignore empty frontmatter', async ({ expect }) => {
		const strings = await extract('frontmatter/empty.md');
		expect(strings.length).toBe(0);
	});

	test('filter frontmatter fields based on configuration', async ({ expect }) => {
		const strings = await extract('frontmatter/index.md');
		expect(strings).toEqual(['Shocking Title', 'shocking', 'intriguing']);
	});
});

describe('jsx', () => {
	test('recursively extract strings from nested jsx components', () => {});
});
