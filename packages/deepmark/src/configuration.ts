import type { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';
import type { Database } from './database.js';

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
	 * Sources and ouputs directories pair.
	 */
	directories: [string, string][];
}

export interface Config extends ConfigBase {
	include: ConfigInclusionFilter;
	exclude: ConfigExclusionFilter;
}

export interface UserConfig extends ConfigBase {
	include?: Partial<ConfigInclusionFilter>;
	exclude?: Partial<ConfigExclusionFilter>;
}

export interface ConfigFilter {
	/**
	 * Glob patterns of files.
	 */
	sources: string[];
	/**
	 * Frontmatter fields.
	 */
	frontmatter: string[];
	/**
	 * Markdown node types based on MDAST.
	 */
	markdown: string[];
}

export interface ConfigInclusionFilter extends ConfigFilter {
	/**
	 * HTML elements to include, down to the level of attributes and children.
	 */
	html: Record<HtmlTag, { children: boolean; attributes: string[] }>;
	/**
	 * JSX components to include, down to the level of attributes and children.
	 */
	jsx: Record<string, { children: boolean; attributes: string[] }>;
}

export interface ConfigExclusionFilter extends ConfigFilter {
	/**
	 * HTML elements to exclude.
	 */
	html: string[];
	/**
	 * JSX components to exclude.
	 */
	jsx: string[];
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

export type HtmlTag =
	| 'address'
	| 'article'
	| 'aside'
	| 'footer'
	| 'header'
	| 'h1'
	| 'h2'
	| 'h3'
	| 'h4'
	| 'h5'
	| 'h6'
	| 'main'
	| 'nav'
	| 'section'
	| 'blockquote'
	| 'dd'
	| 'div'
	| 'dl'
	| 'dt'
	| 'figcaption'
	| 'figure'
	| 'hr'
	| 'li'
	| 'menu'
	| 'ol'
	| 'p'
	| 'pre'
	| 'ul'
	| 'a'
	| 'abbr'
	| 'b'
	| 'bdi'
	| 'bdo'
	| 'br'
	| 'cite'
	| 'code'
	| 'data'
	| 'dfn'
	| 'em'
	| 'i'
	| 'kbd'
	| 'mark'
	| 'q'
	| 'rp'
	| 'rt'
	| 'ruby'
	| 's'
	| 'samp'
	| 'small'
	| 'span'
	| 'strong'
	| 'sub'
	| 'sup'
	| 'time'
	| 'u'
	| 'var'
	| 'wbr'
	| 'area'
	| 'audio'
	| 'img'
	| 'map'
	| 'track'
	| 'video'
	| 'embed'
	| 'iframe'
	| 'object'
	| 'picture'
	| 'portal'
	| 'source'
	| 'svg'
	| 'math'
	| 'canvas'
	| 'noscript'
	| 'script'
	| 'del'
	| 'ins'
	| 'caption'
	| 'col'
	| 'colgroup'
	| 'table'
	| 'tbody'
	| 'td'
	| 'tfoot'
	| 'th'
	| 'thead'
	| 'tr'
	| 'button'
	| 'datalist'
	| 'fieldset'
	| 'form'
	| 'input'
	| 'label'
	| 'legend'
	| 'meter'
	| 'optgroup'
	| 'option'
	| 'output'
	| 'progress'
	| 'select'
	| 'textarea'
	| 'details'
	| 'dialog'
	| 'summary'
	| 'slot'
	| 'template';
