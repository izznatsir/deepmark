#!/usr/bin/env node
import { Option, program } from 'commander';
import fs from 'fs-extra';
import np from 'node:path';
import nurl from 'node:url';
import { getMarkdown, getMdast } from './ast/mdast.js';
import { resolveConfig, getSourceFilePaths } from './config.js';
import { extractJsonOrYamlStrings, extractMdastStrings } from './extract.js';
import { format } from './format.js';
import { replaceJsonOrYamlStrings, replaceMdastStrings } from './replace.js';
import { translate } from './translate.js';

async function main() {
	const configFilePath = np.resolve(process.cwd(), 'deepmark.config.mjs');
	const config = resolveConfig(await import(nurl.pathToFileURL(configFilePath).href));

	program
		.name('deepmark')
		.description(
			'Translate your markdown files with Deepl machine translation.\nIt supports both `.md` and React `.mdx`.'
		);

	program
		.command('translate')
		.description('Translate strings with Deepl. Skip strings that have been translated previously.')
		.addOption(
			new Option(
				'--offline',
				'Only use Translation Memory to translate. Fallback to source string if not exists.'
			).conflicts(['hybrid', 'online'])
		)
		.addOption(
			new Option('--hybrid', 'Use both Translation Memory and Deepl API to translate.').conflicts([
				'offline',
				'online'
			])
		)
		.addOption(
			new Option(
				'--online',
				'Only use Deepl API to translate. It will rewrite the Translation Memory.'
			).conflicts(['offline', 'hybrid'])
		)
		.action(async (options: { hybrid: boolean; offline: boolean; online: boolean }) => {
			const mode: 'offline' | 'hybrid' | 'online' = options.offline
				? 'offline'
				: options.online
				? 'online'
				: 'hybrid';

			// resolve source paths
			const sourceFilePaths = await getSourceFilePaths(config);

			for (const { sourceFilePath, outputFilePath } of sourceFilePaths.md) {
				const markdown = await getFile(sourceFilePath);

				// extract strings
				const mdast = getMdast(await format(markdown));
				const strings = extractMdastStrings({ mdast, config });

				// translate strings
				const translations = await translate({ strings, mode, config });

				for (const targetLanguage of config.outputLanguages) {
					// replace strings
					const _mdast = replaceMdastStrings({
						mdast,
						strings: translations[targetLanguage]!,
						config
					});
					// write translated file
					await fs.writeFile(outputFilePath, getMarkdown(_mdast), { encoding: 'utf-8' });
				}
			}

			for (const { sourceFilePath, outputFilePath } of sourceFilePaths.json) {
				const json = await getFile(sourceFilePath);

				// extract strings
				const strings = extractJsonOrYamlStrings({ source: json, config });
				// translate strings
				const translations = await translate({ strings, mode, config });

				for (const targetLanguage of config.outputLanguages) {
					// replace strings
					const _json = replaceJsonOrYamlStrings({
						source: json,
						strings: translations[targetLanguage]!,
						config
					});
					// write translated file
					await fs.writeFile(outputFilePath, _json, { encoding: 'utf-8' });
				}
			}

			for (const { sourceFilePath, outputFilePath } of sourceFilePaths.yaml) {
				const yaml = await getFile(sourceFilePath);

				// extract strings
				const strings = extractJsonOrYamlStrings({ source: yaml, type: 'yaml', config });
				// translate strings
				const translations = await translate({ strings, mode, config });

				for (const targetLanguage of config.outputLanguages) {
					// replace strings
					const _json = replaceJsonOrYamlStrings({
						source: yaml,
						strings: translations[targetLanguage]!,
						type: 'yaml',
						config
					});
					// write translated file
					await fs.writeFile(outputFilePath, _json, { encoding: 'utf-8' });
				}
			}

			for (const { sourceFilePath, outputFilePath } of sourceFilePaths.others) {
				for (const targetLanguage of config.outputLanguages) {
					await fs.copy(sourceFilePath, outputFilePath.replace(/\$langcode\$/, targetLanguage));
				}
			}
		});
}

async function getFile(path: string): Promise<string> {
	return await fs.readFile(path, { encoding: 'utf-8' });
}

main();
