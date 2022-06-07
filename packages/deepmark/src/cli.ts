import type { Config } from '$types';

import { program } from 'commander';
import { create_extract_handler } from './commands/extract.js';
import { generate } from './commands/generate.js';
import { translate } from './commands/translate.js';
import { is_file_readable, resolve_path } from './utils.js';

async function main() {
	const deepmark_dir = resolve_path('deepmark');
	const config_file_name = 'deepmark.config.mjs';
	const config_file_path = resolve_path(deepmark_dir, config_file_name);

	if (!is_file_readable(config_file_path))
		throw new Error(`No configuration file found at the expected path: \n${config_file_path}`);

	const config: Config = await import(config_file_path);

	if (!config.deeplAuthKey) {
		const deepl_auth_key = process.env.DEEPL_AUTH_KEY;

		if (!deepl_auth_key)
			throw new Error(
				'You must provide Deepl auth key for developer API.Either in the \nconfig file or by setting DEEPL_AUTH_KEY environment variable.'
			);

		config.deeplAuthKey = deepl_auth_key;
	}

	program
		.name('deepmark')
		.description(
			'Translate your markdown files with Deepl machine translation.\nIt supports both `.md` and React `.mdx`.'
		);

	program
		.command('extract')
		.description(
			'Extract strings from markdown files that are intended to be translated.\nIt skip some markdown segments such as code block.'
		)
		.action(create_extract_handler(config));

	program
		.command('generate')
		.description('Generate translated markdown files from translated strings and AST.')
		.action(generate(config));

	program
		.command('translate')
		.description('Translate strings with Deepl. Skip strings that have been translated previously.')
		.action(translate(config));

	program.parse();
}

await main();
