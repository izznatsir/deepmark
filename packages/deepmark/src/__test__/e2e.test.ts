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
			['--config', 'src/__test__/__config__.mjs', 'translate', '--mode', 'offline'],
			{
				from: 'user'
			}
		);
	});
});
