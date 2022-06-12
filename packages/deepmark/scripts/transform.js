import { transform } from 'esbuild';
import fg from 'fast-glob';
import fs from 'fs-extra';
import np from 'path';

async function main() {
	const paths = (await fg('./src/**/*.mts'))
		.filter((path) => !path.includes('__test__') && !path.includes('/types/'))
		.map((path) => np.resolve(process.cwd(), path));

	for (const path of paths) {
		const input = await fs.readFile(path, { encoding: 'utf-8' });
		const output = await transform(input, {
			format: 'esm',
			loader: 'ts',
			target: 'es2021'
		});

		await fs.outputFile(path.replace('/src/', '/dist/').replace(/mts$/, 'mjs'), output.code);
	}
}

await main();
