import type { Config, Context } from '$types';
import type { TargetLanguageCode } from 'deepl-node';

export async function translate(
	strings: string[],
	{ source_language, output_languages }: Config,
	{ deepl, memory }: Context
): Promise<{ [Language in TargetLanguageCode]?: string[] }> {
	let container: [number, string][] = [];
	const translations: { [Language in TargetLanguageCode]?: string[] } = {};

	for (const target_language of output_languages) {
		const _translations: string[] = [];

		for (let i = 0; i < strings.length; i++) {
			const string = strings[i];

			const translation = memory.get(string, target_language);

			if (translation) {
				_translations.push(translation);
			} else {
				container.push([i, string]);
				_translations.push('');

				if (i === strings.length - 1 || container.length === 5) {
					const indexes = container.map(([index]) => index);
					const _strings = container.map(([__, string]) => string);

					const results = await deepl.translateText(_strings, source_language, target_language, {
						tagHandling: 'html',
						splitSentences: 'nonewlines'
					});

					for (let i = 0; i < indexes.length; i++) {
						const index = indexes[i];
						const translation = results[i].text;
						const _string = _strings[i];

						memory.set(_string, target_language, translation);

						_translations[index] = translation;
					}

					container = [];
				}
			}
		}

		translations[target_language] = _translations;
	}

	return translations;
}
