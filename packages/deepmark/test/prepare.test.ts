import { test } from 'vitest';
import { get_markdown } from '$utils';
import { prepare } from '../src/features/prepare.js';

test('Remove empty flow expression.', ({ expect }) => {
	const markdowns = [
		{
			source:
				"{' '}\n<IfcCard icon=\"✨\" title=\"Three.js, geometry and Typescript\">\n\tIf you are a Three.js developer, you can help us with{' '}\n\t<a href={'https://github.com/IFCjs/web-ifc-three'}>web-ifc-three</a>, which is{' '}\n\t<a href={'https://threejs.org/examples/webgl_loader_ifc.html'}>\n\t\tthe official Three.js IFC Loader\n\t</a>\n\t.\n</IfcCard>\n",
			expected:
				'<IfcCard icon="✨" title="Three.js, geometry and Typescript">\n  If you are a Three.js developer, you can help us with <a href={"https://github.com/IFCjs/web-ifc-three"}>web-ifc-three</a>, which is <a href={"https://threejs.org/examples/webgl_loader_ifc.html"}>the official Three.js IFC Loader</a>.\n</IfcCard>'
		}
	];

	for (const { source, expected } of markdowns) {
		const actual = get_markdown(prepare(source)).trim();
		expect(actual).toBe(expected);
	}
});

test('Remove line break in the midle of sentence and around attribute.', ({ expect }) => {
	const markdowns = [
		{
			source:
				'<p>\n\tThis is a paragraph with a break line in the midle. <a href="https://aye.com">Click here</a> this\n\tneed to be long for it to be wrapped by prettier.\n</p>',
			expected:
				'<p>\n  This is a paragraph with a break line in the midle. <a href="https://aye.com">Click here</a> this need to be long for it to be wrapped by prettier.\n</p>'
		},
		{
			source:
				'This is a paragraph with a break line in the midle. <a href="https://aye.com">Click here</a> this\n\tneed to be long for it to be wrapped by prettier.',
			expected:
				'This is a paragraph with a break line in the midle. <a href="https://aye.com">Click here</a> this need to be long for it to be wrapped by prettier.'
		},
		{
			source:
				'<IfcCard\n\ttitle="\nCan you afford IFC?"\n>\n\t💸 This is something only companies with several developers working full time on this could\n\tafford. It doesn\'t sound that open anymore, does it?\n</IfcCard>\n',
			expected:
				'<IfcCard title="Can you afford IFC?">\n  💸 This is something only companies with several developers working full time on this could afford. It doesn\'t sound that open anymore, does it?\n</IfcCard>'
		}
	];

	for (const { source, expected } of markdowns) {
		const actual = get_markdown(prepare(source)).trim();
		expect(actual).toBe(expected);
	}
});

test('Convert markdown markup to html.', ({ expect }) => {
	const markdowns = [
		{
			source:
				'Try the [live demo](https://ifcjs.github.io/web-ifc-viewer/example/index) with your IFC model and discover the power of IFC.js.',
			expected:
				'Try the <a href="https://ifcjs.github.io/web-ifc-viewer/example/index">live demo</a> with your IFC model and discover the power of IFC.js.'
		}
	];

	for (const { source, expected } of markdowns) {
		const actual = get_markdown(prepare(source)).trim();
		expect(actual).toBe(expected);
	}
});
