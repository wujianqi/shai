import { rules, RulesInterface, RuleFunction} from './rules';
import { Chain, ChainInterface } from './Chain';
import * as objectPath from 'object-path';

type ruleType = RegExp | RuleFunction;

export interface Item {
    value: any;
    callback?: (faults: string[]) => void;
    rule?: ChainInterface;
    [key: string]: any;
};

/**
 * @module 验证器
 */
export default class Validator {
    private __rules: RulesInterface;

    constructor() {
        this.__rules = (<any>Object).assign({}, rules);
        Object.keys(this.__rules).forEach(k => Chain.addProp(k, this.__rules) );
    }

    /**
     * 扩展规则
     * @param arg  参数字符串或规则集合对象
     * @param value 值，第一个参数为键字符串时使用
     */
    addRule(arg: string | RulesInterface, value?: ruleType): void {        
        if (typeof arg === 'string' && value) {
            this.__rules[arg] = value;
            Chain.addProp(arg, this.__rules);
        } else if (rules.object(arg)) {
            (<any>Object).assign(this.__rules, arg);
            Object.keys(arg).forEach(k => Chain.addProp(k, this.__rules) );
        } 
    }

    /**
     * 取规则对象
     * @param key 规则属性名
     */
    getRule(key: string): ruleType {
        return this.__rules[key];
    }

    /**
     * 链式规则调用
     */
    get type(): ChainInterface {
        return new Chain();
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
    check(value: any, ruleName: string = 'require', ...args: any[]): boolean {
        let passed = false;

        const val = typeof value === 'string' ? value.trim() : value,
            rule = this.__rules[ruleName];

        if (rule) {
            if (rule instanceof RegExp) passed = rule.test(val + '');
            else passed = <boolean>rule(val, ...args);
        } else throw new Error(`没有找到“${ruleName}”相关验证规则！`);

        return passed;
    }

    /**
   * 单项组合规则验证，对象方式
   * @param {object} options 属性对象。
   * @prop {*} value 必备选项，验证目标数据
   * @prop {boolean} require 可选, 值不为空才检测
   * @prop {type} rule 使用链式表达式检查，可选
   * @prop {function} callback 默认验证结果处置方法，可选，参数faults为没通过的项的集合
   * @returns {boolean} 是否验证通过
   * @example
   * checkItem({value:'password1', password:true, eq:'password2'})
   */
    checkItem(options: Item): boolean {
        let passed = false, opts = options, cb, val = opts.value;
        const hasVal = (!val || (val + '').trim() === '');

        delete opts.value;
        if (opts.hasOwnProperty('callback') && opts.callback) { // 取回调
            cb = opts.callback;
            delete opts.callback;
        }

        if (opts.hasOwnProperty('rule') && opts.rule) { // 转换链式规则为动态属性
            opts.rule.__caches.forEach(t => {
                if (t instanceof Object) (<any>Object).assign(opts, t);
                else opts[t] = true;
            });
            delete opts.rule;
        }

        if (opts.hasOwnProperty('require') && !opts['require'] && hasVal) passed = true;
        else {
            let checkeds: boolean[] = [], faults: string[] = [], rs;

            Object.keys(opts).forEach(k => { // 取出动态属性规则
                const prop = opts[k];

                if (Array.isArray(prop)) rs = this.check(val, k, ...prop);
                else if (typeof prop === 'boolean') rs = this.check(val, k) && prop;
                else rs = this.check(val, k, prop);
                checkeds.push(rs);
                if (rs === false) faults.push(k);
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
                else throw new Error('验证组内容不合要求!');
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
        const findData = (type: ChainInterface, path: (string | number)[]): void => { //匹配路径数据
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
                let p = path.concat(), t: ChainInterface;
                const datatype = types[key];

                p.push(key);
                if (Array.isArray(datatype) && datatype.length > 0) {
                    t = datatype[0] as ChainInterface;
                    p.push(0);                   
                } else {
                    t = datatype as ChainInterface;                   
                }

                if (rules.object(t)) {
                    if (t.hasOwnProperty('__caches')) findData(t, p);
                    else itemCheck(t, p);
                }
            });
        };

        itemCheck(struct, []);
        if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
        return passed;
    }
}
