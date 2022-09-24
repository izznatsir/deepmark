import { Command, Option } from 'commander';
import fs from 'fs-extra';
import np from 'node:path';
import nurl from 'node:url';
import { getMarkdown, getMdast } from './ast/mdast.js';
import type { Config, UserConfig } from './config.js';
import { resolveConfig, getSourceFilePaths } from './config.js';
import { extractJsonOrYamlStrings, extractMdastStrings } from './extract.js';
import { format } from './format.js';
import { replaceJsonOrYamlStrings, replaceMdastStrings } from './replace.js';
import { translate } from './translate.js';

export function createCli() {
	const program = new Command();

	program
		.name('deepmark')
		.description(
			'Translate your markdown files with Deepl machine translation.\nIt supports both `.md` and React `.mdx`.'
		)
		.option(
			'-c, --config <path>',
			'Overide configuration file path. Either a relative path to the current workink directory or an absolute path.',
			'deepmark.config.mjs'
		);

	program
		.command('translate')
		.description('Translate strings with Deepl API and local translation memory.')
		.option(
			'-m, --mode <hybrid|offline|online>',
			'Set translation mode, defaults to hybrid.',
			'hybrid'
		)
		.action(async (__, command: Command) => {
			const options = command.optsWithGlobals() as {
				mode: 'hybrid' | 'offline' | 'online';
				config: string;
			};

			const config = await getThenResolveConfig(options.config);

			// resolve source paths
			const sourceFilePaths = await getSourceFilePaths(config);

			for (const { sourceFilePath, outputFilePath } of sourceFilePaths.md) {
				const markdown = await getFile(sourceFilePath);

				// extract strings
				const mdast = getMdast(await format(markdown));
				const strings = extractMdastStrings({ mdast, config });

				// translate strings
				const translations = await translate({ strings, mode: options.mode, config });

				for (const targetLanguage of config.outputLanguages) {
					// replace strings
					const _mdast = replaceMdastStrings({
						mdast,
						strings: translations[targetLanguage]!,
						config
					});
					// write translated file
					await fs.outputFile(
						outputFilePath.replace(/\$langcode\$/, targetLanguage),
						getMarkdown(_mdast),
						{ encoding: 'utf-8' }
					);
				}
			}

			for (const { sourceFilePath, outputFilePath } of sourceFilePaths.json) {
				const json = await getFile(sourceFilePath);

				// extract strings
				const strings = extractJsonOrYamlStrings({ source: json, config });
				// translate strings
				const translations = await translate({ strings, mode: options.mode, config });

				for (const targetLanguage of config.outputLanguages) {
					// replace strings
					const _json = replaceJsonOrYamlStrings({
						source: json,
						strings: translations[targetLanguage]!,
						config
					});
					// write translated file
					await fs.outputFile(outputFilePath.replace(/\$langcode\$/, targetLanguage), _json, {
						encoding: 'utf-8'
					});
				}
			}

			for (const { sourceFilePath, outputFilePath } of sourceFilePaths.yaml) {
				const yaml = await getFile(sourceFilePath);

				// extract strings
				const strings = extractJsonOrYamlStrings({ source: yaml, type: 'yaml', config });
				// translate strings
				const translations = await translate({ strings, mode: options.mode, config });

				for (const targetLanguage of config.outputLanguages) {
					// replace strings
					const _json = replaceJsonOrYamlStrings({
						source: yaml,
						strings: translations[targetLanguage]!,
						type: 'yaml',
						config
					});
					// write translated file
					await fs.outputFile(outputFilePath.replace(/\$langcode\$/, targetLanguage), _json, {
						encoding: 'utf-8'
					});
				}
			}

			for (const { sourceFilePath, outputFilePath } of sourceFilePaths.others) {
				for (const targetLanguage of config.outputLanguages) {
					await fs.copy(sourceFilePath, outputFilePath.replace(/\$langcode\$/, targetLanguage));
				}
			}
		});

	return program;
}

async function getThenResolveConfig(path?: string): Promise<Config> {
	const configFilePath = path
		? path.startsWith('/')
			? path
			: np.resolve(process.cwd(), path)
		: np.resolve(process.cwd(), 'deepmark.config.mjs');

	const userConfig: UserConfig = (await import(configFilePath)).default;
	return resolveConfig(userConfig);
}

async function getFile(path: string): Promise<string> {
	return await fs.readFile(path, { encoding: 'utf-8' });
}
