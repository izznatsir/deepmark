import type { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';
import type { TranslationMemory } from '../utilities/index.js';

export * from './docusaurus.js';
export * from './estree.js';
export * from './mdast.js';
export * from './unist.js';

export type Config = {
	sourceLanguage: SourceLanguageCode;
	outputLanguages: TargetLanguageCode[];
	directories: {
		sources: string | string[];
		outputs: string | string[];
	};
	include: ConfigFilter;
	exclude: ConfigFilter;
};

export interface UserConfig {
	// Two letter language code of original markdowns.
	sourceLanguage: SourceLanguageCode;
	// Two letter target language codes of the translation.
	outputLanguages: TargetLanguageCode[];
	/**
	 * Directories that contain sources and that will contain
	 *
	 * Deepmark provide a path variable `%language%` that will
	 * be replaced by source language and output languages accordingly.
	 */
	directories: {
		sources: string | string[];
		outputs: string | string[];
	};
	include?: UserConfigFilter;
	exclude?: UserConfigFilter;
}

export interface ConfigFilter {
	sources: string[];
	frontmatterFields: string[];
	elements: {
		jsx: string[];
		jsxAttributes: { [Element: string]: string[] };
		markdown: string[];
	};
}

export interface UserConfigFilter {
	sources?: string[];
	frontmatterFields?: string[];
	elements?: {
		jsx?: string[];
		jsxAttributes?: { [Element: string]: string[] };
		markdown?: string[];
	};
}

export interface Context {
	deepl?: Translator;
	memory: TranslationMemory;
}

export interface CommandHandler {
	(...args: any[]): void | Promise<void>;
}
