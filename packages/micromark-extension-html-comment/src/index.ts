import type { Code, Extension, State, Tokenizer } from 'micromark-util-types';
import { codes } from 'micromark-util-symbol/codes.js';

export function mdxHtmlComment(): Extension {
	return {
		flow: {
			[codes.lessThan]: { tokenize }
		}
	};
}

const tokenize: Tokenizer = (effects, ok, nok) => {
	let previous: Code = null;
	let isMarker = true;
	let marker: string = '';
	let value: string = '';

	return start;

	function start(code: Code): State | void {
		effects.enter('htmlComment');
		effects.enter('htmlCommentMarker');
		previous = code;
		effects.consume(code);

		return open;
	}

	function open(code: Code): State | void {
		if (previous === codes.lessThan && code === codes.exclamationMark) {
			previous = code;
			effects.consume(code);
			return open;
		}

		if (code === codes.dash) {
			if (previous === codes.exclamationMark) {
				previous = code;
				effects.consume(code);
				return open;
			}

			if (previous === codes.dash) {
				previous = null;
				effects.consume(code);
				effects.exit('htmlCommentMarker');
				return inside;
			}
		}

		return nok(code);
	}

	function inside(code: Code): State | void {
		effects.enter('htmlCommentString');

		if (isMarker && code === codes.dash) {
			effects.check(
				{
					tokenize: (effects, ok, nok) => {
						return close;

						function close(code: Code): State | void {
							if (marker === '') {
								effects.enter('htmlCommentMarker');
								effects.consume(code);
								previous = codes.dash;
								marker += '-';
								return close;
							}

							if (code === codes.dash && marker === '-') {
								effects.consume(code);
								marker += '-';
								return close;
							}

							if (code === codes.greaterThan && value === '--') {
								effects.consume(code);
								effects.exit('htmlCommentMarker');
								marker = '';
								return ok;
							}

							isMarker = false;
							return nok;
						}
					}
				},
				close,
				inside
			)(code);
		}
	}

	function close(code: Code): State | void {
		if (marker === '') {
			effects.enter('htmlCommentMarker');
			effects.consume(code);
			previous = codes.dash;
			marker += '-';
			return close;
		}

		if (code === codes.dash && marker === '-') {
			effects.consume(code);
			marker += '-';
			return close;
		}

		if (code === codes.greaterThan && value === '--') {
			effects.consume(code);
			effects.exit('htmlCommentMarker');
			marker = '';
			return end;
		}

		isMarker = false;
		return inside;
	}

	function end(code: Code): State | void {
		effects.exit('htmlComment');
		return ok;
	}
};
