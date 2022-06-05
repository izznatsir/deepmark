import fs from 'fs-extra';
import np from 'path';

/**
 * @param { string[] } paths
 * @returns { string }
 */
export function resolve_path(...paths) {
	return np.resolve(process.cwd(), ...paths);
}

/**
 * @param { string } path
 * @returns { Promise<boolean> }
 */
export async function is_directory_exist(path) {
	try {
		const resolved_path = resolve_path(path);
		const stat = await fs.stat(resolved_path);
		if (stat.isDirectory()) return true;
		return false;
	} catch {
		return false;
	}
}

/**
 * @param { string } path
 * @returns { Promise<boolean> }
 */
export async function is_file_readable(path) {
	try {
		await fs.access(path, fs.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}

/**
 * @param { string } base
 * @param { string } path
 * @returns { string }
 */
export function get_path_tail(base, path) {
	const resolved_base = resolve_path(base);
	const resolved_path = resolve_path(path);

	return resolved_path.slice(resolved_base.length + 1);
}

/**
 * @param { string | string[] } string_or_array
 * @returns { string[] }
 */
export function get_string_array(string_or_array) {
	return Array.isArray(string_or_array) ? string_or_array : [string_or_array];
}
