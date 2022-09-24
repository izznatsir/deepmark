import type { TargetLanguageCode } from 'deepl-node';
import { Translator } from 'deepl-node';
import np from 'node:path';
import type { Config } from './config';
import { Database } from './database';

export async function translate({
	strings,
	mode = 'hybrid',
	memorize = true,
	config
}: {
	strings: string[];
	mode?: 'offline' | 'hybrid' | 'online';
	memorize?: boolean;
	config: Config;
}): Promise<{ [Property in TargetLanguageCode]?: string[] }> {
	const db: Database = new Database(np.resolve(config.cwd, '.deepmark/db.sqlite'));
	const translations: { [Property in TargetLanguageCode]?: string[] } = {};

	if (mode !== 'offline') {
		const DEEPL_AUTH_KEY = process.env.DEEPL_AUTH_KEY;
		if (!DEEPL_AUTH_KEY) throw new Error('DEEPL_AUTH_KEY environment variable must be set');

		const deepl = new Translator(DEEPL_AUTH_KEY);
		const queue: [index: number, string: string][] = [];
		const hybrid = mode === 'hybrid';

		for (const targetLanguage of config.outputLanguages) {
			const _translations: string[] = [];

			for (const [index, string] of strings.entries()) {
				if (hybrid) {
					const translation = db.getTranslation({
						source: string,
						language: targetLanguage
					});

					if (translation) {
						_translations.push(translation);
						continue;
					}
				}

				queue.push([index, string]);
				_translations.push('');

				if ((index === strings.length - 1 && queue.length > 0) || queue.length === 10) {
					const indexes = queue.map(([index]) => index);
					const _strings = queue.map(([__, string]) => string);

					const results = await deepl.translateText(
						_strings,
						config.sourceLanguage,
						targetLanguage,
						{
							tagHandling: 'html',
							splitSentences: 'nonewlines'
						}
					);

					queue.reverse();
					for (let j = 0; j < indexes.length; j++) {
						const index = indexes[j];
						const translation = results[j].text;
						const string = _strings[j];

						if (memorize)
							db.setTranslation({ source: string, language: targetLanguage, translation });

						_translations[index] = translation;
						queue.pop();
					}
				}
			}
		}
	} else {
		for (const targetLanguage of config.outputLanguages) {
			const _translations: string[] = [];

			for (const string of strings) {
				const translation = db.getTranslation({
					source: string,
					language: targetLanguage
				});

				if (translation) {
					_translations.push(translation);
					continue;
				}

				_translations.push(string);
			}
		}
	}

	return translations;
}
