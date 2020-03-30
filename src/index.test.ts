import {
  IPojo,
  IJSONObject,
  emptyFn,
  identity,
  pipe,
  zip,
  bindP,
} from './index';

describe('IPojo', () => {
  it('should be the interface for a plain ol Javascript object', () => {
    const foo: IPojo = { a: 1, b: /arstn/, c: {}, d: [], e: true };
    expect(true).toBe(true);
  });
});

describe('IJSONObject', () => {
  it('should be the interface for a JSON-compatible object', () => {
    const foo: IJSONObject = { a: true, b: 1, c: '', d: [] };
    const bar: IJSONObject = JSON.parse(JSON.stringify(foo));
    expect(true).toBe(true);
  });
});

describe('identity', () => {
  it('should return its argument', () => {
    const foo: IPojo = { a: 1 };
    const bar: IPojo = identity(foo);
    expect(foo).toBe(bar);
  });
});

describe('emptyFn', () => {
  it('should swallow all arguments, returning nothing.', () => {
    const foo = emptyFn(true, { a: 1 }, /aroseitn/, []);
    expect(foo).toBeUndefined();
  });
});

describe('pipe', () => {
  it('should take two or more functions and pipe a value through them.', () => {
    const add3 = (x: number) => x + 3;
    const times2 = (y: number) => y * 2;
    const toString = (z: number) => z.toString();
    const repeat3 = (s: string) => s.repeat(3);
    const xform = pipe(add3, times2, toString, repeat3);
    expect(xform(2)).toBe('101010');
  });
});

describe('zip', () => {
  it('should zip two arrays', () => {
    const foo = zip(
      ['a', 'b'],
      [1, 2],
    );

    expect(foo).toEqual([['a', 1], ['b', 2]]);
  });

  it('should truncate to the length of the shorter', () => {
    const foo = zip(
      ['a', 'b'],
      [1, 2, 3],
    );

    expect(foo).toEqual([['a', 1], ['b', 2]]);
  });

  it('should take a type parameter for the first array', () => {
    const foo = zip<string>(
      ['a', 'b'],
      ['c', 'd'],
    );

    expect(foo).toEqual([['a', 'c'], ['b', 'd']]);
  });

  it('should optionally take a type parameter for the second array', () => {
    const foo = zip<string, number>(
      ['a', 'b'],
      [1, 2, 3],
    );

    expect(foo).toEqual([['a', 1], ['b', 2]]);
  });

});

describe('bindP', () => {
  it('should turn a normal function into a Promise-accepting one.', (done) => {
    const add3 = (x: number) => x + 3;
    bindP(add3)(Promise.resolve(2)).then(val => {
      expect(val).toBe(5);
      done();
    });
  });

  it('should preserve ctx for methods', (done) => {
    type Obj = {
      a: number,
      fn: (x: Promise<number>) => Promise<number>,
    };

    let obj: Obj = {
      a: 1,
      fn: bindP(function (this: Obj, b) { return this.a + b; })
    };

    obj.fn(Promise.resolve(2)).then(val => {
      expect(val).toBe(3);
      done();
    });
  });
});
