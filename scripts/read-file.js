import fs from 'fs/promises';
import np from 'path';

async function main() {
	const path = process.argv[2];

	if (!path) {
		console.error('You need to pass a file path as the argument.');
		process.exit(1);
	} else {
		try {
			const value = await fs.readFile(np.resolve(process.cwd(), path), { encoding: 'utf-8' });
			console.log(JSON.stringify(value));
		} catch (error) {
			console.error(error);
			process.exit(1);
		}
	}
}

await main();
