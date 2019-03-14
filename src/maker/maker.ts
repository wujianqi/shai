import { rules, RuleFunction, RulesInterface } from './rules';
import SpecificRules, { SettingOption, SpecificRulesInterface } from './SpecificRules';

type ruleType = RegExp | RuleFunction;
type rulesType = RulesInterface & SpecificRulesInterface;

export { SettingOption }

/**
 * @class 数据生成、模拟
 */
export default class Maker {
    private __specificRules:SpecificRules;
    private __rules: rulesType;

    constructor(option?:SettingOption) {
        let newrules = (<any>Object).assign({}, rules);

        this.__specificRules = new SpecificRules(option);
        this.__rules = (<any>Object).assign(newrules, this.__specificRules.map);

    }
    
    /**
     * 重置自增长基数
     */
    set increment(num: number) {
        this.__specificRules.increment = num;
    }    

    /**
     * 扩展规则
     * @param arg  参数字符串或规则集合对象
     * @param value 值，第一个参数为键字符串时使用
     */
    addRule(arg: string | RulesInterface, value?: ruleType): void {
        if (typeof arg === 'string' && value) this.__rules[arg] = value;
        else if (typeof arg === 'object' && Object.prototype.toString.call(arg) === '[object Object]'){
            (<any>Object).assign(this.__rules, arg);
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
    * 生成模拟数据
    * @param {string} [ruleStr] 方法属性名
    * @returns {string | number | boolean} 返回模拟数据
    * @example
    * get('md5');
    */
    get(methodName: string, ...args: any[]): string | number | boolean {
        let result = '';

        const rule = this.__rules[methodName];
        if (rule) {
            if (rule instanceof RegExp) result = rules.exp(rule);
            else result = <string>rule(...args);
        } else throw new Error(`没有找到“${methodName}”相关生成数据的方法！`);

        return result;
    }

    private parseTPL(content: string): string {
        return content.replace(/#([^#\n\r]+)#/g, ($0, $1): any => {
            if ($1.indexOf(',') > -1) {
                let args = $1.trim().split(',');

                if (args.length > 0) {
                    if (args.length > 1) {
                        args.forEach((arg: any, i: number) => {
                            if (/^(\-|\+)?\d+(\.\d+)?$/.test(arg)) args[i] = parseFloat(arg);
                            else if (typeof args[i] === 'boolean') args[i] = Boolean(args[i]);
                        });
                    }
                    return this.get(args.shift(), ...args);
                }

            } else {
                return this.get($1);
            }
        })
    }

    /**
   * JSON数据生成模板解析
   * @param {string} content json字符串，通过##嵌套数据类型，多参数可使用逗号隔开如#int,10,20#
   * @param {number} n1 生成对象数目，生成数组字符串，可选
   * @param {number} n2 为随机数目上限，结合参数2使用，无此参数则不随机数目，可选
   * @returns {string} 替换数据后的json字符串
   */
    make(content: string, n1?: number, n2?: number): string {
        let jsonstr, num;

        if (typeof n1 === 'number' && typeof n2 === 'number') num =rules.int(n1, n2);
        else num = n1;
        if (typeof num === 'number') {
            let list = [], i;

            for (i = 0; i < num; i++) list.push(this.parseTPL(content));
            jsonstr = '[' + list.join(',') + ']';
        } else jsonstr = this.parseTPL(content);
        return jsonstr;
    }

}

