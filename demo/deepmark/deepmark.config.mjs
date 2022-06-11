export default {
	source_language: 'en',
	output_languages: ['ja', 'zh'],
	directories: {
		sources: ['./docs', './blog', 'i18n/%language%'],
		outputs: [
			'./i18n/%language%/docusaurus-plugin-content-docs/current',
			'./i18n/%language%/docusaurus-plugin-content-blog',
			'i18n/%language%'
		]
	}
};
