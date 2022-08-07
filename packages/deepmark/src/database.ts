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
		getTranslation: SqliteStatement<{ source: string; language: TargetLanguageCode }>;
		setTranslation: SqliteStatement<{
			source: string;
			language: TargetLanguageCode;
			translation: string;
		}>;
		deleteTranslation: SqliteStatement<{ source: string; language: TargetLanguageCode }>;
		resetTranslations: SqliteStatement;
		resetLanguageTranslations: SqliteStatement<{ language: TargetLanguageCode }>;
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
				`SELECT translation FROM translations WHERE source = $source AND language = $language`
			),
			setTranslation: this.database.prepare(
				`INSERT INTO translations VALUES ($source, $language, $translation) ON CONFLICT DO UPDATE SET translation = $translation`
			),
			deleteTranslation: this.database.prepare(
				`DELETE FROM translations WHERE source = $source AND language = $language`
			),
			resetTranslations: this.database.prepare(`DELETE FROM translations`),
			resetLanguageTranslations: this.database.prepare(
				`DELETE FROM translations WHERE language = $language`
			)
		};
	}

	getTranslation(variables: { source: string; language: TargetLanguageCode }): string | undefined {
		const row: { translation: string } | undefined = this.statements.getTranslation.get(variables);

		return row ? row.translation : undefined;
	}

	setTranslation(variables: { source: string; language: TargetLanguageCode; translation: string }) {
		this.statements.setTranslation.run(variables);
	}

	deleteTranslation(variables: { source: string; language: TargetLanguageCode }) {
		this.statements.deleteTranslation.run(variables);
	}

	resetTranslations(variables?: { language: TargetLanguageCode }) {
		if (variables) {
			this.statements.resetLanguageTranslations.run(variables);
		} else {
			this.statements.resetTranslations.run();
		}
	}
}
