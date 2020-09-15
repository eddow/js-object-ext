/**
 * @module Cuff
 */
 export interface OldSetter {
	(v: any): void;
	callback?: (v: any, scope: object, prop: string)=> boolean|void;
}
export interface OldGetter {
	(): any;
	callback?: (v: any, scope: object, prop: string)=> any;
}

/**
 * Calls `callback` before setting the value each time the property `prop` of object `obj` is set.
 * If `callback` returns a value (not `undefined`), this value will be used instead of the given one.
 * @returns A function without `this` scope that sets the value of `obj[prop]` without calling `callback`
 */
export function onSet(obj: object, prop: string, callback?: (v: any, scope: object, prop: string)=> boolean|void): OldSetter {
	var oldDescr: PropertyDescriptor = Object.getOwnPropertyDescriptor(obj, prop) || {
		value: undefined,
		writable: true,
		enumerable: true
	}, newDescr = Object.assign({configurable: true}, oldDescr),
		internalValue = oldDescr.value;
	if(!oldDescr.set) {
		console.assert(
			!oldDescr.get && oldDescr.writable,
			`Property ${prop} is not writable`);
		newDescr.get = ()=> internalValue;
			
		delete newDescr.writable;
		delete newDescr.value;
	}
	var oldSet: OldSetter = Object.assign(oldDescr.set ??
		((v: any)=> internalValue = v), {callback});
	newDescr.set = function(v: any) {
		var compV = oldSet.callback!.call(this, v, this, prop);
		oldSet('undefined'=== typeof compV ? v : compV);
	}
	Object.defineProperty(obj, prop, newDescr);
	return oldSet;
}

/**
 * Property `propA` of object `objA` is hand-cuffed with property `propB` of object `objB` - when one changes, both change
 */
export function cuff(objA: object, propA: string, objB: object, propB: string): void {
	var oldSetA = onSet(objA, propA),
		oldSetB = onSet(objB, propB, oldSetA);
	oldSetA.callback = oldSetB;
}

/**
 * "Follower"[Fr] property `propFr` of object `objFr` is set when "followed"[Fd] property `propFd` of object `objFd` is changed
 */
export function follow(objFr: {[prop: string]: any}, propFr: string, objFd: {[prop: string]: any}, propFd: string): void {
	onSet(objFd, propFd, (v: any)=> objFr[propFr] = v);
}

/**
 * Calls `callback` after getting the value each time the property `prop` of object `obj` is retrieved.
 * If `callback` returns a defined value, this value is returned instead of the originally retrieved value.
 * @returns A function without `this` scope that sets the value of `obj[prop]` without calling `callback`
 */
export function onGet(obj: object, prop: string, callback?: (v: any, scope: object, prop: string)=> any): OldGetter {
	var oldDescr = Object.getOwnPropertyDescriptor(obj, prop) || {
		value: undefined,
		writable: true,
		enumerable: true
	}, newDescr = Object.assign({configurable: true}, oldDescr),
		internalValue = oldDescr.value;
	if(!oldDescr.get) {
		console.assert(
			!oldDescr.set,
			`Inspecting property set for ${prop} would make it readible`)
		if(oldDescr.writable)
			newDescr.set = (v: any)=> internalValue = v;
			
		delete newDescr.writable;
		delete newDescr.value;
	}
	var oldGet: OldGetter = Object.assign(oldDescr.get ??
		(()=> internalValue), {callback});
	newDescr.get = function() {
		var v = oldGet();
		if(!oldGet.callback) return v;
		return oldGet.callback.call(this, v, this, prop);
	}
	Object.defineProperty(obj, prop, newDescr);
	return oldGet;
}