/** @module 类型检测 */

const has = d => typeof d !== void 0,
  typeTest = (d, type) => Object.prototype.toString.call(d) === '[object ' + type + ']';

export const types = {
  'isObject': d => has(d) && typeTest(d, 'Object') && d instanceof Object,
  'isArray': d => has(d) && typeTest(d, 'Array') && d instanceof Array,
  'isRegexp': d => has(d) && typeTest(d, 'RegExp') && d instanceof RegExp,
  'isNumber': d => has(d) && has(d) && typeof d === 'number' && isFinite(d),
  'isFunction': d => has(d) && typeTest(d, 'Function'),
  'isNull': d => typeTest(d, 'Null')
};
