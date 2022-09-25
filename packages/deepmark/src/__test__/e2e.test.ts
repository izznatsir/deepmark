import dotenv from 'dotenv';
import nock from 'nock';
import np from 'node:path';
import { afterAll, beforeAll, describe } from 'vitest';
import { Database } from '../database';
import { createCli } from '../cli';

let count = 0;

beforeAll(() => {
	dotenv.config({
		path: 'src/__test__/.env'
	});

	nock('https://api.deepl.com')
		.post('/v2/translate')
		.reply(function (__, body) {
			const data = new URLSearchParams(body);

			return [
				200,
				{
					translations: data.getAll('text').map(() => {
						count++;
						return {
							detected_source_language: 'en',
							text: 'translation' + count
						};
					})
				}
			];
		})
		.persist();
});

afterAll(() => {
	const db = new Database(np.resolve(process.cwd(), '../../example/.deepmark/db.sqlite'));

	db.resetTranslations();
});

describe('Deepmark CLI E2E', (test) => {
	test('translate command in offline mode', async () => {
		const cli = createCli();
		cli.exitOverride();
		cli.configureOutput({
			writeOut: () => {},
			writeErr: () => {}
		});

		await cli.parseAsync(
			['--config', 'src/__test__/__samples__/config/offline.mjs', 'translate', '--mode', 'offline'],
			{
				from: 'user'
			}
		);
	});

	test('translate command in online mode', async () => {
		const cli = createCli();
		cli.exitOverride();
		cli.configureOutput({
			writeOut: () => {},
			writeErr: () => {}
		});

		await cli.parseAsync(
			['--config', 'src/__test__/__samples__/config/online.mjs', 'translate', '--mode', 'online'],
			{
				from: 'user'
			}
		);
	});

	test('translate command in hybrid mode', async () => {
		const cli = createCli();
		cli.exitOverride();
		cli.configureOutput({
			writeOut: () => {},
			writeErr: () => {}
		});

		await cli.parseAsync(
			['--config', 'src/__test__/__samples__/config/hybrid.mjs', 'translate', '--mode', 'hybrid'],
			{
				from: 'user'
			}
		);
	});
});
