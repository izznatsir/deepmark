import fs from 'fs-extra';
import { resolvePath } from './fs.js';

export class TranslationMemory {
	data: TMData;
	path: string;
	updated: boolean = false;

	constructor(path: string) {
		const resolvedPath = resolvePath(path);
		try {
			this.data = JSON.parse(fs.readFileSync(resolvedPath, { encoding: 'utf-8' }));
		} catch {
			this.data = {};
			if (process.env.NODE_ENV !== 'test')
				fs.outputFileSync(resolvedPath, JSON.stringify(this.data));
		}

		this.path = resolvedPath;
	}

	get(source: string, language: string): string | undefined {
		return this.data[source] ? this.data[source][language] : undefined;
	}

	set(source: string, language?: string, translation?: string) {
		if (!this.data[source]) this.data[source] = {};
		this.updated = true;
		if (!language || !translation) return;
		this.data[source][language] = translation;
	}

	async serialize() {
		if (!this.updated) return;
		await fs.writeFile(this.path, JSON.stringify(this.data));
		this.updated = false;
	}

	async reset() {
		this.data = {};
		await this.serialize();
	}
}

interface TMData {
	[Source: string]: { [Language: string]: string };
}
