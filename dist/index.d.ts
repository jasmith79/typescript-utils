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
 * @description Plain Old Javascript Object.
 */
export interface IPojo {
    [key: string]: any;
}
/**
 * @description Object containing only JSON-compatible values, e.g. the result
 * of JSON.parse.
 */
export interface IJSONObject {
    [key: string]: boolean | string | number | IJSONObject | IJSONObject[];
}
/**
 * @description A Basic reducer action.
 */
export interface IReducerAction<T> {
    value: T;
    type: string;
}
/**
 * @description Type of the reducer given to useReducer
 */
export declare type Reducer<S, A> = (prevState: S, action: A) => S;
/**
 * @description Same as the type of the dispatch function returned from useReducer.
 */
export declare type Dispatch<A> = (action: A) => void;
/**
 * @description
 */
export declare type HTMLFormControl = HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement;
export declare type FormControlEvent = {
    target?: HTMLFormControl;
    currentTarget?: HTMLFormControl;
};
/**
 * @description A no-op. Swallows all arguments, returns void.
 *
 * @param _args {Array} Gathers all arguments.
 * @returns {Void} Nothing.
 */
export declare const emptyFn: (..._args: any[]) => void;
/**
 * @description Identity function. Preserves type of the argument.
 *
 * @param x {T} The argument.
 * @returns {T} The argument.
 */
export declare const identity: <T>(x: T) => T;
/**
 * @description Identity function, does *not* preserve argument type.
 *
 * @param x The argument to return.
 * @returns The supplied argument.
 */
export declare const echo: (x: any) => any;
/**
 * @description Combines two arrays pairwise, truncating to the length of the
 * shorter.
 *
 * @param a First array.
 * @param b Second array.
 * @returns An array with the matching index pairs from the input arrrays.
 */
export declare const zip: <T, U = T>(a: T[], b: U[]) => [T, U][];
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
export declare const bindP: <T, U>(fn: (x: T) => U | Promise<U>) => (y: Promise<T>) => Promise<U>;
/**
 * Type-safe variadic pipe.
 *
 * https://stackoverflow.com/questions/53173203/typescript-recursive-function-composition
 * credit to stack overflow user jcalz for the impressive work which I've modified
 * slightly for my purposes here:
 */
declare type Lookup<T, K extends keyof any, Else = never> = K extends keyof T ? T[K] : Else;
declare type Tail<T extends any[]> = ((...t: T) => void) extends ((x: any, ...u: infer U) => void) ? U : never;
declare type Func1 = (arg: any) => any;
declare type ArgType<F, Else = never> = F extends (arg: infer A) => any ? A : Else;
declare type AsChain<F extends [Func1, ...Func1[]], G extends Func1[] = Tail<F>> = {
    [K in keyof F]: (arg: ArgType<F[K]>) => ArgType<Lookup<G, K, any>, any>;
};
declare type LastIndexOf<T extends any[]> = ((...x: T) => void) extends ((y: any, ...z: infer U) => void) ? U['length'] : never;
/**
* @description Pipes a value through a list of functions.
*
* @param fs {Array} Gathers all passed in functions.
* @returns {Function} A function that takes an argument and pipes
* it through the provided functions.
*/
export declare const pipe: <F extends [(arg: any) => any, ...((arg: any) => any)[]]>(...fs: F & AsChain<F, Tail<F>>) => (arg: ArgType<F[0], never>) => ReturnType<F[LastIndexOf<F>]>;
export {};
