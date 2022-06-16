import type { TranslateOptions } from '../features/index.js';
import type { Config, Context } from '../types/index.js';

import fs from 'fs-extra';
import np from 'path';
import { test } from 'vitest';
import {
	extract_mdast_strings,
	prepare,
	replace_mdast_strings,
	translate
} from '../features/index.js';
import { create_context } from '../utilities/index.js';
import type { TargetLanguageCode } from 'deepl-node';

const config: Config = {
	output_languages: ['ja', 'zh'],
	source_language: 'en',
	directories: {
		sources: [],
		outputs: []
	},
	components_attributes: {
		Card: ['children', 'title'],
		Tab: ['children', 'items.content']
	},
	frontmatter: ['title', 'author_title', 'tags'],
	ignore_components: ['Ignore'],
	ignore_nodes: ['code', 'mdxjsEsm']
};

const options: TranslateOptions = {
	hybrid: false,
	online: false,
	offline: true
};

const context: Context = create_context();

test.todo(
	'Replace translatable strings in a Docusaurus translation JSON with their translation strings.',
	() => {}
);

test('Replace translatable strings in a MdAST with their translation strings.', async ({
	expect
}) => {
	const markdown_path = np.resolve(process.cwd(), 'src/__test__/samples/complete.mdx');
	const markdown = await fs.readFile(markdown_path, { encoding: 'utf-8' });
	const root = prepare(markdown);
	const strings = extract_mdast_strings(root, config);
	const _strings = await translate(strings, options, config, context);
	context.memory.serialize();
	const _markdowns = replace_mdast_strings(root, _strings, config);

	for (const language in _markdowns) {
		const _markdown = _markdowns[language as TargetLanguageCode];
		const expected = await fs.readFile(
			np.resolve(process.cwd(), `src/__test__/samples/translated/${language}/complete.mdx`),
			{ encoding: 'utf-8' }
		);

		console.log(_markdown);

		expect(_markdown).toBe(expected);
	}
}, 10000);
