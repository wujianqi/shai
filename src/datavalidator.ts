import { ValidRuleFunc } from './validatorbase';
import Validator, { Item, ValidChain, ValidatorInterface } from './validator';
import * as objectPath from 'object-path';

export interface DataItem extends Item {
    null?: boolean;
    boolean?: boolean;
    string?: boolean;
    number?: boolean;
    array?: boolean;
    object?: boolean;
    rule?: DataChain;
}

export interface DataChain extends ValidChain {
    null?: ValidChain;
    boolean?: ValidChain;
    string?: ValidChain;
    number?: ValidChain;
    array?: ValidChain;
    object?: ValidChain;
}

export interface DataValidatorInterface extends ValidatorInterface {
    readonly type: DataChain;
    checkItem(options: DataItem): boolean;
    checkItems(items: DataItem[]): boolean;
    checkJSON<T extends {}>(JSONData: string | T, struct: T, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
}

/**
 * @class JSON 数据验证类
 */
export default class DataValidator extends Validator implements DataValidatorInterface {
    /**
   * 类型与数据匹配
   * @param {string|object} JSON 数据
   * @param {object} struct 数据类型对象 (检测链)
   * @param {function} callback 自定义回调，可选，参数为未通过项、对象层级路径
   * @returns {boolean} 是否验证通过
   */
    checkJSON<T extends {}>(JSONData: string | T, struct: T, callback?: (faults: string[], path: (string | number)[]) => void): boolean {
        let passed = false, checkeds: boolean[] = [];
        const dataObj = typeof JSONData === 'string' ? JSON.parse(JSONData) : JSONData;

        const checkValue = (dt: string | number | T, rule: DataChain, p: (string | number)[]) => {
            let item = {
                value: dt,
                rule: rule,
                callback: (faults: string[]) => {
                    if (callback) callback(faults, p);
                    else {
                        faults.forEach(f => {
                            console.error(`${p.join('.')}的值，不符合“${f}”项的要求！`);
                        });
                    }
                }
            };
            checkeds.push(this.checkItem(item));
        };
        const findMany = (path: (string | number)[], rule: DataChain): void => {
            let ids: number[] = [],
                lastRight = path.slice(path.lastIndexOf(0) + 1);

            path.forEach((v, i) => {
                if (v === 0) ids.push(i);
            });

            const getMany = (n: number, pr?: number) => { // 递归取数据，生成路径集
                let left = path.slice(0, ids[n]), next = n + 1,
                    p: any[], dt: any, len: number;

                if (pr && left.lastIndexOf(0) > -1) left.splice(left.lastIndexOf(0), 1, pr);
                dt = objectPath.get(dataObj, left);
                len = (<(string | number)[]>dt).length;

                for (let j = 0; j < len; j++) { // 循环数据列
                    p = lastRight ? left.concat(j).concat(lastRight) : left.concat(j);
                    if (ids[next]) getMany(next, j);
                    else {
                        // console.log(objectPath.get(dataObj, p), p);
                        checkValue(objectPath.get(dataObj, p), rule, p);
                    }
                }
            };
            getMany(0);
        };
        const findData = (type: DataChain, path: (string | number)[]): void => { //匹配路径数据
            let dt: T = objectPath.get(dataObj, path);

            if (path.indexOf(0) > -1) findMany(path, type);
            else if (dt) {
                if (Array.isArray(dt)) dt.forEach((d, i) => {
                    checkValue(d, type, path.concat(i));
                });
                else checkValue(dt, type, path);
            } else {
                throw new Error(`${path.join('.')}，在检测的目标数据中不存在`);
            }
        };
        const itemCheck = (types: any, path: (string | number)[]): void => {
            Object.keys(types).forEach(key => {
                let p = path.concat(), t: DataChain;
                const datatype = types[key];

                p.push(key);
                if (Array.isArray(datatype) && datatype.length > 0) {
                    t = datatype[0] as DataChain;
                    p.push(0);
                } else {
                    t = datatype as DataChain;
                }

                if (this.isObject(t)) {
                    if (t.hasOwnProperty('__caches')) findData(t, p);
                    else itemCheck(t, p);
                }
            });
        };

        itemCheck(struct, []);
        if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
        return passed;
    }

    constructor() {
        super();

        this.addRule({
            'null': <ValidRuleFunc>((arg: any) => !arg && typeof arg != "undefined" && arg != 0),
            'boolean': <ValidRuleFunc>((arg: any) => typeof arg === 'boolean'),
            'string': <ValidRuleFunc>((arg: any) => typeof arg === 'string'),
            'number': <ValidRuleFunc>((arg: any) => typeof arg === 'number'),
            'array': <ValidRuleFunc>((arg: any) => Array.isArray(arg)),
            'object': this.isObject
        });
    }
}