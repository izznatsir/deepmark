import np from 'node:path';
import { describe } from 'vitest';
import type { Config, UserConfig } from '../config';
import {
	getSourceDirPaths,
	getSourceFilePaths,
	getOutputDirPaths,
	isFrontmatterFieldIncluded,
	isHtmlElementIncluded,
	isHtmlElementAttributeIncluded,
	isJsonPropertyIncluded,
	isJsxComponentIncluded,
	isJsxComponentAttributeIncluded,
	isMarkdownNodeIncluded,
	resolveConfig
} from '../config';

const baseConfig: UserConfig = {
	sourceLanguage: 'en',
	outputLanguages: ['zh'],
	directories: [
		['docs', 'i18n/$langcode$/docs'],
		['blog', 'i18n/$langcode$/blog']
	],
	cwd: np.resolve(process.cwd(), '../../example')
};

describe('resolve paths', (test) => {
	const config: Config = resolveConfig(baseConfig);

	test('resolve source and output directories absolute paths', ({ expect }) => {
		const sourceDirPaths = getSourceDirPaths(config);
		const outputDirPaths = getOutputDirPaths(config);

		expect(sourceDirPaths).toMatchSnapshot();
		expect(outputDirPaths).toMatchSnapshot();
	});

	test('resolve source file absolute paths', async ({ expect }) => {
		const sourceFilePaths = await getSourceFilePaths(config);

		expect(sourceFilePaths).toMatchSnapshot();
	});
});

describe('resolve paths with files include and exclude patterns', (test) => {
	const config: Config = resolveConfig({
		...baseConfig,
		files: {
			include: ['**/blog/**/*'],
			exclude: ['**/blog/*-welcome/**/*']
		}
	});

	test('resolve source file absolute paths', async ({ expect }) => {
		const sourceFilePaths = await getSourceFilePaths(config);

		expect(sourceFilePaths).toMatchSnapshot();
	});
});

describe('default configurations', (test) => {
	const config: Config = resolveConfig(baseConfig);

	test('frontmatter fields', ({ expect }) => {
		expect(isFrontmatterFieldIncluded(config, 'title')).toBe(false);
		expect(isFrontmatterFieldIncluded(config, 'description')).toBe(false);
	});

	test('markdown nodes', ({ expect }) => {
		expect(isMarkdownNodeIncluded(config, 'code')).toBe(false);
		expect(isMarkdownNodeIncluded(config, 'blockquote')).toBe(true);
		expect(isMarkdownNodeIncluded(config, 'heading')).toBe(true);
	});

	test('html elements', ({ expect }) => {
		expect(isHtmlElementIncluded(config, 'a')).toBe(true);
		expect(isHtmlElementIncluded(config, 'div')).toBe(true);
	});

	test('html element attributes', ({ expect }) => {
		expect(isHtmlElementAttributeIncluded(config, 'div', 'title')).toBe(true);
		expect(isHtmlElementAttributeIncluded(config, 'div', 'id')).toBe(false);
	});

	test('jsx components', ({ expect }) => {
		expect(isJsxComponentIncluded(config, 'Card')).toBe(true);
		expect(isJsxComponentIncluded(config, 'Warning')).toBe(true);
	});

	test('jsx component attributes', ({ expect }) => {
		expect(isJsxComponentAttributeIncluded(config, 'Card', 'icon')).toBe(false);
		expect(isJsxComponentAttributeIncluded(config, 'Warning', 'title')).toBe(false);
	});

	test('json properties', ({ expect }) => {
		expect(isJsonPropertyIncluded(config, 'author')).toBe(false);
		expect(isJsonPropertyIncluded(config, 'title')).toBe(false);
	});
});

describe.skip('custom configurations', (test) => {
	const config: Config = resolveConfig({
		...baseConfig,
		frontmatterFields: { include: [], exclude: [] },
		markdownNodes: {
			include: [],
			exclude: []
		},
		htmlElements: {
			include: {},
			exclude: []
		},
		jsxComponents: {
			include: {},
			exclude: []
		},
		jsonProperties: {
			include: [],
			exclude: []
		}
	});

	test('frontmatter fields', () => {});
	test('markdown nodes', () => {});
	test('html elements', () => {});
	test('jsx components', () => {});
	test('json properties', () => {});
});
