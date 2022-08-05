import type { Config } from './types/index.js';

import fg from 'fast-glob';
import fs from 'fs-extra';
import { formatMarkdown } from './features/index.js';
import { getStringArray, isDirectoryExist, resolvePath } from './utilities/index.js';

export function createFormatHandler(config: Config) {
	const { directories } = config;

	return async () => {
		const sourceDirs = getStringArray(sources);

		for (const sourceDir of sourceDirs) {
			if (!isDirectoryExist(sourceDir)) continue;

			const sourcePattern = sourceDir.replace(/\/$/, '') + '/**/*.{md,mdx}';
			const sourcePaths = (await fg(sourcePattern)).map((path) => resolvePath(path));

			for (const sourcePath of sourcePaths) {
				const outputPath = sourcePath;

				const markdown = await fs.readFile(sourcePath, { encoding: 'utf-8' });
				const formatted = await formatMarkdown(markdown);

				await fs.writeFile(outputPath, formatted);
			}
		}
	};
}
