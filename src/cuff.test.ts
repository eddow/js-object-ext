import { OldSetter, OldGetter, onSet, onGet, cuff, follow } from './cuff';

interface testObj {
	A?: any
	B?: any
}

test('cuff.onGet - value', () => {	
	var tob: testObj = { A: 42 },
		getter = jest.fn(x=> x+10),
		expArgs = [42, tob, 'A'];

	onGet(tob, 'A', getter);
  	expect(tob.A).toBe(52);
	
	expect(getter.mock.calls.length).toBe(1);
	expect(getter.mock.calls[0].every((v, i)=> v === expArgs[i])).toBe(true);

	tob.A = 30;
  	expect(tob.A).toBe(40);
});

test('cuff.onGet - getter', () => {	
	var tob: testObj = { get A() { return 42; } },
		getter = jest.fn(x=> x+10),
		expArgs = [42, tob, 'A'],
		oldGet: OldGetter;

	oldGet = onGet(tob, 'A');
  	expect(tob.A).toBe(42);
	oldGet.callback = getter;
  	expect(tob.A).toBe(52);
	
	expect(getter.mock.calls.length).toBe(1);
	expect(getter.mock.calls[0].every((v, i)=> v === expArgs[i])).toBe(true);

});

test('cuff.onSet - value', () => {	
	var tob: testObj = {},
		setter = jest.fn(x=> x+10),
		expArgs = [42, tob, 'A'];

	onSet(tob, 'A', setter);
	tob.A = 42;
  	expect(tob.A).toBe(52);
	
	expect(setter.mock.calls.length).toBe(1);
	expect(setter.mock.calls[0].every((v, i)=> v === expArgs[i])).toBe(true);
});

test('cuff.onSet - setter', () => {	
	var internal: any = 59,
		tob: testObj = {
			get A() { return internal; },
			set A(v: any) { internal = v; }
		},
		setter = jest.fn(x=> x+10),
		expArgs = [42, tob, 'A'],
		oldSet: OldSetter;

	oldSet = onSet(tob, 'A');
  	expect(tob.A).toBe(59);
	oldSet.callback = setter;
	tob.A = 42;
  	expect(tob.A).toBe(52);
	
	expect(setter.mock.calls.length).toBe(1);
	expect(setter.mock.calls[0].every((v, i)=> v === expArgs[i])).toBe(true);

});

test('cuff.follow', () => {	
	var tob: testObj = {A: {}, B: {}};
	
	follow(tob.A, 'x', tob.B, 'y');
	tob.B.y = 59;
  	expect(tob.A.x).toBe(59);
});

test('cuff.cuff', () => {	
	var tob: testObj = {A: {}, B: {}};
	
	cuff(tob.A, 'x', tob.B, 'y');
	tob.B.y = 59;
  	expect(tob.A.x).toBe(59);
	tob.A.x = 62;
  	expect(tob.B.y).toBe(62);
});