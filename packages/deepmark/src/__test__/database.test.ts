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
		const table = db
			.prepare(`SELECT name FROM sqlite_schema WHERE type = 'table' ORDER BY name`)
			.get();

		expect(table.name).toBe('translations');

		const rows = db
			.prepare(`SELECT name FROM pragma_table_info('translations') ORDER BY name`)
			.all()
			.map((column) => column.name);

		expect(rows).toEqual(['language', 'source', 'translation']);

		const dbb = new Database(storage);
	});

	test('add translation', ({ expect }) => {
		db.setTranslation({
			language: 'en-US',
			source: 'kamu',
			translation: 'you'
		});

		const translation = db.getTranslation({ language: 'en-US', source: 'kamu' });

		expect(translation).toBe('you');
	});

	test('only create translations tabe if not exists', ({ expect }) => {
		const db2 = new Database(storage);

		const translation = db2.getTranslation({ language: 'en-US', source: 'kamu' });

		expect(translation).toBe('you');
	});

	test('update translation', ({ expect }) => {
		db.setTranslation({
			language: 'en-US',
			source: 'kamu',
			translation: 'ya'
		});

		const count = db.prepare('SELECT count() AS count FROM translations').get().count;
		const translation = db.getTranslation({ language: 'en-US', source: 'kamu' });

		expect(count).toBe(1);
		expect(translation).toBe('ya');
	});

	test('delete translation', ({ expect }) => {
		db.setTranslation({
			language: 'en-US',
			source: 'dia',
			translation: 'they'
		});

		const translation = db.getTranslation({
			language: 'en-US',
			source: 'dia'
		});

		expect(translation).toBe('they');

		db.deleteTranslation({
			language: 'en-US',
			source: 'dia'
		});

		const count = db.prepare('SELECT count() AS count FROM translations').get().count;

		expect(count).toBe(1);
	});

	test('reset translations of a particular target language', ({ expect }) => {
		db.setTranslation({
			language: 'de',
			source: 'dia',
			translation: 'sie'
		});

		const translation = db.getTranslation({
			language: 'de',
			source: 'dia'
		});

		expect(translation).toBe('sie');

		db.resetTranslations({ language: 'de' });

		const count = db
			.prepare(`SELECT count() AS count FROM translations WHERE language = 'de'`)
			.get().count;

		expect(count).toBe(0);
	});

	test('reset translations', ({ expect }) => {
		db.resetTranslations();

		const count = db.prepare('SELECT count() AS count FROM translations').get().count;

		expect(count).toBe(0);
	});
});
