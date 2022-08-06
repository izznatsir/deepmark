import fs from 'fs-extra';
import np from 'path';
import { afterAll, describe, test } from 'vitest';
import { Database } from '../database.js';

afterAll(() => {
	const tmpDir = np.resolve(process.cwd(), 'src/__test__/tmp');
	fs.rmSync(tmpDir, { force: true, recursive: true });
	fs.mkdirSync(tmpDir);
});

describe('translation memory', () => {
	const storage = np.resolve(process.cwd(), 'src/__test__/tmp/tm.sqlite');

	const db = new Database(storage);

	test('successfully migrate the schema', ({ expect }) => {
		const table = db.database
			.prepare(`SELECT name FROM sqlite_schema WHERE type = 'table' ORDER BY name`)
			.get();

		expect(table.name).toBe('translations');

		const columns = db.database
			.prepare(`SELECT name FROM pragma_table_info('translations') ORDER BY name`)
			.all()
			.map((column) => column.name);

		expect(columns).toEqual(['language', 'source', 'translation']);

		const dbb = new Database(storage);
	});

	test('add translation');

	test('only create translations tabe if not exists', () => {});

	test('update translation');

	test('delete translation');

	test('reset translations');
});
