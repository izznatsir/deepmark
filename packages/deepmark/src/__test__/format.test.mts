import fg from 'fast-glob';
import fs from 'fs-extra';
import np from 'path';

import { test } from 'vitest';
import { format } from '$feats';

const BASE_DIR = np.resolve(process.cwd(), 'test/format');
const FORMATTED_DIR = np.resolve(BASE_DIR, 'formatted');
const UNFORMATTED_DIR = np.resolve(BASE_DIR, 'unformatted');

test('Format markdown files based on specified config file.', async ({ expect }) => {
	const unformatted_paths = await fg(np.join(UNFORMATTED_DIR, '*.mdx'));

	for (const unformatted_path of unformatted_paths) {
		const formatted_path = np.join(
			FORMATTED_DIR,
			unformatted_path.slice(UNFORMATTED_DIR.length + 1)
		);
		const markdown = await fs.readFile(unformatted_path, { encoding: 'utf-8' });
		const formatted = await format(markdown);
		const expected = await fs.readFile(formatted_path, { encoding: 'utf-8' });

		expect(formatted).toBe(expected);
	}
});
