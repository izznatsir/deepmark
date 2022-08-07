import type { TargetLanguageCode } from 'deepl-node';

import sqlite, {
	type Database as SqliteDatabase,
	type Statement as SqliteStatement
} from 'better-sqlite3';
import fs from 'fs-extra';
import np from 'path';

export class Database {
	database: SqliteDatabase;

	statements: {
		getTranslation: SqliteStatement<[string, string]>;
		setTranslation: SqliteStatement<[string, string, string, string]>;
		deleteTranslation: SqliteStatement<[string, string]>;
		resetTranslations: SqliteStatement;
		resetLanguageTranslations: SqliteStatement<[string]>;
	};

	constructor(path: string) {
		// TODO: handle io error
		fs.ensureDirSync(np.dirname(path));

		this.database = sqlite(path);

		// database schema migration
		const migrate = this.database.transaction(() => {
			this.database.exec(
				`CREATE TABLE IF NOT EXISTS translations (source TEXT, language VARCHAR(5), translation TEXT, UNIQUE(source, language))`
			);
		});

		migrate();

		this.statements = {
			getTranslation: this.database.prepare(
				`SELECT translation FROM translations WHERE source = ? AND language = ?`
			),
			setTranslation: this.database.prepare(
				`INSERT INTO translations VALUES (?, ?, ?) ON CONFLICT DO UPDATE SET translation = ?`
			),
			deleteTranslation: this.database.prepare(
				`DELETE FROM translations WHERE source = ? AND language = ?`
			),
			resetTranslations: this.database.prepare(`DELETE FROM translations`),
			resetLanguageTranslations: this.database.prepare(
				`DELETE FROM translations WHERE language = ?`
			)
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
		this.statements.setTranslation.run(source, language, translation, translation);
	}

	deleteTranslation(source: string, language: TargetLanguageCode) {
		this.statements.deleteTranslation.run(source, language);
	}

	resetTranslations(language?: TargetLanguageCode) {
		if (language) {
			this.statements.resetLanguageTranslations.run(language);
		} else {
			this.statements.resetTranslations.run();
		}
	}
}
