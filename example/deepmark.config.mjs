/** @type {import("deepmark").UserConfig} */
export default {
	sourceLanguage: 'en',
	outputLanguages: ['zh', 'ja'],
	directories: [
		['i18n/$langcode$', 'i18n/$langcode$'],
		['docs', 'i18n/$langcode$/docusaurus-plugin-content-docs/current'],
		['blog', 'i18n/$langcode$/docusaurus-plugin-content-blog']
	],
	jsonOrYamlProperties: {
		include: ['message', 'description']
	}
};
