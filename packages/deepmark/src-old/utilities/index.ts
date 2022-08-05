import type { TranslateOptions } from '../features/index.js';
import type { Config, ConfigFilter, Context, UserConfig } from '../types/index.js';

import { Translator } from 'deepl-node';
import { pathToFileURL } from 'url';
import { isFileReadable } from './fs.js';
import { DEFAULT_INCLUDE_HTML_ATTRIBUTES } from './html.js';
import { TranslationMemory } from './memory.js';

export * from './astring-jsx.js';
export * from './estree.js';
export * from './eswalk.js';
export * from './fs.js';
export * from './html.js';
export * from './literal.js';
export * from './mdast.js';
export * from './memory.js';
export * from './unist.js';
export * from './unwalk.js';

export function createContext(options: TranslateOptions, deeplAuthKey?: string): Context {
	const context: Context = {
		memory: new TranslationMemory('./deepmark/memory.json')
	};

	if (options.mode !== 'offline') {
		const deeplKey = deeplAuthKey ?? process.env.DEEPL_AUTH_KEY;
		if (!deeplKey) throw new Error('DEEPL_AUTH_KEY environment variable is not found.');

		context.deepl = new Translator(deeplKey);
	}

	return context;
}

export async function getUserConfig(path: string): Promise<UserConfig> {
	if (!isFileReadable(path))
		throw new Error('Configuration file either not exist or not readable.');

	const url = pathToFileURL(path);

	return (await import(url.href)).default as UserConfig;
}

export function resolveConfig(userConfig: UserConfig): Config {
	const defaultInclude: ConfigFilter = {
		sources: [],
		frontmatterFields: [],
		elements: {
			html: [],
			htmlAttributes: DEFAULT_INCLUDE_HTML_ATTRIBUTES,
			jsx: [],
			jsxAttributes: {},
			markdown: []
		}
	};

	const defaultExclude: ConfigFilter = {
		sources: [],
		frontmatterFields: [],
		elements: {
			html: [],
			htmlAttributes: {},
			jsx: [],
			jsxAttributes: {},
			markdown: ['code', 'htmlComment', 'mdxFlowExpression', 'mdxjsEsm']
		}
	};

	return {
		...userConfig,
		include: {
			sources: userConfig.include?.sources ?? defaultInclude.sources,
			frontmatterFields: userConfig.include?.frontmatterFields ?? defaultInclude.frontmatterFields,
			elements: {
				...defaultInclude.elements,
				...userConfig.include?.elements
			}
		},
		exclude: {
			sources: userConfig.exclude?.sources ?? defaultExclude.sources,
			frontmatterFields: userConfig.exclude?.frontmatterFields ?? defaultExclude.frontmatterFields,
			elements: {
				html: userConfig.exclude?.elements?.html
					? [...defaultExclude.elements.html, ...userConfig.exclude.elements.html]
					: defaultExclude.elements.html,
				htmlAttributes:
					userConfig.exclude?.elements?.htmlAttributes ?? defaultExclude.elements.htmlAttributes,
				jsx: userConfig.exclude?.elements?.jsx
					? [...defaultExclude.elements.jsx, ...userConfig.exclude.elements.jsx]
					: defaultExclude.elements.jsx,
				jsxAttributes:
					userConfig.exclude?.elements?.jsxAttributes ?? defaultExclude.elements.jsxAttributes,
				markdown: userConfig.exclude?.elements?.markdown
					? [...defaultExclude.elements.markdown, ...userConfig.exclude.elements.markdown]
					: defaultExclude.elements.jsx
			}
		}
	} as Config;
}

export function getStringArray(stringOrArray: string | string[]): string[] {
	return Array.isArray(stringOrArray) ? stringOrArray : [stringOrArray];
}
