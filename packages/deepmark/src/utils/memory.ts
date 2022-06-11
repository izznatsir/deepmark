import fs from 'fs-extra';
import { resolve_path } from '$utils';

export class TranslationMemory {
	data: TMData;
	path: string;

	constructor(path: string) {
		const resolved_path = resolve_path(path);
		try {
			this.data = JSON.parse(fs.readFileSync(resolved_path, { encoding: 'utf-8' }));
		} catch {
			this.data = {};
			fs.outputFileSync(resolved_path, JSON.stringify(this.data));
		}

		this.path = resolved_path;
	}

	get(source: string, language: string): string | undefined {
		return this.data[source] ? this.data[source][language] : undefined;
	}

	set(source: string, language: string, translation: string) {
		if (!this.data[source]) this.data[source] = {};
		this.data[source][language] = translation;
	}

	async serialize() {
		await fs.writeFile(this.path, JSON.stringify(this.data));
	}

	async reset() {
		this.data = {};
		await this.serialize();
	}
}

interface TMData {
	[Source: string]: { [Language: string]: string };
}
