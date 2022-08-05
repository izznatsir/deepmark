export function isEmptyArray(array: any[]): boolean {
	return array.length == 0;
}

export function isEmptyString(string: string): boolean {
	return string.length == 0;
}

export function isArray(value: unknown): value is any[] {
	return Array.isArray(value);
}

export function isObject(value: unknown): value is Record<any, any> {
	return isArray(value) ? false : typeof value == 'object' ? true : false;
}

export function isString(value: unknown): value is string {
	return typeof value === 'string';
}
