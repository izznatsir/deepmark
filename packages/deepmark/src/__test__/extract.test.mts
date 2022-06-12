import type { Config } from '$types';

import fs from 'fs-extra';
import np from 'path';
import { test } from 'vitest';
import { extract_mdast_strings, prepare } from '$feats';

const config: Config = {
	output_languages: [],
	source_language: 'en',
	directories: {
		sources: [],
		outputs: []
	},
	components_attributes: {
		Tab: ['children', 'items.content']
	},
	frontmatter: ['title', 'author_title', 'tags'],
	ignore_components: ['Ignore'],
	ignore_nodes: ['code', 'mdxjsEsm']
};

test('Extract YAML frontmatter fields based on configuration.', async ({ expect }) => {
	const markdown_path = np.resolve(process.cwd(), 'test/samples/yaml.mdx');
	const markdown = await fs.readFile(markdown_path, { encoding: 'utf-8' });

	const root = prepare(markdown);
	const strings = extract_mdast_strings(root, config);

	const expected: string[] = [
		'Hello IFC.js!',
		'Open BIM has come to the browser to stay.',
		'industry',
		'community',
		'project'
	];

	expect(strings).toEqual(expected);
});

test('Ignore nodes base on configuration.', async ({ expect }) => {
	const markdown_path = np.resolve(process.cwd(), 'test/samples/ignore-nodes.mdx');
	const markdown = await fs.readFile(markdown_path, { encoding: 'utf-8' });

	const root = prepare(markdown);
	const strings = extract_mdast_strings(root, config);

	const expected: string[] = [
		'Hello IFC.js!',
		'Open BIM has come to the browser to stay.',
		'industry',
		'community',
		'project',
		"🧑 Our patreon system is super simple: you give <strong>$5/month</strong> to the project to help IFC.js keep growing. However, <strong>we don't believe that open source should depend on altruistic donations</strong>. For this reason, all patreons gain access to the following:",
		'We have BIM programming courses for all levels. Each course cost $100, but patreons can access them <a href="https://ifcjs.github.io/info/docs/Courses/Getting-started#for-patreons">at just $25</a>.'
	];

	expect(strings).toEqual(expected);
});

test('Extract JSX element attributes and children based on configuration.', async ({ expect }) => {
	const markdown_path = np.resolve(process.cwd(), 'test/samples/jsx.mdx');
	const markdown = await fs.readFile(markdown_path, { encoding: 'utf-8' });

	const root = prepare(markdown);
	const strings = extract_mdast_strings(root, config);

	const expected: string[] = [
		'<p>\n          <b>Frontend web applications</b> that read and write IFC files and display 3D without relying on server communication can be created using <b>vanilla JavaScript</b> or other tools such as <b>React, Vue, Angular, Svelte, etc</b>. That is, <i>with IFC.js we can turn any web browser into an open BIM app.</i>\n        </p>',
		'<p>\n          There are cases where the IFC file cannot be processed by the client. For example, a mobile device may not have the power to display several medium or large IFCs. In this case, it is possible to <b>use IFC.js on the server</b> via <a href="https://nodejs.org/en/">Node.js</a> and send the Three.js scene already prepared to the client.\n        </p>'
	];

	expect(strings).toEqual(expected);
});
