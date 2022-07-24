#!/usr/bin/env node
import { Option, program } from 'commander';
import { get_user_config, resolve_config, resolve_path } from './utilities/index.js';
import { create_format_handler } from './commands/format.js';
import { create_translate_handler } from './commands/translate.js';
import type { TranslateOptions } from './features/translate.js';

async function main() {
	const deepmark_dir = resolve_path('deepmark');
	const config_file_name = 'deepmark.config.mjs';
	const config_file_path = resolve_path(deepmark_dir, config_file_name);
	const config = await resolve_config(await get_user_config(config_file_path));

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
		.option('-p, --prettier', 'Format with Prettier.')
		.action(create_format_handler(config));

	program
		.command('translate')
		.description('Translate strings with Deepl. Skip strings that have been translated previously.')
		.addOption(
			new Option('--hybrid', 'Use both Translation Memory and Deepl API.').conflicts([
				'online',
				'ofline'
			])
		)
		.addOption(
			new Option('--online', 'Only use Deepl API to translate.').conflicts(['hybrid', 'ofline'])
		)
		.addOption(
			new Option(
				'--offline',
				'Only use Translation Memory to translate. Fallback to source string if not exists.'
			).conflicts(['hybrid', 'online'])
		)
		.action(async (options: { hybrid: boolean; offline: boolean; online: boolean }) => {
			const resolved_options: TranslateOptions = {
				mode: options.online ? 'online' : options.offline ? 'offline' : 'hybrid',
				memorize: true
			};

			await create_translate_handler(config)(resolved_options);
		});

	program.parse();
}

main();
