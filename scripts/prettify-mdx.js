import fs from 'fs/promises';
import np from 'path';
import prettier from 'prettier';

async function main() {
    const path = process.argv[2];
	const value = await fs.readFile(np.resolve(process.cwd(), path), { encoding: 'utf-8' });
	const result = prettier.format(value, {
        parser: 'mdx',
        printWidth: Infinity
    });

    console.log(result)
}

await main();
