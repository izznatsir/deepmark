export function isArray(value: unknown): value is any[] {
	return Array.isArray(value);
}

export function isBoolean(value: unknown): value is boolean {
	return typeof value === 'boolean';
}

export function isEmptyArray(array: any[]): boolean {
	return array.length === 0;
}

export function isEmptyObject(object: Object): boolean {
	return Object.keys(object).length === 0;
}

export function isEmptyString(string: string): boolean {
	return string.length === 0;
}

export function isObject(value: unknown): value is Record<string | number | symbol, unknown> {
	return isArray(value) ? false : typeof value == 'object' ? true : false;
}

export function isString(value: unknown): value is string {
	return typeof value === 'string';
}
