export * from './estree.js';
export * from './mdast.js';
export * from './unist.js';

export type Config = Required<UserConfig>;

export interface UserConfig {
	/**
	 * Auth key for Deepl developer API. By default
	 * it will read DEEPL_AUTH_KEY environment variable.
	 */
	deepl_auth_key?: string;
	// Two letter language code of original markdowns.
	source_language: string;
	// Two letter target language codes of the translation.
	output_languages: string[];
	// Directories that contain sources and will contain outputs of every command.
	directories: {
		sources: string[];
		outputs: string[];
	};
	/**
	 * JSX Components and optionally their props that should be translated.
	 * Pass an empty array if you do not want to translate any props.
	 */
	components?: {
		[Name: string]: string[];
	};
	/**
	 * Frontmatter fields to be translated, default to not include any field.
	 */
	frontmatter?: string[];
	/**
	 * MDAST nodes to not translate, defaults to:
	 * ['code', 'comment', 'mdxFlowExpression', 'mdxjsEsm']
	 */
	ignore_nodes?: string[];
}

export interface CommandHandler {
	(...args: any[]): void | Promise<void>;
}
