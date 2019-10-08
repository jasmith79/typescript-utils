import {
  IPojo,
  IJSONObject,
  emptyFn,
  identity,
  pipe,
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
