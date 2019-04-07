import { rules, rulesName, RuleFunction} from './rules';
import { Chain, ChainInterface } from './Chain';
import { objectPath } from './objectPath';

export { RuleFunction };

export interface Item {
    value: any;
    format?: ChainInterface;
    require?: boolean;
    callback?: (faults: string[]) => void;    
};

/**
 * @module 验证器
 */
export default class Validator {

    /**
     * 链式规则调用
     */
    get string(): ChainInterface {
        return (<ChainInterface>new Chain()).string;
    }
    get number(): ChainInterface {
        return (<ChainInterface>new Chain()).number;
    }
    get object(): ChainInterface {
        return (<ChainInterface>new Chain()).object;
    }
    get array(): ChainInterface {
        return (<ChainInterface>new Chain()).array;
    }
    get boolean(): ChainInterface {
        return (<ChainInterface>new Chain()).boolean;
    }
    get null(): ChainInterface {
        return (<ChainInterface>new Chain()).null;
    }

    /**
   * 单项单规则验证
   * @param {*} value 检测的值，必含
   * @param {string} [ruleStr] 规则属性，默认为判断是否为空，可选
   * @param {...*} args 对比值、参考值等自定义验证方法扩展参数，可选
   * @returns {boolean} 是否验证通过
   * @example
   * check('password1','==','password2')
   */
    check(value: any, ruleName: rulesName = 'require', ...args: any[]): boolean {
        let passed = false;
        const val = typeof value === 'string' ? value.trim() : value;

        if (rules.hasOwnProperty(ruleName)) {
            const r = rules[ruleName];
            if (r instanceof RegExp) passed = (<RegExp>r).test(val);
            else if (typeof r === 'function') passed = (<RuleFunction>r)(value, ...args);
        } else throw new TypeError(`没有找到“${ruleName}”相关验证规则！`);

        return passed;
    }

    /**
   * 单项组合规则验证，对象方式
   * @param {object} options 属性对象。
   * @prop {*} value 必备选项，验证目标数据
   * @prop {boolean} require 可选, 值不为空才检测
   * @prop {type} format 使用链式表达式检查，可选
   * @prop {function} callback 默认验证结果处置方法，可选，参数faults为没通过的项的集合
   * @returns {boolean} 是否验证通过
   * @example
   * checkItem({value:'password1', format: string.password.eq:'password2'})
   */
    checkItem(option: Item): boolean {
        let passed = false;
        const cb = option.callback, val = option.value,
            hasVal = !val || (typeof val === 'string' && val.trim() === '');     

        if(hasVal && option.require) return true;

        if (val && option.format) {
            let checkeds: boolean[] = [], faults: string[] = [], rs:boolean;

            option.format.__caches.forEach(t => {
                if (t instanceof Object) {
                    let key:rulesName = <rulesName>Object.keys(t)[0], args:any[] = t[key];

                    rs = this.check(val, key, ...args);
                    if (rs === false) faults.push(key);          
                } else {
                    rs = this.check(val, t);
                    if (rs === false) faults.push(t);
                }               
                checkeds.push(rs);
            });

            if (typeof cb === 'function') cb(faults); // 执行回调
            if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
        }

        return passed;
    }

    /**
     * 多项组合规则验证
     * @param {array} items 组对象
     * @returns {boolean} 是否验证通过
     */
    checkItems(items: Item[]): boolean {
        let passed = false, checkeds: boolean[] = [];

        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                if (item instanceof Object && item.hasOwnProperty('value')) checkeds.push(this.checkItem(item));
                else throw new TypeError('验证组内容不合要求!');
            });
            if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
        }
        return passed;
    }

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

        const checkValue = (dt: string | number | T, rule: ChainInterface, p: (string | number)[]) => {
            let item = {
                value: dt,
                format: rule,
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
        const findMany = (path: (string | number)[], rule: ChainInterface): void => {
            let ids: number[] = [],
                lastRight = path.slice(path.lastIndexOf(0) + 1);

            path.forEach((v, i) => {
                if (v === 0) ids.push(i);
            });

            const getMany = (n: number, pr?: number) => { // 递归取数据，生成路径集
                let left = path.slice(0, ids[n]), next = n + 1,
                    p: any[], dt: any, len: number;

                if (pr && left.lastIndexOf(0) > -1) left.splice(left.lastIndexOf(0), 1, pr);
                dt = objectPath(dataObj, left);
                len = (<(string | number)[]>dt).length;

                for (let j = 0; j < len; j++) { // 循环数据列
                    p = lastRight ? left.concat(j, lastRight) : left.concat(j);
                    if (ids[next]) getMany(next, j);
                    else {
                        // console.log(objectPath.get(dataObj, p), p);
                        checkValue(objectPath(dataObj, p), rule, p);
                    }
                }
            };
            getMany(0);
        };
        const findData = (type: ChainInterface, path: (string | number)[]): void => { //匹配路径数据
            let dt: T = objectPath(dataObj, path);

            if (path.indexOf(0) > -1) findMany(path, type);
            else if (dt) {
                if (Array.isArray(dt)) dt.forEach((d, i) => {
                    checkValue(d, type, path.concat(i));
                });
                else checkValue(dt, type, path);
            } else {
                throw new TypeError(`要检查的目标数据，没有找到${path.join('.')}的关联属性！`);
            }
        };
        const itemCheck = (types: any, path: (string | number)[]): void => {
            Object.keys(types).forEach(key => {                
                let p = path.concat(), t: any;
                const datatype = types[key];

                p.push(key);
                if (Array.isArray(datatype) && datatype.length > 0) {
                    t = datatype[0];
                    p.push(0);
                } else {
                    t = datatype;
                }

                if (t instanceof Chain) findData(t, p);
                else itemCheck(t, p);
            });
        };

        itemCheck(struct, []);
        if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
        return passed;
    }
}
