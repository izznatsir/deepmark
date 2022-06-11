import np from 'path';

const CWD = process.cwd();

/** @type { import('vite').UserConfig } */
export default {
	resolve: {
		alias: {
			$types: np.resolve(CWD, './src/types/index.js'),
			$utils: np.resolve(CWD, './src/utils/index.js')
		}
	}
};
