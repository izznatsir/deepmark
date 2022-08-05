#!/usr/bin/env node
import { Option, program } from 'commander';
import { getUserConfig, resolveConfig, resolvePath } from './utilities/index.js';
import { createFormatHandler } from './format.js';
import { createTranslateHandler } from './translate.js';
import type { TranslateOptions } from './features/translate.js';

async function main() {
	const deepmark_dir = resolvePath('deepmark');
	const configFile_name = 'deepmark.config.mjs';
	const configFilePath = resolvePath(deepmark_dir, configFile_name);
	const config = resolveConfig(await getUserConfig(configFilePath));

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
		.action(createFormatHandler(config));

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

			await createTranslateHandler(config)(resolved_options);
		});

	program.parse();
}

main();
