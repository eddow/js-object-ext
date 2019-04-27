/**
 * @module Path
 */
/**
 * Thrown when a path is not reachable - when the containing object does not exists.
 */
export class InvalidPath extends Error {}

/** @hidden */
function recur(obj: any, path: string): any {
	if(!obj || !path) return;
	var keys = [], lvalue;
	for(let key of path.split('.')) {
		let subs = /^(.*?)(\[.*\])?$/.exec(key);
		keys.push(subs![1]);
		if(subs![2]) keys.push(...subs![2].split(']['));
	}
	lvalue = keys.pop();
	for(let key of keys) if(!(obj = obj[key])) throw new InvalidPath;
	return {obj, key: lvalue};
}

/**
 * Set a value of an object considering its path
 * @throw InvalidPath
 * @return `true` in case of successful affectation
 */
export function set(obj: any, path: string, value: any): boolean {
	var lv = recur(obj, path);
	if(!lv) return false;
	lv.obj[lv.key] = value;
	return true;
}

/**
 * Delete a value of an object considering its path
 * @throw InvalidPath
 * @return `true` in case of successful deletion
 */
export function del(obj: any, path: string): boolean {
	var lv = recur(obj, path);
	if(!lv) return false;
	delete lv.obj[lv.key];
	return true;
}

/**
 * Get a value of an object considering its path
 * @throw InvalidPath
 * @return `undefined` if the property is missing or the queried value
 */
export function get(obj: any, path: string): any {
	var lv = recur(obj, path);
	return lv && lv.obj[lv.key];
}
