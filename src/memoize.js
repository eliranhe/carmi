const { Expression } = require('./lang');

const memoize = func => {
  const cache = new WeakMap();
  return arg => {
    if (!cache.has(arg)) {
      cache.set(arg, func(arg));
    }
    return cache.get(arg);
  };
};

const maybeMemoize = (testFunc, objFunc, primitiveFunc) => {
  let funcOnMaybeObj, funcOnObj;
  funcOnMaybeObj = token => {
    if (testFunc(token)) {
      return funcOnObj(token);
    } else {
      return primitiveFunc(token);
    }
  };
  funcOnObj = memoize(token => {
    return objFunc(token);
  });
  return funcOnMaybeObj;
};

const memoizeExprFunc = (exprFunc, nonExprFunc) => {
  return maybeMemoize(t => t instanceof Expression, exprFunc, nonExprFunc);
};

const memoizeNonPrimitives = (objFunc, primitiveFunc) => {
  return maybeMemoize(t => t && t === Object(t), objFunc, primitiveFunc);
};

module.exports = {
  memoizeNonPrimitives,
  maybeMemoize,
  memoizeExprFunc,
  memoize
};
