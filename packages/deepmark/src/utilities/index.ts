import type { TranslateOptions } from '../features/index.js';
import type { Config, Context, UserConfig } from '../types/index.js';

import { Translator } from 'deepl-node';
import { pathToFileURL } from 'url';
import { is_file_readable } from './fs.js';
import { TranslationMemory } from './memory.js';

export * from './astring-jsx.js';
export * from './estree.js';
export * from './eswalk.js';
export * from './fs.js';
export * from './literal.js';
export * from './mdast.js';
export * from './memory.js';
export * from './unist.js';
export * from './unwalk.js';

export function create_context(options: TranslateOptions): Context {
	const context: Context = {
		memory: new TranslationMemory('./deepmark/memory.json')
	};

	if (!options.offline) {
		const deepl_key = process.env.DEEPL_AUTH_KEY;
		if (!deepl_key) throw new Error('DEEPL_AUTH_KEY environment variable is not found.');

		context.deepl = new Translator(deepl_key);
	}

	return context;
}

export async function get_user_config(path: string): Promise<UserConfig> {
	if (!is_file_readable(path))
		throw new Error('Configuration file either not exist or not readable.');

	const url = pathToFileURL(path);

	return (await import(url.href)).default as UserConfig;
}

export async function resolve_config(user_config: UserConfig): Promise<Config> {
	return {
		...user_config,
		frontmatter: user_config.frontmatter ?? [],
		ignore_nodes: user_config.ignore_nodes ?? [
			'code',
			'htmlComment',
			'mdxFlowExpression',
			'mdxjsEsm'
		],
		ignore_components: user_config.ignore_components ?? [],
		components_attributes: user_config.components_attributes ?? {}
	} as Config;
}

export function get_string_array(string_or_array: string | string[]): string[] {
	return Array.isArray(string_or_array) ? string_or_array : [string_or_array];
}
