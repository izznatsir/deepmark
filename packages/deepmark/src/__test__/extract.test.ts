import fs from 'fs-extra';
import np from 'path';
import { test } from 'vitest';
import user_config from './deepmark.config.mjs';
import { resolve_config } from '../utilities/index.js';
import { extract_mdast_strings, prepare } from '../features/index.js';

const config = await resolve_config(user_config);
const cwd = process.cwd();
const dir = 'src/__test__/samples';

async function job(path: string): Promise<string[]> {
	const resolved = np.resolve(cwd, dir, path);
	const value = await fs.readFile(resolved, { encoding: 'utf-8' });
	return extract_mdast_strings(prepare(value), config);
}

test('Handle empty YAML.', async ({ expect }) => {
	const strings = await job('frontmatter/empty.md');
	expect(strings.length).toBe(0);
});

test('Extract only fields that are stated in the configuration.', async ({ expect }) => {
	const strings = await job('frontmatter/ideal.md');
	expect(strings).toEqual(['Shocking Title', 'shocking', 'intriguing']);
});
