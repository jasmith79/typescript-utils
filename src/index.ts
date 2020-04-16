/**
 * index.ts
 *
 * @description My typescript utility interfaces and functions. Stuff that I
 * need but that probably isn't worth importing e.g. Ramda, Lodash for.
 *
 * @author jasmith79
 * @license MIT
 */

/**
 * @description Type T or undefined. Not naming it Option/Maybe because it would violate
 * expecations of a Monadic type.
 */
export type Opt<T> = T | undefined

/**
 * @description Type T or null or undefined.
 */
export type Nullable<T> = T | null | undefined

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
 * @description A Basic reducer action.
 */
export interface IReducerAction<T> {
  value: T,
  type: string
}

/**
 * @description Type of the reducer given to useReducer
 */
export type Reducer<S, A> = (prevState: S, action: A) => S

/**
 * @description Same as the type of the dispatch function returned from useReducer.
 */
export type Dispatch<A> = (action: A) => void

/**
 * @description 
 */
export type HTMLFormControl = HTMLTextAreaElement
  | HTMLInputElement
  | HTMLSelectElement;

export type FormControlEvent = {
  target?: HTMLFormControl;
  currentTarget?: HTMLFormControl;
};

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

/**
 * @description Identity function, does *not* preserve argument type.
 *
 * @param x The argument to return.
 * @returns The supplied argument.
 */
export const echo = (x: any) => x;

/**
 * @description Will bin up calls to the debounced function.
 *
 * @param n The debounce timeout.
 * @param immed Whether to fire the debounced function on first event.
 * @param f The function to debounce.
 * @returns The debounced function.
 */
export const debounce = (
  n: number,
  immed: boolean | ((...args: any[]) => void),
  f?: ((...args: any[]) => void),
): ((...args: any[]) => number) => {
  let [func, now] = (() => {
    switch (Object.prototype.toString.call(immed)) {
      case '[object Boolean]':
        return [f as (...args: any[]) => void, immed as boolean];
      case '[object Function]':
        return [immed as (...args: any[]) => void, false];
      default:
        throw new TypeError(`Unrecognized arguments ${immed} and ${f} to function deb.`);
    }
  })();

  let fn = (func as (...args: any[]) => void);
  let timer: number = -1;
  return function (this: any, ...args: any[]) {
    if (timer === -1 && now) {
      fn.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), n);
    return timer;
  }
};

/**
 * @description Combines two arrays pairwise, truncating to the length of the
 * shorter.
 *
 * @param a First array.
 * @param b Second array.
 * @returns An array with the matching index pairs from the input arrrays.
 */
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
 * @description Checks if a value is a primitive value.
 *
 * @param x The value to test.
 * @returns Whether or not the argument is a Javascript primitive.
 */
export const isPrimitiveValue = (x: any): boolean => {
  const type = typeof x;
  return type === 'number'
    || type === 'string'
    || type === 'undefined'
    || type === 'symbol'
    || type === 'boolean';
};

/**
 * @description Type guard for PromiseLike.
 *
 * @param x The value to test.
 * @returns whether or not the argument is a PromiseLike.
 */
export const isThenable = (x: any): boolean => x && typeof x.then === 'function';

/**
 * @description Deep clones a Javascript value.
 * NOTE: no cycle detection! This will overflow the stack for objects
 * with circular references or extremely deep nesting.
 *
 * @param obj The value to be cloned.
 * @returns A recursively deepCloned copy of the argument.
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || isPrimitiveValue(obj)) return obj;
  // if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.entries(obj).reduce((acc: { [k: string]: any }, [key, value]) => {
    // For promise-like, assume immutability
    if (isPrimitiveValue(value) || isThenable(value)) {
      acc[key] = value;
      // Defer to object's clone method if present.
    } else if (typeof value.clone === 'function') {
      acc[key] = value.clone();
    } else if (Array.isArray(value)) {
      acc[key] = value.map(deepClone);
    } else if (Object.prototype.toString.call(value) === '[object Object]') {
      acc[key] = deepClone(value);
    } else {
      console.warn(
        `Cannot clone object of type ${Object.prototype.toString.call(value)}, copying reference.`,
      );
      acc[key] = value;
    }

    return acc;
  }, {}) as T;
};

/**
 * @description bindP
 * 
 * Although due to their auto-flattening Promises do not strictly speaking
 * comprise a monad, it's close enough for our purposes here. This function will
 * serve the role of a monadic bind to facilitate composition of functions.
 *
 * @param fn The function to lift a function or method into the Promise not-quite-a-monad.
 * @returns A Promise of the value returned from the passed-in function.
 */
export const bindP = <T, U>(fn: (x: T) => U | Promise<U>): ((y: Promise<T>) => Promise<U>) => {
  return async function (this: any, p: Promise<T>) {
    const value = await p;
    return fn.call(this, value);
  };
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