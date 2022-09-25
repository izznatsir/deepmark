import base from './base.mjs';

/** @type {import("../../../config").UserConfig} */
export default {
	...base,
	jsonOrYamlProperties: {
		include: ['message', 'description']
	}
};
