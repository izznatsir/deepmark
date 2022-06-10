import type { Config, Context } from '$types';
import type { TargetLanguageCode } from 'deepl-node';

export async function translate(
	sources: string[],
	{ source_language, output_languages }: Config,
	{ deepl, memory }: Context
): Promise<{ [Language in TargetLanguageCode]?: string[] }> {
	let container: [number, string][] = [];
	const translations: { [Language in TargetLanguageCode]?: string[] } = {};

	for (let i = 0; i < sources.length; i++) {
		const source = sources[i];

		for (const target_language of output_languages) {
			const _translations: string[] = [];

			const translation = memory.get(source, target_language);

			if (translation) {
				_translations.push(translation);
			} else {
				if (i !== sources.length - 1 && container.length < 5) {
					container.push([i, source]);
					_translations.push('');
				} else {
					const indexes = container.map(([index]) => index);
					const _sources = container.map(([__, source]) => source);

					const results = await deepl.translateText(_sources, source_language, target_language);
					for (let i = 0; i < indexes.length; i++) {
						const index = indexes[i];
						const translation = results[i].text;

						_translations[index] = translation;
					}

					container = [];
				}
			}

			translations[target_language] = _translations;
		}
	}

	return translations;
}
