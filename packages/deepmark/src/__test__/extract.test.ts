import fs from 'fs-extra';
import np from 'node:path';
import { config } from 'node:process';
import { describe } from 'vitest';
import { getMdast } from '../ast/mdast';
import { Config, resolveConfig, UserConfig } from '../config';
import { extractJsonOrYamlStrings, extractMdastStrings } from '../extract';
import { format } from '../format';

const baseConfig: UserConfig = {
	sourceLanguage: 'en',
	outputLanguages: ['zh'],
	directories: [['', '']],
	cwd: 'src/__test__/__samples__'
};

async function extract(
	path: string,
	config: Config,
	from: 'markdown' | 'json' | 'yaml' = 'markdown'
) {
	const resolvedPath = np.resolve(config.cwd, path);
	const source = await fs.readFile(resolvedPath, { encoding: 'utf-8' });

	if (from === 'markdown')
		return extractMdastStrings({ mdast: getMdast(await format(source)), config });

	return extractJsonOrYamlStrings({ source, type: from, config });
}

describe('extract frontmatter field string values', (test) => {
	test('ignore empty frontmatter', async ({ expect }) => {
		const strings = await extract('frontmatter/empty.md', resolveConfig(baseConfig));

		expect(strings.length).toBe(0);
	});

	test('filter frontmatter fields based on configuration', async ({ expect }) => {
		const strings = await extract(
			'frontmatter/index.md',
			resolveConfig({
				...baseConfig,
				frontmatterFields: {
					include: ['title', 'tags', 'description'],
					exclude: ['description']
				}
			})
		);

		expect(strings).toMatchSnapshot();
	});
});

describe('extract jsx children and attribute string values', (test) => {
	test('recursively extract strings from nested jsx components', async ({ expect }) => {
		const strings = await extract(
			'jsx/nested.mdx',
			resolveConfig({
				...baseConfig,
				jsxComponents: {
					include: {
						Block: { children: true, attributes: [] }
					}
				}
			})
		);

		expect(strings).toMatchSnapshot();
	});

	test('recursively extract strings from html elements and jsx components inside attributes', async ({
		expect
	}) => {
		const strings = await extract(
			'jsx/jsx-in-prop.mdx',
			resolveConfig({
				...baseConfig,
				jsxComponents: {
					include: {
						Card: {
							children: true,
							attributes: ['header']
						},
						List: {
							children: false,
							attributes: ['items']
						}
					}
				}
			})
		);

		expect(strings).toMatchSnapshot();
	});

	test('ignore some HTML elements by default', async ({ expect }) => {
		const strings = await extract('jsx/code-and-pre.mdx', resolveConfig(baseConfig));

		expect(strings).toMatchSnapshot();
	});
});

describe('extract strings from JSON based on configuration', (test) => {
	test('do not extract any string if no property name is included in the config', async ({
		expect
	}) => {
		const strings = await extract('json/navbar.json', resolveConfig(baseConfig), 'json');

		expect(strings.length).toBe(0);
	});

	test('filter properties based on the config', async ({ expect }) => {
		const strings = await extract(
			'json/navbar.json',
			resolveConfig({
				...baseConfig,
				jsonOrYamlProperties: {
					include: ['message', 'description'],
					exclude: ['message']
				}
			}),
			'json'
		);

		expect(strings).toMatchSnapshot();
	});
});

describe('extract strings from yaml based on configuration', (test) => {
	test('do not extract any string if no property name is included in the config', async ({
		expect
	}) => {
		const strings = await extract('yaml/authors.yml', resolveConfig(baseConfig), 'yaml');

		expect(strings.length).toBe(0);
	});

	test('filter properties based on the config', async ({ expect }) => {
		const strings = await extract(
			'yaml/authors.yml',
			resolveConfig({
				...baseConfig,
				jsonOrYamlProperties: {
					include: ['name', 'title'],
					exclude: ['name']
				}
			}),
			'yaml'
		);

		expect(strings).toMatchSnapshot();
	});
});
