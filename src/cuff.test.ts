import { OldSetter, OldGetter, onSet, onGet, cuff, follow } from './cuff';

interface testObj {
	a?: any
	b?: any
}

test('cuff.onGet - value', () => {	
	var tob: testObj = { a: 42 },
		getter = jest.fn(x=> x+10),
		expArgs = [42, tob, 'a'];

	onGet(tob, 'a', getter);
  	expect(tob.a).toBe(52);
	
	expect(getter.mock.calls.length).toBe(1);
	expect(getter.mock.calls[0].every((v, i)=> v === expArgs[i])).toBe(true);

	tob.a = 30;
  	expect(tob.a).toBe(40);
});

test('cuff.onGet - getter', () => {	
	var tob: testObj = { get a() { return 42; } },
		getter = jest.fn(x=> x+10),
		expArgs = [42, tob, 'a'],
		oldGet: OldGetter;

	oldGet = onGet(tob, 'a');
  	expect(tob.a).toBe(42);
	oldGet.callback = getter;
  	expect(tob.a).toBe(52);
	
	expect(getter.mock.calls.length).toBe(1);
	expect(getter.mock.calls[0].every((v, i)=> v === expArgs[i])).toBe(true);

});

test('cuff.onSet - value', () => {	
	var tob: testObj = {},
		setter = jest.fn(x=> x+10),
		expArgs = [42, tob, 'a'];

	onSet(tob, 'a', setter);
	tob.a = 42;
  	expect(tob.a).toBe(52);
	
	expect(setter.mock.calls.length).toBe(1);
	expect(setter.mock.calls[0].every((v, i)=> v === expArgs[i])).toBe(true);
});

test('cuff.onSet - setter', () => {	
	var internal: any = 59,
		tob: testObj = {
			get a() { return internal; },
			set a(v: any) { internal = v; }
		},
		setter = jest.fn(x=> x+10),
		expArgs = [42, tob, 'a'],
		oldSet: OldSetter;

	oldSet = onSet(tob, 'a');
  	expect(tob.a).toBe(59);
	oldSet.callback = setter;
	tob.a = 42;
  	expect(tob.a).toBe(52);
	
	expect(setter.mock.calls.length).toBe(1);
	expect(setter.mock.calls[0].every((v, i)=> v === expArgs[i])).toBe(true);

});

test('cuff.follow', () => {	
	var tob: testObj = {a: {}, b: {}};
	
	follow(tob.a, 'x', tob.b, 'y');
	tob.b.y = 59;
  	expect(tob.a.x).toBe(59);
});

test('cuff.cuff', () => {	
	var tob: testObj = {a: {}, b: {}};
	
	cuff(tob.a, 'x', tob.b, 'y');
	tob.b.y = 59;
  	expect(tob.a.x).toBe(59);
	tob.a.x = 62;
  	expect(tob.b.y).toBe(62);
});