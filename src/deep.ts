/**
 * @module Deep
 */
/**
 * Deeply compare `Objects` even if their references are different
 * @param {any} x
 * @param {any} y
 * @return Wheter `x` deeply equals `y`
 */
export function equals(x: any, y: any): boolean {
	if(x === y) return true;
	if(!x || !y || 'object'!== typeof x || 'object'!== typeof y ||
		x.constructor !== y.constructor ||
		x instanceof Function ||
		x instanceof RegExp ||
		(Array.isArray(x) && x.length !== y.length)
	)
		return false;

	if(x instanceof Date || y instanceof Date)
		return x instanceof Date && y instanceof Date && x.valueOf() == y.valueOf();

	var p = Object.getOwnPropertyNames(x);
	return Object.getOwnPropertyNames(y).every(function (i) { return !~p.indexOf(i); }) &&
			p.every(function (i) { return equals(x[i], y[i]); });
}

/**
 * Deep copy `src` into `dst`.
 * Can be used for deep cloning
 */
export function copy(src: any, dst?: any): any {
	if(src instanceof Array) {
		if(!(dst instanceof Array)) dst = [];
		dst.splice(0, dst.length, ...src.map((x: any)=> copy(x)));
		return dst;
	}
	if(!src || !src.constructor)
		return src;
	if(!dst || src.constructor !== dst.constructor)
		dst = Object.create(src.constructor.prototype);
	for(let key of Object.getOwnPropertyNames(src)) {
		let pDescr = Object.getOwnPropertyDescriptor(src, key)!;
		if(!pDescr.get && !pDescr.set)
			pDescr.value = copy(src[key], dst[key]);
		Object.defineProperty(dst, key, pDescr)

	}
	return dst;
}