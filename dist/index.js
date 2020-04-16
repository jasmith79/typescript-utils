"use strict";
/**
 * index.ts
 *
 * @description My typescript utility interfaces and functions. Stuff that I
 * need but that probably isn't worth importing e.g. Ramda, Lodash for.
 *
 * @author jasmith79
 * @license MIT
 */
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @description A no-op. Swallows all arguments, returns void.
 *
 * @param _args {Array} Gathers all arguments.
 * @returns {Void} Nothing.
 */
exports.emptyFn = (..._args) => { };
/**
 * @description Identity function. Preserves type of the argument.
 *
 * @param x {T} The argument.
 * @returns {T} The argument.
 */
exports.identity = (x) => x;
/**
 * @description Identity function, does *not* preserve argument type.
 *
 * @param x The argument to return.
 * @returns The supplied argument.
 */
exports.echo = (x) => x;
/**
 * @description Will bin up calls to the debounced function.
 *
 * @param n The debounce timeout.
 * @param immed Whether to fire the debounced function on first event.
 * @param f The function to debounce.
 * @returns The debounced function.
 */
const debounce = (n, immed, f) => {
    let [func, now] = (() => {
        switch (Object.prototype.toString.call(immed)) {
            case '[object Boolean]':
                return [f, immed];
            case '[object Function]':
                return [immed, false];
            default:
                throw new TypeError(`Unrecognized arguments ${immed} and ${f} to function deb.`);
        }
    })();
    let fn = func;
    let timer = -1;
    return function (...args) {
        if (timer === -1 && now) {
            fn.apply(this, args);
        }
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), n);
        return timer;
    };
};
/**
 * @description Combines two arrays pairwise, truncating to the length of the
 * shorter.
 *
 * @param a First array.
 * @param b Second array.
 * @returns An array with the matching index pairs from the input arrrays.
 */
exports.zip = (a, b) => {
    const result = [];
    const l = Math.min(a.length, b.length);
    for (let i = 0; i < l; ++i) {
        const arr = [a[i], b[i]];
        result.push(arr);
    }
    return result;
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
exports.bindP = (fn) => {
    return async function (p) {
        const value = await p;
        return fn.call(this, value);
    };
};
/**
* @description Pipes a value through a list of functions.
*
* @param fs {Array} Gathers all passed in functions.
* @returns {Function} A function that takes an argument and pipes
* it through the provided functions.
*/
exports.pipe = (...fs) => {
    return (arg) => {
        const [first, ...rest] = fs;
        const seed = first(arg);
        return rest.reduce((res, fn) => fn(res), seed);
    };
};
/* end */ 
//# sourceMappingURL=index.js.map