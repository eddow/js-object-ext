interface OldSetter {
	(v: any): void;
	callback?: (v: any, scope: object, prop: string)=> boolean|void;
}
interface OldGetter {
	(): any;
	callback?: (v: any, scope: object, prop: string)=> any;
}

/**
 * Calls `cb` before setting the value each time the property `prop` of object `obj` is set.
 * @returns A function without `this` scope that sets the value of `obj[prop]` without calling `cb`
 */
export function onSet(obj: object, prop: string, cb?: (v: any, scope: object, prop: string)=> boolean|void): OldSetter {
	var oldDescr: PropertyDescriptor = Object.getOwnPropertyDescriptor(obj, prop) || {
		value: undefined,
		writable: true,
		enumerable: true
	}, newDescr = Object.create(oldDescr);
	if(!oldDescr.set) {
		console.assert(
			!oldDescr.get && oldDescr.writable,
			`Property ${prop} is not writable`);
		newDescr.get = ()=> newDescr.value;
	}
	var oldSet: OldSetter = Object.assign(oldDescr.set ?
		(v: any)=> oldDescr.set!.apply(obj, v) :
		(v: any)=> newDescr.value = v, {
			callback: cb
		});
	newDescr.set = function(v: any) {
		if(false!== oldSet.callback!.call(this, v, this, prop)) oldSet(v);
	}
	newDescr.set.original = oldSet;
	Object.defineProperty(obj, prop, newDescr);
	return oldSet;
}

/**
 * Property `propA` of object `objA` is hand-cuffed with property `propB` of object `objB` - when one change, both change
 */
export function cuff(objA: object, propA: string, objB: object, propB: string): void {
	var oldSetA = onSet(objA, propA),
		oldSetB = onSet(objA, propA, oldSetA);
	oldSetA.callback = oldSetB;
}

/**
 * "Follower"[Fr] property `propFr` of object `objFr` is set when "followed"[Fd] property `propFd` of object `objFd` is changed
 */
export function follow(objFr: {[prop: string]: any}, propFr: string, objFd: {[prop: string]: any}, propFd: string): void {
	onSet(objFd, propFd, (v: any)=> objFr[propFr] = v);
}

/**
 * Calls `cb` after getting the value each time the property `prop` of object `obj` is retrieved.
 * If `cb` returns a defined value, this value is retrieved instead of the originally retrieved value.
 * @returns A function without `this` scope that sets the value of `obj[prop]` without calling `cb`
 */
export function onGet(obj: object, prop: string, cb?: (v: any, scope: object, prop: string)=> any): OldGetter {
	var oldDescr = Object.getOwnPropertyDescriptor(obj, prop) || {
		value: undefined,
		writable: true,
		enumerable: true
	}, newDescr = Object.create(oldDescr);
	if(!oldDescr.get) {
		console.assert(
			!oldDescr.set,
			`Inspecting property set for ${prop} would make it readible`)
		newDescr.set = (v: any)=> newDescr.value = v;
	}
	var oldGet: OldGetter = Object.assign(oldDescr.get ?
		()=> oldDescr.get!.apply(obj) :
		()=> newDescr.value, {
			callback: cb
		});
	newDescr.get = function() {
		var v = oldGet(),
			rv = oldGet.callback!.call(this, v, this, prop);
		return undefined!== rv ? rv : v;
	}
	newDescr.get.original = oldGet;
	Object.defineProperty(obj, prop, newDescr);
	return oldGet;
}