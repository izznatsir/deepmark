import type { SourceLanguageCode, TargetLanguageCode, Translator } from 'deepl-node';
import type { TranslationMemory } from '../utilities/index.js';

export * from './docusaurus.js';
export * from './estree.js';
export * from './mdast.js';
export * from './unist.js';

export type Config = Required<UserConfig>;

export interface UserConfig {
	// Two letter language code of original markdowns.
	source_language: SourceLanguageCode;
	// Two letter target language codes of the translation.
	output_languages: TargetLanguageCode[];
	/**
	 * Directories that contain sources and that will contain
	 * outputs of the translation. The source and output directory
	 * will be mathced by `index`. So, make sure the length of
	 * the array and the position of its directories are in match.
	 *
	 * Deepmark provide a path variable `%language%` that will
	 * be replaced by source language and output languages accordingly.
	 */
	directories: {
		sources: string | string[];
		outputs: string | string[];
	};
	/**
	 * JSX Components attributes that should be translated.
	 * Only translate `children` by default. `children` need
	 * to be listed if you customize the attribute list.
	 *
	 * You can provide an access path for object property.
	 * The access path can also bypass a wrapper array.
	 * 
	 * E.g. `items.content` will access: 
	 * ```js
	 * items={ { content } }
	 * 
	 * // or
	 * 
	 * items={ [ { content } ] }
	 * ```
	 */
	components_attributes?: {
		[Name: string]: string[];
	};
	/**
	 * Frontmatter fields to be translated, default to not include any field.
	 */
	frontmatter?: string[];
	/**
	 * JSX components that will not be translated.
	 */
	ignore_components?: string[];
	/**
	 * MDAST nodes to not translate, defaults to:
	 * ['code', 'comment', 'mdxFlowExpression', 'mdxjsEsm']
	 */
	ignore_nodes?: string[];
}

export interface Context {
	deepl: Translator;
	memory: TranslationMemory;
}

export interface CommandHandler {
	(...args: any[]): void | Promise<void>;
}
