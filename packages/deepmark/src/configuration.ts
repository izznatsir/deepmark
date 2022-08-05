import type { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';

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
	memory: TranslationMemory;
}
