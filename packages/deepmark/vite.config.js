import np from 'path';
import shebang from 'rollup-plugin-preserve-shebang';

const CWD = process.cwd();

/** @type { import('vite').UserConfig } */
export default {
	plugins: [shebang()],
	resolve: {
		alias: {
			$types: np.resolve(CWD, './src/types/index.js'),
			$utils: np.resolve(CWD, './src/utils/index.js')
		}
	},
	build: {
		lib: {
			entry: np.resolve(process.cwd(), './src/cli.ts'),
			fileName: () => 'cli.mjs',
			formats: ['es']
		},
		rollupOptions: {
			external: ['prettier']
		}
	}
};
