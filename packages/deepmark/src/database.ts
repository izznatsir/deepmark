import type { TargetLanguageCode } from 'deepl-node';

import sqlite, {
	type Database as SqliteDatabase,
	type Statement as SqliteStatement
} from 'better-sqlite3';

export class Database {
	database: SqliteDatabase;

	statements: {
		getTranslation: SqliteStatement<[string, string]>;
		setTranslation: SqliteStatement<[string, string, string]>;
	};

	isChanged = false;

	constructor(path: string) {
		this.database = sqlite(path);

		// database schema migration
		const migrate = this.database.transaction(() => {
			this.database.exec(
				`CREATE TABLE IF NOT EXISTS translations (source TEXT, language VARCHAR(2), translation TEXT)`
			);
		});

		migrate();

		this.statements = {
			getTranslation: this.database.prepare(
				'SELECT translation FROM translations WHERE source = ? AND language = ?'
			),
			setTranslation: this.database.prepare('INSERT INTO translations VALUES (?, ?, ?)')
		};
	}

	getTranslation(source: string, language: TargetLanguageCode): string | undefined {
		const row: { translation: string } | undefined = this.statements.getTranslation.get(
			source,
			language
		);

		return row ? row.translation : undefined;
	}

	setTranslation(source: string, language: TargetLanguageCode, translation: string) {
		this.statements.setTranslation.run(source, language, translation);
		this.isChanged = true;
	}

	serialize() {
		if (!this.isChanged) return;

		this.database.serialize();
		this.isChanged = false;
	}

	resetTranslation() {
		this.database.exec('DROP TABLE IF EXISTS translations');
	}
}
