import type { TargetLanguageCode } from 'deepl-node';
import type { TranslateOptions } from './features/index.js';
import type { CommandHandler, Config, Context } from './types/index.js';

import fg from 'fast-glob';
import fs from 'fs-extra';
import {
	extractDocusaurusStrings,
	extractMdastStrings,
	prepare,
	replaceDocusaurusStrings,
	replaceMdastStrings,
	translate
} from './features/index.js';
import {
	createContext,
	getPathTail,
	getStringArray,
	isDirectoryExist,
	isJson,
	isMarkdown,
	joinPath,
	resolvePath
} from './utilities/index.js';

export function createTranslateHandler(config: Config): CommandHandler {
	const { sourceLanguage, outputLanguages, directories } = config;

	return async (options: TranslateOptions) => {
		const context: Context = createContext(options);
		const sourceDirs = getStringArray(sources);
		const outputDirs = getStringArray(outputs);

		for (let i = 0; i < sourceDirs.length; i++) {
			const sourceDir = sourceDirs[i].replace('%language%', sourceLanguage);
			const outputDir = outputDirs[i];
			if (!isDirectoryExist(sourceDir)) continue;

			const sourcePattern = sourceDir.replace(/\/$/, '') + '/**/*.*';
			const sourcePaths = (await fg(sourcePattern)).map((path) => resolvePath(path));

			const translatablePaths = sourcePaths.filter((path) => isMarkdown(path) || isJson(path));
			const copyablePaths = sourcePaths.filter((path) => !isMarkdown(path) && !isJson(path));

			for (const sourcePath of translatablePaths) {
				const outputPath = joinPath(outputDir, getPathTail(sourceDir, sourcePath));

				console.log('[TRANSLATING] ' + sourcePath);

				if (isMarkdown(sourcePath)) {
					const markdown = await fs.readFile(sourcePath, { encoding: 'utf-8' });
					const root = await prepare(markdown);
					const strings = extractMdastStrings(root, config);
					const translations = await translate(strings, options, config, context);
					const markdowns = replaceMdastStrings(root, translations, config);

					for (const language in markdowns) {
						const Markdown = markdowns[language as TargetLanguageCode];
						await fs.outputFile(outputPath.replace('%language%', language), Markdown!);
					}

					continue;
				}

				if (isJson(sourcePath)) {
					const json = await fs.readFile(sourcePath, { encoding: 'utf-8' });
					const object = JSON.parse(json);
					const strings = extractDocusaurusStrings(object);
					const translations = await translate(strings, options, config, context);
					const jsons = replaceDocusaurusStrings(object, translations);

					for (const language in jsons) {
						const Json = jsons[language as TargetLanguageCode];
						await fs.outputFile(outputPath.replace('%language%', language), Json!);
					}

					continue;
				}
			}

			for (const sourcePath of copyablePaths) {
				const outputPath = joinPath(outputDir, getPathTail(sourceDir, sourcePath));

				for (const language of outputLanguages) {
					await fs.copy(sourcePath, outputPath.replace('%language%', language));
				}
			}
		}

		context.memory.serialize();
	};
}
