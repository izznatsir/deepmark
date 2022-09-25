import { describe } from 'vitest';
import { createCli } from '../cli';

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

	// test('translate command in online mode', async () => {
	// 	const cli = createCli();
	// 	cli.exitOverride();
	// 	cli.configureOutput({
	// 		writeOut: () => {},
	// 		writeErr: () => {}
	// 	});

	// 	await cli.parseAsync(
	// 		['--config', 'src/__test__/__samples__/config/online.mjs', 'translate', '--mode', 'online'],
	// 		{
	// 			from: 'user'
	// 		}
	// 	);
	// });

	// test('translate command in hybrid mode', async () => {
	// 	const cli = createCli();
	// 	cli.exitOverride();
	// 	cli.configureOutput({
	// 		writeOut: () => {},
	// 		writeErr: () => {}
	// 	});

	// 	await cli.parseAsync(
	// 		['--config', 'src/__test__/__samples__/config/hybrid.mjs', 'translate', '--mode', 'hybrid'],
	// 		{
	// 			from: 'user'
	// 		}
	// 	);
	// });
});
