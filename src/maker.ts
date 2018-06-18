import Base from './base';
import { util } from './util';
import * as RandExp from 'randexp';
import * as md5 from 'md5';

export interface MakerInterface {
    get(methodName: string, ...args: (string | number | boolean)[]): string | number | boolean;
    make(content: string, n1?: number, n2?: number): string;
    increment: number;
}

export default class Maker extends Base implements MakerInterface {
    protected baseIncrement: number = 0;

    /**
    * 生成模拟数据
    * @param {string} [ruleStr] 方法属性名
    * @returns {string | number | boolean} 返回模拟数据
    * @example
    * get('md5');
    */
    get(methodName: string, ...args: (string | number | boolean)[]): string | number | boolean {
        let result = '';

        const rule = this.getRule(methodName);
        if (rule) {
            if (rule instanceof RegExp) result = new RandExp(rule).gen();
            else result = rule.apply(this, args);
        } else throw new Error(`没有找到“${methodName}”相关生成数据的方法！`);

        return result;
    }

    private parseTPL(content: string): string {
        return content.replace(/#([^#\n\r]+)#/g, ($0, $1): any => {
            let args = $1.trim().split(',');

            if (args.length > 1) {
                args.forEach((arg: any, i: number) => {
                    if (/^(\-|\+)?\d+(\.\d+)?$/.test(arg)) args[i] = parseFloat(arg);
                    else if (typeof args[i] === 'boolean') args[i] = Boolean(args[i]);
                });
            }
            return this.get.apply(this, args);
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

        if (typeof n1 === 'number' && typeof n2 === 'number') num = util.getInt(n1, n2);
        else num = n1;
        if (typeof num === 'number') {
            let list = [], i;

            for (i = 0; i < num; i++) list.push(this.parseTPL(content));
            jsonstr = '[' + list.join(',') + ']';
        } else jsonstr = this.parseTPL(content);
        return jsonstr;
    }

    /**
     * 重置自增长基数
     */
    set increment(num: number) {
        this.baseIncrement = num;
    }

    constructor() {
        super();

        this.addRules({
            increment(arg1 = 1, arg2?): string {
                this.baseIncrement += arg1;
                return arg2 ? (Array(arg2).join('0') + this.baseIncrement).slice(-arg2) : this.baseIncrement;
            },
            md5(arg = new Date().getTime(), isshorter: boolean = true): string {
                const value = arg.toString();
                return isshorter ? md5(value).substr(8, 16) : md5(value);
            },
            uuid(arg: string = '-'): string {
                let d = new Date().getTime();
                const s = !arg ? arg : '',
                    str = 'xxxxxxxx' + s + 'xxxx' + s + '4xxx' + s + 'yxxx' + s + 'xxxxxxxxxxxx',
                    uuid = str.replace(/[xy]/g, function (c) {
                        const r = (d + Math.random() * 16) % 16 | 0;

                        d = Math.floor(d / 16);
                        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
                    });

                return uuid;
            },
            now(arg?: string): string {
                return util.formatDate(new Date(), (arg ? arg : 'yyyy-MM-dd hh:mm:ss'));
            },
            exp(arg?: string): string {
                return new RandExp(typeof arg === 'string' ? new RegExp(arg) : /.+/).gen();
            }
        });

        this.get = this.get.bind(this);
        this.make = this.make.bind(this);
    }
}