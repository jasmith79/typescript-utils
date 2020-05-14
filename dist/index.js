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
exports.pipe = exports.bindP = exports.deepClone = exports.extractEventValue = exports.isThenable = exports.isPrimitiveValue = exports.zip = exports.debounce = exports.echo = exports.identity = exports.emptyFn = void 0;
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
const defaultTimerHandle = setTimeout(exports.emptyFn, 0);
/**
 * @description Will bin up calls to the debounced function.
 *
 * @param n The debounce timeout.
 * @param immed Whether to fire the debounced function on first event.
 * @param f The function to debounce.
 * @returns The debounced function.
 */
exports.debounce = (n, immed, f) => {
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
    let timer = defaultTimerHandle;
    return function (...args) {
        if (timer === defaultTimerHandle && now) {
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
 * @description Checks if a value is a primitive value.
 *
 * @param x The value to test.
 * @returns Whether or not the argument is a Javascript primitive.
 */
exports.isPrimitiveValue = (x) => {
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
exports.isThenable = (x) => x && typeof x.then === 'function';
/**
 * @description Extracts the value, if present, from an event on a FormControl.
 *
 * @param event The event to extract a value from.
 * @returns The extracted string value.
 */
exports.extractEventValue = (event) => {
    const target = event.target ? event.target : null;
    const currentTarget = event.currentTarget ? event.currentTarget : null;
    const targetValue = target === null || target === void 0 ? void 0 : target.value;
    const currentTargetValue = currentTarget === null || currentTarget === void 0 ? void 0 : currentTarget.value;
    return targetValue == null
        ? currentTargetValue == null
            ? ''
            : currentTargetValue
        : targetValue;
};
/**
 * @description Deep clones a Javascript value.
 * NOTE: no cycle detection! This will overflow the stack for objects
 * with circular references or extremely deep nesting.
 *
 * @param obj The value to be cloned.
 * @returns A recursively deepCloned copy of the argument.
 */
exports.deepClone = (obj) => {
    if (obj === null || exports.isPrimitiveValue(obj))
        return obj;
    // if (Array.isArray(obj)) return obj.map(deepClone);
    return Object.entries(obj).reduce((acc, [key, value]) => {
        // For promise-like, assume immutability
        if (exports.isPrimitiveValue(value) || exports.isThenable(value)) {
            acc[key] = value;
            // Defer to object's clone method if present.
        }
        else if (typeof value.clone === 'function') {
            acc[key] = value.clone();
        }
        else if (Array.isArray(value)) {
            acc[key] = value.map(exports.deepClone);
        }
        else if (Object.prototype.toString.call(value) === '[object Object]') {
            acc[key] = exports.deepClone(value);
        }
        else {
            console.warn(`Cannot clone object of type ${Object.prototype.toString.call(value)}, copying reference.`);
            acc[key] = value;
        }
        return acc;
    }, {});
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