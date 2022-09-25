import np from 'node:path';
import type { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';
import fg from 'fast-glob';
import type { MdNodeType } from './ast/mdast.js';
import type { Database } from './database.js';
import { isBoolean } from './utils.js';

export interface ConfigBase {
	/**
	 * Source's language code. Based on DeepL supported languages.
	 */
	sourceLanguage: SourceLanguageCode;
	/**
	 * Output's languages code. Based on DeepL supported languages.
	 */
	outputLanguages: TargetLanguageCode[];
	/**
	 * Sources and ouputs directories pairs. $langcode$ variable
	 * is provided to dynamically define directory.
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
	 * By default, all .md, .mdx, .json, and .yaml|.yml files inside
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
	 * Markdown node types to include or exclude based on MDAST. Defaults to exclude `code` and `link`.
	 */
	markdownNodes: {
		default: boolean;
		include: MdNodeType[];
		exclude: MdNodeType[];
	};
	/**
	 * HTML elements to include and exlcude, down to the level of attributes
	 * and children. Include all HTML elements text content
	 * and some global attributes such as title and placeholder.
	 */
	htmlElements: {
		include: Partial<{ [Tag in HtmlTag]: { children: boolean; attributes: string[] } }>;
		exclude: HtmlTag[];
	};
	/**
	 * JSX components to include and exclude, down to the level of attributes
	 * and children. Include all JSX components text children
	 * and exclude all attributes by default.
	 *
	 * Support array, object, and jsx attribute value. For object and array value,
	 * you can specify the access path starting with the attribute name
	 * e.g. `items.description` to translate `items={[{description: "..."}]}.
	 */
	jsxComponents: {
		default: boolean;
		include: { [Name: string]: { children: boolean; attributes: string[] } };
		exclude: string[];
	};
	/**
	 * JSON or YAML file properties to include and exclude.
	 * Exclude all properties by default.
	 */
	jsonOrYamlProperties: {
		include: (string | number | symbol)[];
		exclude: (string | number | symbol)[];
	};
}

export interface UserConfig extends ConfigBase {
	/**
	 * Override current working directory, defaults to `process.cwd()`.
	 */
	cwd?: string;
	/**
	 * By default, all .md, .mdx, .json, and .yaml|.yml files inside
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
	 * Markdown node types to include or exclude based on MDAST. Defaults to exclude `code` and `link`.
	 */
	markdownNodes?: {
		default?: boolean;
		include?: MdNodeType[];
		exclude?: MdNodeType[];
	};
	/**
	 * HTML elements to include and exlcude, down to the level of attributes
	 * and children. Include all HTML elements text content
	 * and some global attributes such as title and placeholder.
	 */
	htmlElements?: {
		default?: boolean;
		include?: Partial<{ [Tag in HtmlTag]: { children: boolean; attributes: string[] } }>;
		exclude?: HtmlTag[];
	};
	/**
	 * JSX components to include and exclude, down to the level of attributes
	 * and children. Include all JSX components text children
	 * and exclude all attributes by default.
	 *
	 * Support array, object, and jsx attribute value. For object and array value,
	 * you can specify the access path starting with the attribute name
	 * e.g. `items.description` to translate `items={[{description: "..."}]}.
	 */
	jsxComponents?: {
		default?: boolean;
		include?: { [Name: string]: { children: boolean; attributes: string[] } };
		exclude?: string[];
	};
	/**
	 * JSON or YAML file properties to include and exclude.
	 * Exclude all properties by default.
	 */
	jsonOrYamlProperties?: {
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
	jsonOrYamlProperties
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
			: { default: true, include: [], exclude: ['code', 'link'] },
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
		jsonOrYamlProperties: jsonOrYamlProperties
			? { include: jsonOrYamlProperties.include ?? [], exclude: jsonOrYamlProperties.exclude ?? [] }
			: { include: [], exclude: [] }
	};
}

export function getSourceDirPaths(config: Config): string[] {
	return config.directories.map((pair) => {
		const path = pair[0];

		if (path.startsWith('/')) return path;

		return np.join(config.cwd, path);
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
): Promise<
	Record<'md' | 'json' | 'yaml' | 'others', { sourceFilePath: string; outputFilePath: string }[]>
> {
	// file paths under source directories
	const paths: Record<
		'md' | 'json' | 'yaml' | 'others',
		{ sourceFilePath: string; outputFilePath: string }[]
	> = {
		md: [],
		json: [],
		yaml: [],
		others: []
	};

	const sourceDirPaths = getSourceDirPaths(config);
	const outputDirPaths = getOutputDirPaths(config);

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

	for (const [index, sourceDirPath] of sourceDirPaths.entries()) {
		const resolvedSourceDirPath = sourceDirPath.replace(/\$langcode\$/, config.sourceLanguage);

		const flatPaths = (
			await fg('**/*.*', {
				absolute: true,
				cwd: resolvedSourceDirPath
			})
		).filter(
			(path) =>
				!excludedFilePaths.includes(path) &&
				(includedFilePaths === true || includedFilePaths.includes(path))
		);

		for (const path of flatPaths) {
			const filePaths = {
				sourceFilePath: path,
				outputFilePath: np.join(outputDirPaths[index], path.slice(resolvedSourceDirPath.length))
			};

			if (path.endsWith('.md') || path.endsWith('.mdx')) {
				paths.md.push(filePaths);
				continue;
			}

			if (path.endsWith('.json')) {
				paths.json.push(filePaths);
				continue;
			}

			if (path.endsWith('.yaml') || path.endsWith('.yml')) {
				paths.yaml.push(filePaths);
				continue;
			}

			paths.others.push(filePaths);
		}
	}

	return paths;
}

export function isFrontmatterFieldIncluded({
	field,
	config
}: {
	field: string;
	config: Config;
}): boolean {
	return (
		!config.frontmatterFields.exclude.includes(field) &&
		config.frontmatterFields.include.includes(field)
	);
}

export function isMarkdownNodeIncluded({
	type,
	config
}: {
	type: MdNodeType;
	config: Config;
}): boolean {
	return (
		!config.markdownNodes.exclude.includes(type) &&
		(config.markdownNodes.default || config.markdownNodes.include.includes(type))
	);
}

export function isHtmlElementIncluded({ tag, config }: { tag: HtmlTag; config: Config }): boolean {
	return (
		!config.htmlElements.exclude.includes(tag) &&
		Object.keys(config.htmlElements.include).includes(tag)
	);
}

export function isHtmlElementAttributeIncluded({
	tag,
	attribute,
	config
}: {
	tag: HtmlTag;
	attribute: string;
	config: Config;
}): boolean {
	return (
		isHtmlElementIncluded({ tag, config }) &&
		config.htmlElements.include[tag]!.attributes.includes(attribute)
	);
}

export function isHtmlElementChildrenIncluded({
	tag,
	config
}: {
	tag: HtmlTag;
	config: Config;
}): boolean {
	return isHtmlElementIncluded({ tag, config }) && config.htmlElements.include[tag]!.children;
}

export function isJsxComponentIncluded({
	name,
	config
}: {
	name: string;
	config: Config;
}): boolean {
	return (
		!config.jsxComponents.exclude.includes(name) &&
		(config.jsxComponents.default || Object.keys(config.jsxComponents.include).includes(name))
	);
}

export function isJsxComponentAttributeIncluded({
	name,
	attribute,
	config
}: {
	name: string;
	attribute: string;
	config: Config;
}): boolean {
	return (
		!config.jsxComponents.exclude.includes(name) &&
		Object.keys(config.jsxComponents.include).includes(name) &&
		config.jsxComponents.include[name].attributes.includes(attribute)
	);
}

export function isJsxComponentChildrenIncluded({
	name,
	config
}: {
	name: string;
	config: Config;
}): boolean {
	return (
		!config.jsxComponents.exclude.includes(name) &&
		((Object.keys(config.jsxComponents.include).includes(name) &&
			config.jsxComponents.include[name].children) ||
			(!Object.keys(config.jsxComponents.include).includes(name) && config.jsxComponents.default))
	);
}

export function isJsonOrYamlPropertyIncluded({
	property,
	config
}: {
	config: Config;
	property: string | number | symbol;
}): boolean {
	return (
		!config.jsonOrYamlProperties.exclude.includes(property) &&
		config.jsonOrYamlProperties.include.includes(property)
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
