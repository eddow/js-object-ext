import { set, del, get, InvalidPath } from './path';

test('path.set', () => {
	var tob = {a: {b: {c: 42}}};

	set(tob, 'a.b.c', 52);
  	expect(tob.a.b.c).toBe(52);
  	expect(()=> set(tob, 'x.y', 52)).toThrow(InvalidPath);
});

test('path.get', () => {
	var tob = {a: {b: {c: 42}}};
	
  	expect(get(tob, 'a.b.c')).toBe(42);
  	expect(()=> get(tob, 'x.y')).toThrow(InvalidPath);
});

test('path.pathed', () => {
	var tob = {a: {b: [12, 34, 56]}};
	
  	expect(get(tob, 'a.b[1]')).toBe(34);
  	expect(()=> get(tob, 'x.y')).toThrow(InvalidPath);
});

test('path.del', () => {
	var tob = {a: {b: {c: 42}}};
	
	del(tob, 'a.b.c')
  	expect(Object.getOwnPropertyNames(tob.a.b)).not.toContain('c');
  	expect(()=> del(tob, 'x.y')).toThrow(InvalidPath);
});