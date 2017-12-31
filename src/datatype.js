/** @module 数据完整性校验 */
import isJSON from 'is-json';
import Valid from './validator';
import { types } from './type';
import objectPath from 'object-path';

export default class DataType extends Valid {
  constructor() {
    super();

    // 扩展类型判断
    this.addRule({
      'json': arg => isJSON(arg),
      'object': arg => types.isObject(arg),
      'array': arg => types.isArray(arg),
      'string': arg => typeof arg === 'string',
      'number': arg => types.isNumber(arg),
      'boolean': arg => typeof arg === 'boolean',
      'empty': arg => {
        const emptyarr = types.isArray(arg) && arg.length === 0;

        return types.isNull(arg) || emptyarr || arg + ''.trim() === '';
      }
    });
    this.checkData = this.checkData.bind(this);
  }

  /**
   * 类型与数据匹配
   * @param {object} struct 数据类型对象
   * @param {object|string} data 数据
   * @param {function} callback 自定义回调，可选，参数为未通过项、对象层级路径
   * @returns {boolean} 是否验证通过
   */
  checkData(struct, data, callback) {
    if (struct === void 0 || data === void 0) return false;

    let typeCheck, itemCheck, itemsCheck, cb = callback,
      passed = false, checkeds = [];
    const isStr = typeof data === 'string' && isJSON(data),
      dataObj = isStr ? JSON.parse(data) : data;

    typeCheck = (dt, path) => {
      let item, type, p = [];

      path.forEach(v => { // 数组数据路径转换
        if (/\d+/.test(v)) p.push(0);
        else p.push(v);
      });
      type = objectPath.get(struct, p); // 取对应规则
      if (type !== void 0) {
        item = {
          value: dt,
          rule: type,
          callback: faults => {
            if (types.isFunction(cb)) cb(faults, path);
            else {
              faults.forEach(f => {
                console.error('"' + path.join(' /') + '"，未通过" ' + f, '"项检查！');
              });
            }
          }
        };
        checkeds.push(this.checkItem(item));
      }
    };
    itemCheck = (d, path) => { // 单对象匹配
      Object.keys(d).forEach(key => {
        let p = path.concat();
        const dt = d[key];

        p.push(key);
        if (types.isArray(dt)) itemsCheck(dt, p);
        else typeCheck(dt, p);
      });

    };
    itemsCheck = (d, path) => { // 组匹配
      let p = path.concat();

      if (types.isArray(d)) {
        d.forEach((dt, i) => {
          if (types.isObject(dt)) {
            let pt = p.concat();

            pt.push(i);
            itemCheck(dt, pt);
          }
        });
      } else if (types.isObject(d)) itemCheck(d, p);
    };

    itemsCheck(dataObj, []);
    if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
    return passed;
  }

}
