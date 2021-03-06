const objectHash = require('object-hash');
const { memoizeNonPrimitives } = require('./memoize');
const _ = require('lodash');

const strHash = {};
const hashString = str => {
  if (!strHash[str]) {
    strHash[str] = objectHash(str);
  }
  const res = strHash[str];
  return res;
};

const exprHash = memoizeNonPrimitives(
  obj => {
    // console.log( Array.isArray(obj), _.isPlainObject(obj),JSON.stringify(obj, null,2))
    if (Array.isArray(obj)) {
      return objectHash(_.map(obj, val => exprHash(val)).join(','));
    } else if (_.isPlainObject(obj)) {
      const keys = Object.keys(obj).sort();
      return _.map(keys, key => `${key}:${exprHash(obj[key])}`).join(',');
    } else {
      return hashString(JSON.stringify(obj));
    }
  },
  primitive => hashString(JSON.stringify(primitive))
);

module.exports = exprHash;
