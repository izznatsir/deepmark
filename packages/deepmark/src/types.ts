export interface Config {
	/**
	 * Auth key for Deepl developer API. By default
	 * it will read DEEPL_AUTH_KEY environment variable.
	 */
	deeplAuthKey?: string;
	// Two letter language code of original markdowns.
	sourceLanguage: string;
	// Two letter target language codes of the translation.
	outputLanguages: string[];
	// Directories that contain sources and will contain outputs of every command.
	directories: {
		extraction: {
			/**
			 * The directory(s) pattern that contains original markdown files.
			 * The number of directories being provided must match the output field.
			 */
			source: string | string[];
			/**
			 * The directory(s) pattern where the strings JSON and AST files will be written to.
			 * The number of directories being provided must match the source field.
			 */
			output: string | string[];
		};
		generation: {
			/**
			 * The directory(s) pattern that contains translated AST files.
			 * The number of directories being provided must match the output field.
			 */
			source: string | string[];
			/**
			 * The directory(s) pattern where the translated markdown files will be written to.
			 * The number of directories being provided must match the source field.
			 */
			output: string | string[];
		};
		translation: {
			/**
			 * The directory(s) pattern that contains original strings JSON files.
			 * The number of directories being provided must match the output field.
			 */
			source: string | string[];
			/**
			 * The directory(s) where the translated AST files will be written to.
			 * The number of directories being provided must match the source field.
			 */
			output: string | string[];
		};
	};
	/**
	 * Frontmatter fields to be translated, default to not include any field.
	 */
	frontmatter: string[];
	/**
	 * JSX Components and optionally their props that should be translated.
	 * Pass an empty array if you do not want to translate any props.
	 */
	components: {
		[Name: string]: string[];
	};
}

export interface CommandHandler {
	(...args: any[]): void | Promise<void>;
}
