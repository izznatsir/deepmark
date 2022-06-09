import type { Config } from '$types';

import { program } from 'commander';
import { create_format_handler } from './commands/format.js';
import { create_translate_handler } from './commands/translate.js';
import { is_file_readable, resolve_path } from '$utils';

async function main() {
	const deepmark_dir = resolve_path('deepmark');
	const config_file_name = 'deepmark.config.mjs';
	const config_file_path = resolve_path(deepmark_dir, config_file_name);

	if (!is_file_readable(config_file_path))
		throw new Error(`No configuration file found at the expected path: \n${config_file_path}`);

	const config: Config = await import(config_file_path);

	if (!config.deepl_auth_key) {
		const deepl_auth_key = process.env.DEEPL_AUTH_KEY;

		if (!deepl_auth_key)
			throw new Error(
				'You must provide Deepl auth key for developer API.Either in the \nconfig file or by setting DEEPL_AUTH_KEY environment variable.'
			);

		config.deepl_auth_key = deepl_auth_key;
	}

	program
		.name('deepmark')
		.description(
			'Translate your markdown files with Deepl machine translation.\nIt supports both `.md` and React `.mdx`.'
		);

	program
		.command('format')
		.description(
			'Format markdown files with Prettier and Remark. In some cases, it produces cleaner output than Prettier.'
		)
		.action(create_format_handler(config));

	program
		.command('translate')
		.description('Translate strings with Deepl. Skip strings that have been translated previously.')
		.action(create_translate_handler(config));

	program.parse();
}

await main();
