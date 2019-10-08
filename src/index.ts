export interface IPojo {
  [key: string]: any,
}

export interface IJSONObject {
  [key: string]: boolean | string | number | IJSONObject | IJSONObject[],
}

export const emptyFn = (...args: any[]) => {};

export const identity = <T>(x: T): T => x;

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