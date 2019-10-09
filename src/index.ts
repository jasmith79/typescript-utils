/**
 * index.ts
 *
 * @description My typescript utility interfaces and functions. Stuff that I
 * need but that probably isn't worth importing e.g. Ramda for.
 *
 * @author jasmith79
 * @license MIT
 */

/**
 * @description Plain Old Javascript Object.
 */
export interface IPojo {
  [key: string]: any,
}

/**
 * @description Object containing only JSON-compatible values, e.g. the result
 * of JSON.parse.
 */
export interface IJSONObject {
  [key: string]: boolean | string | number | IJSONObject | IJSONObject[],
}

/**
 * @description A no-op. Swallows all arguments, returns void.
 *
 * @param _args {Array} Gathers all arguments.
 * @returns {Void} Nothing.
 */
export const emptyFn = (..._args: any[]) => {};

/**
 * @description Identity function. Preserves type of the argument.
 *
 * @param x {T} The argument.
 * @returns {T} The argument.
 */
export const identity = <T>(x: T): T => x;

export const zip = <T, U = T>(a: T[], b: U[]): [T, U][] => {
  const result = [];
  const l = Math.min(a.length, b.length);
  for (let i = 0; i < l; ++i) {
    const arr: [T, U] = [a[i], b[i]];
    result.push(arr);
  }

  return result;
};

/**
 * Type-safe variadic pipe.
 *
 * https://stackoverflow.com/questions/53173203/typescript-recursive-function-composition
 * credit to stack overflow user jcalz for the impressive work which I've modified
 * slightly for my purposes here:
 */

type Lookup<T, K extends keyof any, Else = never> = K extends keyof T ? T[K] : Else

type Tail<T extends any[]> =
  ((...t: T) => void) extends ((x: any, ...u: infer U) => void) ? U : never;

type Func1 = (arg: any) => any;

type ArgType<F, Else = never> = F extends (arg: infer A) => any ? A : Else;

type AsChain<F extends [Func1, ...Func1[]], G extends Func1[] = Tail<F>> =
  { [K in keyof F]: (arg: ArgType<F[K]>) => ArgType<Lookup<G, K, any>, any> };

type LastIndexOf<T extends any[]> =
  ((...x: T) => void) extends ((y: any, ...z: infer U) => void)
  ? U['length'] : never

/**
* @description Pipes a value through a list of functions.
*
* @param fs {Array} Gathers all passed in functions.
* @returns {Function} A function that takes an argument and pipes
* it through the provided functions.
*/
export const pipe = <F extends [(arg: any) => any, ...Array<(arg: any) => any>]>(
  ...fs: F & AsChain<F>
): (arg: ArgType<F[0]>) => ReturnType<F[LastIndexOf<F>]> => {
  return (arg) => {
    const [first, ...rest] = fs;
    const seed = first(arg);
    return rest.reduce((res, fn) => fn(res), seed);
  };
};

/* end */