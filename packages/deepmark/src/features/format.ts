import prettier from 'prettier';
import { prepare } from './prepare.js';
import { get_markdown } from '../utilities/index.js';

export async function format(
	markdown: string,
	config: { convert: boolean } = { convert: false }
): Promise<string> {
	const prepared = get_markdown(prepare(markdown, config));

	const prettier_options = await prettier.resolveConfig(process.cwd());
	const formatted = prettier.format(prepared, {
		parser: 'mdx',
		...(prettier_options ? prettier_options : {})
	});

	return formatted;
}
