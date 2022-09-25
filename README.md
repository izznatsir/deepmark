# Deepmark

Translate markdown files correctly with `mdast` and DeepL.

## Getting Started

1. Install `deepmark`:

```bash
# NPM
npm install -D deepmark

# PNPM
pnpm add -D deepmark

# Yarn
yarn add -D deepmark
```

2. Create a `deepmark.config.mjs` on your project root:

```js
// deepmark.config.mjs

/** @type {import("deepmark").UserConfig} */
export default {
	sourceLanguage: 'en',
	outputLanguages: ['zh', 'ja'],
	directories: [
		['i18n/$langcode$', 'i18n/$langcode$'],
		['docs', 'i18n/$langcode$/docs'],
		['blog', 'i18n/$langcode$/blog']
	]
};
```

3. Set `DEEPL_AUTH_KEY` environment variable containing DeepL developer auth key:

```bash
# If you're on Linux
export DEEPL_AUTH_KEY=your_auth_key
```

You can also use something like `dotenv` package. For CI and remote environment such as Github Actions and Gitpod, look into their setting page to set environment variables.

4. Set NPM scripts in your `package.json`:

```json
{
	"scripts": {
		"translate": "deepmark translate"
	}
}
```

```bash
# NPM
npm run translate

# PNPM
pnpm run translate

# Yarn
yarn translate
```

Notes:

> `deepmark` also supports translating JSON and YAML files.

## Limitations

1. It is not possible to add `mdast` plugins to the workflow.
2. Only support `.md` and `.mdx`. Other extended verisons of markdown such as Svelte extended `mdsvex` are not supported.

## Documentation

#### Translation modes:

```bash
deepmark translate --mode hybrid|offline|online
```

- `hybrid` (default): Look for translation from local translation memory first before using DeepL API.
- `offline`: Translate using the local translation memory only, passthrough if not found. This mode will not update the translation memory.
- `online`: Translate using DeepL API only. Will overwrite existing translation memory.

#### Configuration:

```ts
interface UserConfig {
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
```
