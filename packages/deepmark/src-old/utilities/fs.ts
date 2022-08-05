import fs from 'fs-extra';
import np from 'path';

export function getPathTail(base: string, path: string): string {
	const resolvedBase = resolvePath(base);
	const resolvedPath = resolvePath(path);

	return resolvedPath.slice(resolvedBase.length + 1);
}

export async function isDirectoryExist(path: string): Promise<boolean> {
	try {
		const resolvedPath = resolvePath(path);
		const stat = await fs.stat(resolvedPath);
		if (stat.isDirectory()) return true;
		return false;
	} catch {
		return false;
	}
}

export async function isFileReadable(path: string): Promise<boolean> {
	try {
		await fs.access(path, fs.constants.R_OK);
		return true;
	} catch {
		return false;
	}
}

export function isJson(path: string): boolean {
	return path.endsWith('.json') && !isAstJson(path);
}

export function isMarkdown(path: string): boolean {
	return isMd(path) || isMdx(path);
}

export function isMd(path: string): boolean {
	return path.endsWith('.md');
}

export function isMdx(path: string): boolean {
	return path.endsWith('.mdx');
}

export function isAstJson(path: string): boolean {
	return path.endsWith('.ast.json');
}

export function isMdJson(path: string): boolean {
	return path.endsWith('.md.json');
}

export function isMdxJson(path: string): boolean {
	return path.endsWith('.mdx.json');
}

export function isMjs(path: string): boolean {
	return path.endsWith('.mjs');
}

export function joinPath(...paths: string[]): string {
	return np.join(process.cwd(), ...paths);
}

export function resolvePath(...paths: string[]): string {
	return np.resolve(process.cwd(), ...paths);
}
