import fs from 'fs-extra';
import np from 'path';

export function get_path_tail(base: string, path: string): string {
	const resolved_base = resolve_path(base);
	const resolved_path = resolve_path(path);

	return resolved_path.slice(resolved_base.length + 1);
}

export async function is_directory_exist(path: string): Promise<boolean> {
	try {
		const resolved_path = resolve_path(path);
		const stat = await fs.stat(resolved_path);
		if (stat.isDirectory()) return true;
		return false;
	} catch {
		return false;
	}
}

export async function is_file_readable(path: string): Promise<boolean> {
	try {
		await fs.access(path, fs.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}

export function is_markdown(path: string): boolean {
	return is_md(path) || is_mdx(path);
}

export function is_md(path: string): boolean {
	return path.endsWith('.md');
}

export function is_mdx(path: string): boolean {
	return path.endsWith('.mdx');
}

export function is_ast_json(path: string): boolean {
	return path.endsWith('.ast.json');
}

export function is_md_json(path: string): boolean {
	return path.endsWith('.md.json');
}

export function is_mdx_json(path: string): boolean {
	return path.endsWith('.mdx.json');
}

export function is_mjs(path: string): boolean {
	return path.endsWith('.mjs');
}

export function is_json(path: string): boolean {
	return path.endsWith('.json') && !is_ast_json(path);
}

export function resolve_path(...paths: string[]): string {
	return np.resolve(process.cwd(), ...paths);
}
