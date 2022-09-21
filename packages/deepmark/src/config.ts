import np from 'node:path';
import type { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';
import fg from 'fast-glob';
import type { MdNodeType } from './ast/mdast.js';
import type { Database } from './database.js';
import { isBoolean } from './utils.js';

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
	 * Override current working directory, defaults to `process.cwd()`.
	 */
	cwd: string;
	/**
	 * By default, all .md, .mdx, and .json files inside
	 * source directories will be included.
	 *
	 * Define glob patterns to filter what files to include or exclude.
	 * But, the end result is still restricted by file types (.md, .mdx, .json).
	 */
	files: {
		include?: string[];
		exclude: string[];
	};
	/**
	 * Frontmatter fields.
	 */
	frontmatterFields: {
		include: string[];
		exclude: string[];
	};
	/**
	 * Markdown node types to include or exclude based on MDAST.
	 */
	markdownNodes: {
		default: boolean;
		include: MdNodeType[];
		exclude: MdNodeType[];
	};
	/**
	 * HTML elements to include, down to the level of attributes
	 * and children, and exclude. Include all HTML elements inner text
	 * and some global attributes such as title and placeholder.
	 */
	htmlElements: {
		include: Partial<{ [Tag in HtmlTag]: { children: boolean; attributes: string[] } }>;
		exclude: HtmlTag[];
	};
	/**
	 * JSX components to include, down to the level of attributes
	 * and children, and exclude. Include all JSX components inner text
	 * and exclude all attributes by default.
	 */
	jsxComponents: {
		default: boolean;
		include: { [Name: string]: { children: boolean; attributes: string[] } };
		exclude: string[];
	};
	/**
	 * JSON file properties to include and exclude.
	 * Includes all properties with string values by default.
	 */
	jsonProperties: {
		include: string[];
		exclude: string[];
	};
}

export interface UserConfig extends ConfigBase {
	/**
	 * Override current working directory, defaults to `process.cwd()`.
	 */
	cwd?: string;
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
	 * Frontmatter fields.
	 */
	frontmatterFields?: {
		include?: string[];
		exclude?: string[];
	};
	/**
	 * Markdown node types to include or exclude based on MDAST.
	 */
	markdownNodes?: {
		default?: boolean;
		include?: MdNodeType[];
		exclude?: MdNodeType[];
	};
	/**
	 * HTML elements to include, down to the level of attributes
	 * and children, and exclude. Include all HTML elements inner text
	 * and some global attributes such as title and placeholder.
	 */
	htmlElements?: {
		default?: boolean;
		include?: Partial<{ [Tag in HtmlTag]: { children: boolean; attributes: string[] } }>;
		exclude?: HtmlTag[];
	};
	/**
	 * JSX components to include, down to the level of attributes
	 * and children, and exclude. Include all JSX components inner text
	 * and exclude all attributes by default.
	 */
	jsxComponents?: {
		default?: boolean;
		include?: { [Name: string]: { children: boolean; attributes: string[] } };
		exclude?: string[];
	};
	/**
	 * JSON file properties to include and exclude.
	 * Includes all properties with string values by default.
	 */
	jsonProperties?: {
		include?: string[];
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

export type HtmlElementsConfig = { [Tag in HtmlTag]: { children: boolean; attributes: string[] } };

export const HTML_ELEMENTS_CONFIG: HtmlElementsConfig = getHtmlElementsConfig();

function getHtmlElementsConfig(): HtmlElementsConfig {
	const includeChildren: HtmlTag[] = [
		'a',
		'abbr',
		'address',
		'article',
		'aside',
		'audio',
		'b',
		'bdi',
		'bdo',
		'blockquote',
		'body',
		'button',
		'canvas',
		'caption',
		'cite',
		'col',
		'colgroup',
		'data',
		'datalist',
		'dd',
		'del',
		'details',
		'dfn',
		'dialog',
		'div',
		'dl',
		'dt',
		'em',
		'fieldset',
		'figcaption',
		'figure',
		'footer',
		'form',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'header',
		'html',
		'i',
		'input',
		'ins',
		'label',
		'legend',
		'li',
		'main',
		'mark',
		'meter',
		'nav',
		'ol',
		'optgroup',
		'output',
		'p',
		'progress',
		'q',
		'rp',
		's',
		'samp',
		'section',
		'select',
		'small',
		'span',
		'strong',
		'sub',
		'summary',
		'sup',
		'table',
		'tbody',
		'td',
		'template',
		'text-area',
		'tfoot',
		'th',
		'thead',
		'time',
		'title',
		'tr',
		'track',
		'u',
		'ul'
	];

	const excludeChildren: HtmlTag[] = [
		'area',
		'base',
		'br',
		'code',
		'embed',
		'head',
		'hr',
		'iframe',
		'img',
		'kbd',
		'link',
		'meta',
		'noscript',
		'object',
		'param',
		'picture',
		'pre',
		'rt',
		'ruby',
		'script',
		'source',
		'style',
		'svg',
		'var',
		'video',
		'qbr'
	];

	const config: Partial<HtmlElementsConfig> = {};

	for (const tag of includeChildren) {
		config[tag] = {
			children: true,
			attributes: ['title']
		};
	}

	for (const tag of excludeChildren) {
		config[tag] = {
			children: false,
			attributes: ['title']
		};
	}

	return config as HtmlElementsConfig;
}

export const HTML_TAGS = Object.keys(HTML_ELEMENTS_CONFIG) as HtmlTag[];

export function isHtmlTag(name: string): name is HtmlTag {
	return HTML_TAGS.includes(name as HtmlTag);
}

export function resolveConfig({
	sourceLanguage,
	outputLanguages,
	directories,
	cwd,
	files,
	markdownNodes,
	frontmatterFields,
	htmlElements,
	jsxComponents,
	jsonProperties
}: UserConfig): Config {
	return {
		sourceLanguage,
		outputLanguages,
		directories,
		cwd: cwd ? (cwd.startsWith('/') ? cwd : np.resolve(process.cwd(), cwd)) : process.cwd(),
		files: files
			? {
					include: files.include,
					exclude: files.exclude ?? []
			  }
			: { exclude: [] },
		markdownNodes: markdownNodes
			? {
					default: isBoolean(markdownNodes.default) ? markdownNodes.default : true,
					include: markdownNodes.include ?? [],
					exclude: markdownNodes.exclude ?? ['code']
			  }
			: { default: true, include: [], exclude: ['code'] },
		frontmatterFields: frontmatterFields
			? {
					include: frontmatterFields.include ?? [],
					exclude: frontmatterFields.exclude ?? []
			  }
			: { include: [], exclude: [] },

		htmlElements: htmlElements
			? {
					include: htmlElements.include
						? (isBoolean(htmlElements.default) && htmlElements.default) ||
						  htmlElements.default === undefined
							? { ...HTML_ELEMENTS_CONFIG, ...htmlElements.include }
							: htmlElements.include
						: isBoolean(htmlElements.default) && !htmlElements.default
						? {}
						: HTML_ELEMENTS_CONFIG,
					exclude: htmlElements.exclude ?? []
			  }
			: { include: HTML_ELEMENTS_CONFIG, exclude: [] },
		jsxComponents: jsxComponents
			? {
					default: isBoolean(jsxComponents.default) ? jsxComponents.default : true,
					include: jsxComponents.include ?? {},
					exclude: jsxComponents.exclude ?? []
			  }
			: { default: true, include: {}, exclude: [] },
		jsonProperties: jsonProperties
			? { include: jsonProperties.include ?? [], exclude: jsonProperties.exclude ?? [] }
			: { include: [], exclude: [] }
	};
}

export function getSourceDirPaths(config: Config): string[] {
	return config.directories.map((pair) => {
		const path = pair[0];

		if (path.startsWith('/')) return path;

		return np.resolve(config.cwd, path);
	});
}

export function getOutputDirPaths(config: Config): string[] {
	return config.directories.map((pair) => {
		const path = pair[1];

		if (path.startsWith('/')) return path;

		return np.join(config.cwd, path);
	});
}

export async function getSourceFilePaths(
	config: Config
): Promise<Record<'md' | 'mdx' | 'json' | 'yaml', string[]>> {
	// file paths under source directories
	const paths: Record<'md' | 'mdx' | 'json' | 'yaml' | 'others', string[]> = {
		md: [],
		mdx: [],
		json: [],
		yaml: [],
		others: []
	};

	const sourceDirPaths = getSourceDirPaths(config);
	const includedFilePaths =
		config.files.include === undefined
			? true
			: config.files.include.reduce<string[]>((paths, pattern) => {
					return [
						...paths,
						...fg.sync(pattern, {
							absolute: true,
							cwd: config.cwd
						})
					];
			  }, []);
	const excludedFilePaths = config.files.exclude.reduce<string[]>((paths, pattern) => {
		return [
			...paths,
			...fg.sync(pattern, {
				absolute: true,
				cwd: config.cwd
			})
		];
	}, []);

	for (const sourceDirPath of sourceDirPaths) {
		const flatPaths = (
			await fg('**/*.*', {
				absolute: true,
				cwd: sourceDirPath
			})
		).filter(
			(path) =>
				!excludedFilePaths.includes(path) &&
				(includedFilePaths === true || includedFilePaths.includes(path))
		);

		for (const path of flatPaths) {
			if (path.endsWith('.md')) {
				paths.md.push(path);
				continue;
			}

			if (path.endsWith('.mdx')) {
				paths.mdx.push(path);
				continue;
			}

			if (path.endsWith('.json')) {
				paths.json.push(path);
				continue;
			}

			if (path.endsWith('.yaml') || path.endsWith('.yml')) {
				paths.yaml.push(path);
				continue;
			}

			paths.others.push(path);
		}
	}

	return paths;
}

export function isFrontmatterFieldIncluded(config: Config, field: string): boolean {
	return (
		!config.frontmatterFields.exclude.includes(field) &&
		config.frontmatterFields.include.includes(field)
	);
}

export function isMarkdownNodeIncluded(config: Config, type: MdNodeType): boolean {
	return (
		!config.markdownNodes.exclude.includes(type) &&
		(config.markdownNodes.default || config.markdownNodes.include.includes(type))
	);
}

export function isHtmlElementIncluded(config: Config, tag: HtmlTag): boolean {
	return (
		!config.htmlElements.exclude.includes(tag) &&
		Object.keys(config.htmlElements.include).includes(tag)
	);
}

export function isHtmlElementAttributeIncluded(
	config: Config,
	tag: HtmlTag,
	attribute: string
): boolean {
	return (
		isHtmlElementIncluded(config, tag) &&
		config.htmlElements.include[tag]!.attributes.includes(attribute)
	);
}

export function isHtmlElementChildrenIncluded(config: Config, tag: HtmlTag): boolean {
	return isHtmlElementIncluded(config, tag) && config.htmlElements.include[tag]!.children;
}

export function isJsxComponentIncluded(config: Config, name: string): boolean {
	return (
		!config.jsxComponents.exclude.includes(name) &&
		(config.jsxComponents.default || Object.keys(config.jsxComponents.include).includes(name))
	);
}

export function isJsxComponentAttributeIncluded(
	config: Config,
	name: string,
	attribute: string
): boolean {
	return (
		!config.jsxComponents.exclude.includes(name) &&
		Object.keys(config.jsxComponents.include).includes(name) &&
		config.jsxComponents.include[name].attributes.includes(attribute)
	);
}

export function isJsxComponentChildrenIncluded(config: Config, name: string): boolean {
	return (
		!config.jsxComponents.exclude.includes(name) &&
		Object.keys(config.jsxComponents.include).includes(name) &&
		config.jsxComponents.include[name].children
	);
}

export function isJsonPropertyIncluded(config: Config, property: string): boolean {
	return (
		!config.jsonProperties.exclude.includes(property) &&
		config.jsonProperties.include.includes(property)
	);
}

export type HtmlTag =
	| 'a'
	| 'abbr'
	| 'address'
	| 'article'
	| 'aside'
	| 'audio'
	| 'b'
	| 'bdi'
	| 'bdo'
	| 'blockquote'
	| 'body'
	| 'button'
	| 'canvas'
	| 'caption'
	| 'cite'
	| 'col'
	| 'colgroup'
	| 'data'
	| 'datalist'
	| 'dd'
	| 'del'
	| 'details'
	| 'dfn'
	| 'dialog'
	| 'div'
	| 'dl'
	| 'dt'
	| 'em'
	| 'fieldset'
	| 'figcaption'
	| 'figure'
	| 'footer'
	| 'form'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'header'
	| 'html'
	| 'i'
	| 'input'
	| 'ins'
	| 'label'
	| 'legend'
	| 'li'
	| 'main'
	| 'mark'
	| 'meter'
	| 'nav'
	| 'ol'
	| 'optgroup'
	| 'output'
	| 'p'
	| 'progress'
	| 'q'
	| 'rp'
	| 's'
	| 'samp'
	| 'section'
	| 'select'
	| 'small'
	| 'span'
	| 'strong'
	| 'sub'
	| 'summary'
	| 'sup'
	| 'table'
	| 'tbody'
	| 'td'
	| 'template'
	| 'text-area'
	| 'tfoot'
	| 'th'
	| 'thead'
	| 'time'
	| 'title'
	| 'tr'
	| 'track'
	| 'u'
	| 'ul'
	| 'area'
	| 'base'
	| 'br'
	| 'code'
	| 'embed'
	| 'head'
	| 'hr'
	| 'iframe'
	| 'img'
	| 'kbd'
	| 'link'
	| 'meta'
	| 'noscript'
	| 'object'
	| 'param'
	| 'picture'
	| 'pre'
	| 'rt'
	| 'ruby'
	| 'script'
	| 'source'
	| 'style'
	| 'svg'
	| 'var'
	| 'video'
	| 'qbr';
