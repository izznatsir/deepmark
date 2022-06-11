#!/usr/bin/env node
import { program } from 'commander';
import { create_context, is_file_readable, resolve_config, resolve_path } from '$utils';
import { create_format_handler } from './commands/format.js';
import { create_translate_handler } from './commands/translate.js';

async function main() {
	const deepmark_dir = resolve_path('deepmark');
	const config_file_name = 'deepmark.config.mjs';
	const config_file_path = resolve_path(deepmark_dir, config_file_name);

	if (!is_file_readable(config_file_path))
		throw new Error(`No configuration file found at the expected path: \n${config_file_path}`);

	const config = await resolve_config(config_file_path);
	const context = create_context();

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
		.action(create_translate_handler(config, context));

	program.parse();
}

main();
