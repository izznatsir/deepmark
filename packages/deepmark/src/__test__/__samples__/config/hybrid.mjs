import base from './base.mjs';

/** @type {import("../../../config").UserConfig} */
export default {
	...base,
	files: {
		include: ['docs/intro.md', 'docs/tutorial-basics/markdown-features.mdx', 'i18n/en/code.json']
	},
	jsonOrYamlProperties: {
		include: ['message', 'description']
	}
};
