/**
 * @module Path
 */
/**
 * Thrown when a path is not reachable - when the containing object does not exists.
 */
export class InvalidPath extends Error {
    constructor(path: string) {
        super(`Invalid path: '${path}'`);
        // Set the prototype explicitly.
        Object.setPrototypeOf(this, InvalidPath.prototype);
    }
}

/** @hidden */
function recur(obj: any, path: string): any {
	var keys = [], lvalue;
	for(let key of path.split('.')) {
		let subs = /^(.*?)(?:\[(.*)\])?$/.exec(key);
		keys.push(subs![1]);
		if(subs![2]) keys.push(...subs![2].split(']['));
	}
	lvalue = keys.pop();
	for(let key of keys)
		if(!(obj = obj[key]))
			throw new InvalidPath(path);
	return {obj, key: lvalue};
}

/**
 * Set a value of an object considering its path
 * @throw InvalidPath
 */
export function set(obj: any, path: string, value: any) {
	var lv = recur(obj, path);
	lv.obj[lv.key] = value;
}

/**
 * Delete a value of an object considering its path
 * @throw InvalidPath
 */
export function del(obj: any, path: string) {
	var lv = recur(obj, path);
	delete lv.obj[lv.key];
}

/**
 * Get a value of an object considering its path
 * @throw InvalidPath
 * @return `undefined` if the property is missing or the queried value
 */
export function get(obj: any, path: string): any {
	var lv = recur(obj, path);
	return lv.obj[lv.key];
}
