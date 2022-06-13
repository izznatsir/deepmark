export function is_empty_array(array: any[]): boolean {
	return array.length == 0;
}

export function is_empty_string(string: string): boolean {
	return string.length == 0;
}

export function is_array(value: unknown): value is any[] {
	return Array.isArray(value);
}

export function is_object(value: unknown): value is Record<any, any> {
	return is_array(value) ? false : typeof value == 'object' ? true : false;
}

export function is_string(value: unknown): value is string {
	return typeof value === 'string';
}
