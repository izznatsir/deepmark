export * from './fs.js';
export * from './mdast.js';
export * from './unist.js';

export function get_string_array(string_or_array: string | string[]): string[] {
	return Array.isArray(string_or_array) ? string_or_array : [string_or_array];
}
