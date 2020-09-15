/**
 * @module Deep
 */
/**
 * Deeply compare `Objects` even if their references are different
 * @param {any} x
 * @param {any} y
 * @return Wheter `x` deeply equals `y`
 */
export function equals(x: any, y: any, onlyEnumerable: boolean = true): boolean {
	return deepEquals(new Map(), x, y, onlyEnumerable);	
}
function deepEquals(begun: Map<any, any>, x: any, y: any, onlyEnumerable: boolean): boolean {
	if(x === y || (begun.has(x) && begun.get(x) === y)) return true;
	if(!x || !y || 'object'!== typeof x || 'object'!== typeof y ||
		x.constructor !== y.constructor ||
		x instanceof Function ||
		x instanceof RegExp ||
		(Array.isArray(x) && x.length !== y.length)
	)
		return false;

	if(x instanceof Date || y instanceof Date)
		return x instanceof Date && y instanceof Date && x.valueOf() == y.valueOf();
	var keyFunc = onlyEnumerable? Object.keys : Object.getOwnPropertyNames;
	var p: string[] = keyFunc(x);
	begun.set(x, y);
	return keyFunc(y).every(function (i: string) { return !!~p.indexOf(i); }) &&
			p.every(function (i: string) { return deepEquals(begun, x[i], y[i], onlyEnumerable); });
}

/**
 * Deep copy `src` into `dst`.
 * Can be used for deep cloning
 */
export function copy(src: any, dst?: any): any {
	return deepCopy(new Map(), src, dst);
}
 function deepCopy(begun: Map<any, any>, src: any, dst?: any): any {
	if('object'!== typeof src) return src;
	if(begun.has(src)) return begun.get(src);
	if(src instanceof Array) {
		if(!(dst instanceof Array)) dst = [];
		begun.set(src, dst);
		dst.splice(0, dst.length, ...src.map((x: any)=> deepCopy(begun, x)));
		return dst;
	}
	if(!src || !src.constructor)
		return src;
	if(!dst) dst = Object.create(src.constructor.prototype);
	begun.set(src, dst);
	for(let key of Object.getOwnPropertyNames(src)) {
		let pDescr = Object.getOwnPropertyDescriptor(src, key)!;
		if(pDescr.get) {
			let orgGet = pDescr.get;
			pDescr.get = function() {
				return deepCopy(begun, orgGet.apply(src));
			}
		} else if(!pDescr.get && !pDescr.set)
			pDescr.value = deepCopy(begun, src[key], dst[key]);
		Object.defineProperty(dst, key, pDescr)

	}
	return dst;
}