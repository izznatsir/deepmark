import type { Config, Context } from '../types/index.js';

import { test } from 'vitest';
import { create_context } from '../utilities/index.js';
import { translate } from '../features/index.js';
import type { TargetLanguageCode } from 'deepl-node';

const config: Config = {
	output_languages: ['ja', 'zh'],
	source_language: 'en',
	directories: {
		sources: [],
		outputs: []
	},
	components_attributes: {},
	frontmatter: [],
	ignore_components: [],
	ignore_nodes: []
};

const context: Context = create_context();

test.skip('HTML in between sentence.', async ({ expect }) => {
	const strings: string[] = [
		'<p><b>Frontend web applications</b> that read and write IFC files and display 3D without relying on server communication can be created using <b>vanilla JavaScript</b>.</p>',
		'<p>Frontend web applications that read and write IFC files and display 3D without relying on server communication can be created using vanilla JavaScript.</p>'
	];
	const translations = await translate(strings, config, context);
	const expected: { [Language in TargetLanguageCode]?: string[] } = {
		ja: [
			'<p>サーバ通信に依存せずにIFCファイルを読み書きし、3D表示を行う<b>フロントエンドのWebアプリケーションを</b> <b>バニラJavaScriptで</b>作成することが可能です。</p>',
			'<p>サーバ通信に依存せずにIFCファイルを読み書きし、3D表示を行うフロントエンドのWebアプリケーションをバニラJavaScriptで作成することが可能です。</p>'
		],
		zh: [
			'<p>可以使用<b>vanilla JavaScript</b>创建<b>前端Web应用程序</b>，这些应用程序可以读写IFC文件并显示3D，而不依赖服务器通信。</p>',
			'<p>可以使用vanilla JavaScript创建前端Web应用程序，这些应用程序可以读写IFC文件并显示3D，而不依赖服务器通信。</p>'
		]
	};

	expect(translations).toEqual(expected);
});
