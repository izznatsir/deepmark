import type { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';
import type { MdNodeType } from './ast/mdast.js';
import type { Database } from './database.js';

import { isEmptyArray, isEmptyObject } from './utils.js';

export interface ConfigBase {
	/**
	 * Source's language code.
	 */
	sourceLanguage: SourceLanguageCode;
	/**
	 * Output's languages code.
	 */
	outputLanguages: TargetLanguageCode[];
	/**
	 * Sources and ouputs directories pairs. $langcode$ variable
	 * is provided to dynamically define output directory.
	 *
	 * e.g. [ ["docs", "i18n/$langcode$/docs"], ["blog", "i18n/$langcode$/blog"] ]
	 */
	directories: [string, string][];
}

export interface Config extends ConfigBase {
	/**
	 * By default, all .md, .mdx, and .json files inside
	 * source directories will be included.
	 *
	 * Define glob patterns to filter what files to include or exclude.
	 * But, the end result is still restricted by file types (.md, .mdx, .json).
	 */
	files: {
		include: string[];
		exclude: string[];
	};
	/**
	 * Markdown node types to include or exclude based on MDAST.
	 */
	markdownNodes: {
		include: MdNodeType[];
		exclude: MdNodeType[];
	};
	/**
	 * Frontmatter fields.
	 */
	frontmatterFields: {
		include: string[];
		exclude: string[];
	};
	/**
	 * HTML elements to include, down to the level of attributes
	 * and children, or exclude.
	 */
	htmlElements: {
		include: Record<HtmlTag, { children: boolean; attributes: string[] }>;
		exclude: HtmlTag[];
	};
	/**
	 * JSX components to include, down to the level of attributes
	 * and children, or exclude.
	 */
	jsxComponents: {
		include: Record<string, { children: boolean; attributes: string[] }> | typeof $DEFAULT;
		exclude: string[];
	};
}

export interface UserConfig extends ConfigBase {
	/**
	 * By default, all .md, .mdx, and .json files inside
	 * source directories will be included.
	 *
	 * Define glob patterns to filter what files to include or exclude.
	 * But, the end result is still restricted by file types (.md, .mdx, .json).
	 */
	files?: {
		include?: string[];
		exclude?: string[];
	};
	/**
	 * Markdown node types to include or exclude based on MDAST.
	 */
	markdownNodes?: {
		include?: MdNodeType[];
		exclude?: MdNodeType[];
	};
	/**
	 * Frontmatter fields.
	 */
	frontmatterFields?: {
		include?: string[];
		exclude?: string[];
	};
	/**
	 * HTML elements to include, down to the level of attributes
	 * and children, or exclude.
	 */
	htmlElements?: {
		include?: Record<HtmlTag, { children: boolean; attributes: string[] }>;
		exclude?: HtmlTag[];
	};
	/**
	 * JSX components to include, down to the level of attributes
	 * and children, or exclude.
	 */
	jsxComponents?: {
		include?: Record<string, { children: boolean; attributes: string[] }>;
		exclude?: string[];
	};
}

export interface Context {
	/**
	 * Deepl translator instance, will be undefined if translation mode is set to offline.
	 */
	deepl?: Translator;
	/**
	 * Translation memory client.
	 */
	database: Database;
}

export type HtmlTag = keyof typeof DEFAULT_HTML_ELEMENTS;

export const DEFAULT_HTML_ELEMENTS = {
	html: { children: true, attributes: [] },
	base: { children: true, attributes: [] },
	link: { children: true, attributes: [] },
	meta: { children: true, attributes: [] },
	style: { children: true, attributes: [] },
	title: { children: true, attributes: [] },
	body: { children: true, attributes: [] },
	address: { children: true, attributes: [] },
	article: { children: true, attributes: [] },
	aside: { children: true, attributes: [] },
	footer: { children: true, attributes: [] },
	header: { children: true, attributes: [] },
	h1: { children: true, attributes: [] },
	h2: { children: true, attributes: [] },
	h3: { children: true, attributes: [] },
	h4: { children: true, attributes: [] },
	h5: { children: true, attributes: [] },
	h6: { children: true, attributes: [] },
	main: { children: true, attributes: [] },
	nav: { children: true, attributes: [] },
	section: { children: true, attributes: [] },
	blockquote: { children: true, attributes: [] },
	dd: { children: true, attributes: [] },
	div: { children: true, attributes: [] },
	dl: { children: true, attributes: [] },
	dt: { children: true, attributes: [] },
	figcaption: { children: true, attributes: [] },
	figure: { children: true, attributes: [] },
	hr: { children: true, attributes: [] },
	li: { children: true, attributes: [] },
	menu: { children: true, attributes: [] },
	ol: { children: true, attributes: [] },
	p: { children: true, attributes: [] },
	pre: { children: true, attributes: [] },
	ul: { children: true, attributes: [] },
	a: { children: true, attributes: [] },
	abbr: { children: true, attributes: [] },
	b: { children: true, attributes: [] },
	bdi: { children: true, attributes: [] },
	bdo: { children: true, attributes: [] },
	br: { children: true, attributes: [] },
	cite: { children: true, attributes: [] },
	code: { children: true, attributes: [] },
	data: { children: true, attributes: [] },
	dfn: { children: true, attributes: [] },
	em: { children: true, attributes: [] },
	i: { children: true, attributes: [] },
	kbd: { children: true, attributes: [] },
	mark: { children: true, attributes: [] },
	q: { children: true, attributes: [] },
	rp: { children: true, attributes: [] },
	rt: { children: true, attributes: [] },
	ruby: { children: true, attributes: [] },
	s: { children: true, attributes: [] },
	samp: { children: true, attributes: [] },
	small: { children: true, attributes: [] },
	span: { children: true, attributes: [] },
	strong: { children: true, attributes: [] },
	sub: { children: true, attributes: [] },
	sup: { children: true, attributes: [] },
	time: { children: true, attributes: [] },
	u: { children: true, attributes: [] },
	var: { children: true, attributes: [] },
	wbr: { children: true, attributes: [] },
	area: { children: true, attributes: [] },
	audio: { children: true, attributes: [] },
	img: { children: true, attributes: [] },
	map: { children: true, attributes: [] },
	track: { children: true, attributes: [] },
	video: { children: true, attributes: [] },
	embed: { children: true, attributes: [] },
	iframe: { children: true, attributes: [] },
	object: { children: true, attributes: [] },
	picture: { children: true, attributes: [] },
	portal: { children: true, attributes: [] },
	source: { children: true, attributes: [] },
	svg: { children: true, attributes: [] },
	math: { children: true, attributes: [] },
	canvas: { children: true, attributes: [] },
	noscript: { children: true, attributes: [] },
	script: { children: true, attributes: [] },
	del: { children: true, attributes: [] },
	ins: { children: true, attributes: [] },
	caption: { children: true, attributes: [] },
	col: { children: true, attributes: [] },
	colgroup: { children: true, attributes: [] },
	table: { children: true, attributes: [] },
	tbody: { children: true, attributes: [] },
	td: { children: true, attributes: [] },
	tfoot: { children: true, attributes: [] },
	th: { children: true, attributes: [] },
	thead: { children: true, attributes: [] },
	tr: { children: true, attributes: [] },
	button: { children: true, attributes: [] },
	datalist: { children: true, attributes: [] },
	fieldset: { children: true, attributes: [] },
	form: { children: true, attributes: [] },
	input: { children: true, attributes: [] },
	label: { children: true, attributes: [] },
	legend: { children: true, attributes: [] },
	meter: { children: true, attributes: [] },
	optgroup: { children: true, attributes: [] },
	option: { children: true, attributes: [] },
	output: { children: true, attributes: [] },
	progress: { children: true, attributes: [] },
	select: { children: true, attributes: [] },
	textarea: { children: true, attributes: [] },
	details: { children: true, attributes: [] },
	dialog: { children: true, attributes: [] },
	summary: { children: true, attributes: [] },
	slot: { children: true, attributes: [] },
	template: { children: true, attributes: [] }
};

export const $DEFAULT = Symbol();

export const HTML_TAGS = Object.keys(DEFAULT_HTML_ELEMENTS);

export function isDefault(value: unknown): value is typeof $DEFAULT {
	return value === $DEFAULT;
}

export function isHtmlTag(name: string): name is HtmlTag {
	return HTML_TAGS.includes(name);
}

export function resolveConfig({
	sourceLanguage,
	outputLanguages,
	directories,
	files,
	markdownNodes,
	frontmatterFields,
	htmlElements,
	jsxComponents
}: UserConfig): Config {
	return {
		sourceLanguage,
		outputLanguages,
		directories,
		files: files
			? {
					include: files.include ?? [],
					exclude: files.exclude ?? []
			  }
			: { include: [], exclude: [] },
		markdownNodes: markdownNodes
			? {
					include:
						markdownNodes.include && !isEmptyArray(markdownNodes.include)
							? markdownNodes.include
							: [],
					exclude:
						markdownNodes.exclude && !isEmptyArray(markdownNodes.exclude)
							? markdownNodes.exclude
							: []
			  }
			: { include: [], exclude: [] },
		frontmatterFields: frontmatterFields
			? {
					include:
						frontmatterFields.include && !isEmptyArray(frontmatterFields.include)
							? frontmatterFields.include
							: [],
					exclude:
						frontmatterFields.exclude && !isEmptyArray(frontmatterFields.exclude)
							? frontmatterFields.exclude
							: []
			  }
			: { include: [], exclude: [] },

		htmlElements: htmlElements
			? {
					include:
						htmlElements.include && !isEmptyObject(htmlElements.include)
							? htmlElements.include
							: DEFAULT_HTML_ELEMENTS,
					exclude:
						htmlElements.exclude && !isEmptyArray(htmlElements.exclude) ? htmlElements.exclude : []
			  }
			: { include: DEFAULT_HTML_ELEMENTS, exclude: [] },
		jsxComponents: jsxComponents
			? {
					include:
						jsxComponents.include && !isEmptyObject(jsxComponents.include)
							? jsxComponents.include
							: $DEFAULT,
					exclude:
						jsxComponents.exclude && !isEmptyArray(jsxComponents.exclude)
							? jsxComponents.exclude
							: []
			  }
			: { include: $DEFAULT, exclude: [] }
	};
}

export function getSourceDirPaths(config: Config): string[] {
	return [];
}

export function getOutputDirPaths(config: Config): string[] {
	return [];
}

export function getSourceFilePaths(config: Config): string[] {
	return [];
}
