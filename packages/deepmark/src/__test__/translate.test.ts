import type { TranslateOptions } from '../features/index.js';
import type { Config, Context } from '../types/index.js';

import nock from 'nock';
import { test } from 'vitest';
import { create_context } from '../utilities/index.js';
import { translate } from '../features/index.js';
import type { TargetLanguageCode } from 'deepl-node';

const config: Config = {
	output_languages: ['ja', 'zh'],
	source_language: 'en',
	directories: {
		sources: [],
		outputs: []
	},
	components_attributes: {},
	frontmatter: [],
	ignore_components: [],
	ignore_nodes: []
};

const options: TranslateOptions = {
	mode: 'online',
	memorize: false
};

const context: Context = create_context(options, 'asecret_authkey');

const URL = 'https://api.deepl.com/v2/translate';

test('translate in online mode', async ({ expect }) => {
	console.log(process.env.NODE_ENV);
	nock(URL)
		.post(/\/?/)
		.reply(200, {
			translations: [
				{
					detected_source_language: 'EN',
					text: '<p>translated text ja 1</p>'
				},
				{
					detected_source_language: 'EN',
					text: '<p>translated text ja 2</p>'
				}
			]
		})
		.post(/\/?/)
		.reply(200, {
			translations: [
				{
					detected_source_language: 'EN',
					text: '<p>translated text zh 1</p>'
				},
				{
					detected_source_language: 'EN',
					text: '<p>translated text zh 2</p>'
				}
			]
		});

	const strings: string[] = ['<p>source text 1</p>', '<p>source text 2</p>'];
	const translations = await translate(strings, options, config, context);
	const expected: { [Language in TargetLanguageCode]?: string[] } = {
		ja: ['<p>translated text ja 1</p>', '<p>translated text ja 2</p>'],
		zh: ['<p>translated text zh 1</p>', '<p>translated text zh 2</p>']
	};

	expect(translations).toEqual(expected);
});
