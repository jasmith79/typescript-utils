"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptyFn = (...args) => { };
exports.identity = (x) => x;
exports.pipe = (...fs) => {
    return (arg) => {
        const [first, ...rest] = fs;
        const seed = first(arg);
        return rest.reduce((res, fn) => fn(res), seed);
    };
};
/* end */ 
//# sourceMappingURL=index.js.map