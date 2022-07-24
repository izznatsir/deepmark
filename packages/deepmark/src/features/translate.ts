import type { TargetLanguageCode } from 'deepl-node';
import type { Config, Context } from '../types/index.js';

export interface TranslateOptions {
	mode: 'hybrid' | 'offline' | 'online';
	memorize: boolean;
}

export async function translate(
	strings: string[],
	options: TranslateOptions,
	{ source_language, output_languages }: Config,
	{ deepl, memory }: Context
): Promise<{ [Language in TargetLanguageCode]?: string[] }> {
	let container: [number, string][] = [];
	const translations: { [Language in TargetLanguageCode]?: string[] } = {};

	for (const target_language of output_languages) {
		const _translations: string[] = [];

		for (let i = 0; i < strings.length; i++) {
			const string = strings[i];

			if (options.mode === 'offline') {
				const translation = memory.get(string, target_language);

				if (translation) {
					_translations.push(translation);
				} else {
					_translations.push(string);
					if (options.memorize) memory.set(string);
				}

				continue;
			}

			if (options.mode === 'online') {
				container.push([i, string]);
				_translations.push('');

				if ((i === strings.length - 1 && container.length > 0) || container.length === 5) {
					const indexes = container.map(([index]) => index);
					const _strings = container.map(([__, string]) => string);

					const results = await deepl!.translateText(_strings, source_language, target_language, {
						tagHandling: 'html',
						splitSentences: 'nonewlines'
					});

					for (let j = 0; j < indexes.length; j++) {
						const index = indexes[j];
						const translation = results[j].text;
						const _string = _strings[j];

						if (options.memorize) memory.set(_string, target_language, translation);

						_translations[index] = translation;
					}

					container = [];
				}

				continue;
			}

			if (options.mode === 'hybrid') {
				const translation = memory.get(string, target_language);

				if (translation) {
					_translations.push(translation);
				} else {
					container.push([i, string]);
					_translations.push('');
				}

				if ((i === strings.length - 1 && container.length > 0) || container.length === 5) {
					const indexes = container.map(([index]) => index);
					const _strings = container.map(([__, string]) => string);

					const results = await deepl!.translateText(_strings, source_language, target_language, {
						tagHandling: 'html',
						splitSentences: 'nonewlines'
					});

					for (let j = 0; j < indexes.length; j++) {
						const index = indexes[j];
						const translation = results[j].text;
						const _string = _strings[j];

						if (options.memorize) memory.set(_string, target_language, translation);

						_translations[index] = translation;
					}

					container = [];
				}

				continue;
			}
		}

		translations[target_language] = _translations;
	}

	if (options.memorize) memory.serialize();

	return translations;
}
