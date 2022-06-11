import type { Config, Context, UserConfig } from '$types';

import { Translator } from 'deepl-node';
import { is_mjs } from './fs.js';
import { TranslationMemory } from './memory.js';

export * from './estree.js';
export * from './fs.js';
export * from './mdast.js';
export * from './memory.js';
export * from './unist.js';

export function create_context(): Context {
	const deepl_key = process.env.DEEPL_AUTH_KEY;

	if (!deepl_key) throw new Error('DEEPL_AUTH_KEY environment variable is not found.');

	const deepl = new Translator(deepl_key);
	const memory = new TranslationMemory('./deepmark/memory.json');

	return {
		deepl,
		memory
	};
}

export async function resolve_config(path: string): Promise<Config> {
	if (!is_mjs(path))
		throw new Error('Configuration file must be defined as ES module with .mjs extension.');

	const config: UserConfig = await import(path);

	if (!config.components_attributes) config.components_attributes = {};
	if (!config.frontmatter) config.frontmatter = [];
	if (!config.ignore_components) config.ignore_components = [];
	if (!config.ignore_nodes)
		config.ignore_nodes = ['code', 'comment', 'mdxFlowExpression', 'mdxjsEsm'];

	return config as Config;
}

export function get_string_array(string_or_array: string | string[]): string[] {
	return Array.isArray(string_or_array) ? string_or_array : [string_or_array];
}
