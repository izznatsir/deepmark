import type { Config, UserConfig } from '$types';

import { is_mjs } from './fs.js';

export * from './estree.js';
export * from './fs.js';
export * from './mdast.js';
export * from './memory.js';
export * from './unist.js';

export async function resolve_config(path: string): Promise<Config> {
	if (!is_mjs(path))
		throw new Error('Configuration file must be defined as ES module with .mjs extension.');

	const config: UserConfig = await import(path);

	if (!config.components) config.components = {};
	if (!config.frontmatter) config.frontmatter = [];
	if (!config.ignore_nodes)
		config.ignore_nodes = ['code', 'comment', 'mdxFlowExpression', 'mdxjsEsm'];

	return config as Config;
}

export function get_string_array(string_or_array: string | string[]): string[] {
	return Array.isArray(string_or_array) ? string_or_array : [string_or_array];
}
