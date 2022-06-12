import { transform } from 'esbuild';
import fg from 'fast-glob';
import fs from 'fs-extra';
import np from 'path';

async function main() {
	const paths = (await fg('./src/**/*.ts'))
		.filter((path) => !path.includes('__test__') && !path.includes('/types/') && path !== './src/index.ts')
		.map((path) => np.resolve(process.cwd(), path));

	for (const path of paths) {
		const input = await fs.readFile(path, { encoding: 'utf-8' });
		const output = await transform(input, {
			format: 'esm',
			loader: 'ts',
			target: 'es2021'
		});

		const output_path =
			path === np.resolve(process.cwd(), 'src/cli.ts')
				? path.replace('/src/', '/dist/').replace(/\.ts$/, '.mjs')
				: path.replace('/src/', '/dist/').replace(/\.ts$/, '.js');

		await fs.outputFile(output_path, output.code);
	}
}

await main();
