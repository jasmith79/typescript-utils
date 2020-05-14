"use strict";
/**
 * index.ts
 *
 * @description My typescript utility interfaces and functions. Stuff that I
 * need but that probably isn't worth importing e.g. Ramda for.
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
//# sourceMappingURL=index.js.map