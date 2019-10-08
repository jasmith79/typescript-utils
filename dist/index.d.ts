export interface IPojo {
    [key: string]: any;
}
export interface IJSONObject {
    [key: string]: boolean | string | number | IJSONObject | IJSONObject[];
}
export declare const emptyFn: (...args: any[]) => void;
export declare const identity: <T>(x: T) => T;
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
export declare const pipe: <F extends [(arg: any) => any, ...((arg: any) => any)[]]>(...fs: F & AsChain<F, Tail<F>>) => (arg: ArgType<F[0], never>) => ReturnType<F[LastIndexOf<F>]>;
export {};
