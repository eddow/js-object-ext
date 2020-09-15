import { equals, copy } from './deep';

test('equals', () => {	
	var a: any = {
			x: [42],
			y: {z: 1},
			z: new Date(500000)
		}, b: any = {
			x: [42],
			y: {z: 1},
			z: new Date(500000)
		};

  	expect(equals(a, b)).toBe(true);
	a.y.z = 2;
  	expect(equals(a, b)).toBe(false);
});

test('copy', () => {	
	var a: any = {},
		b: any = {
			self: <any>{},
			x: [42],
			y: {z: 1},
			z: new Date(500000),
			n: null,
			get cnst() { return 59; }
		};

	b.self = b;
	copy(b, a);
  	expect(a.y.z).toBe(1);
	b.self.y.z = 2;
  	expect(a.y.z).toBe(1);
  	expect(a.self).toBe(a);
});