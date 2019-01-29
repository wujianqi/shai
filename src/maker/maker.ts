import { util } from './util';
import RandExp = require('randexp');
import { Rules, RuleFunction, RulesInterface } from './rules';
import Division from './division';

import names from './names.json';
import regions from './regions.json';

type ruletype = RegExp | RuleFunction;

export interface MakerConfig {
    'divisionCode'?: string;
    'beginTime'?: Date;
    'endTime'?: Date;
}

/**
 * @class 数据生成、模拟
 */
export default class Maker{
    private config = {
        'divisionCode': new RandExp(/1[1-5]|2[1-3]|3[3-7]|4[1-6]|5[1-4]|6[1-5]/).gen() + '0000',
        'beginTime': new Date('1970/01/01'),
        'endTime': new Date()
    };
    private is8bit: string[] = [ // 电话号码 8位
        '010', '021', '022', '023', '024', '025', '027', '028', '029', '020', '0311', '0371', '0377',
        '0379', '0411', '0451', '0512', '0513', '0516', '0510', '0531', '0532', '0571', '0574', '0577',
        '0591', '0595', '0755', '0757', '0769', '0898', '0431'
    ];
    private getRndTime = () => {
        let bt = this.config.beginTime ? this.config.beginTime : new Date('1970/01/01'),
            et = this.config.endTime ? this.config.endTime : new Date();
        return new Date(util.getInt(bt.getTime(), et.getTime()));
    };
    private stateIndex: number = -1;
    protected baseIncrement: number = 0;
    protected rules:RulesInterface<ruletype> = Rules;
    protected division:Division;

    /**
     * 扩展规则
     * @param arg  参数字符串或规则集合对象
     * @param value 值，第一个参数为键字符串时使用
     */
    addRule(arg: string | RulesInterface<ruletype>, value?: ruletype): void {
        if (typeof arg === 'string' && value) this.rules[arg] = value;
        else if (typeof arg === 'object' && Object.prototype.toString.call(arg) === '[object Object]'){
            (<any>Object).assign(this.rules, arg);
        }         
    }

    /**
     * 取规则对象
     * @param key 规则属性名
     */
    getRule(key: string): ruletype {
        return this.rules[key];
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

        const rule = Rules[methodName];
        if (rule) {
            if (rule instanceof RegExp) result = new RandExp(rule).gen();
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

    constructor(option?:MakerConfig) {
        (<any>Object).assign(this.config, option);

        this.division = new Division(this.config.divisionCode, regions);
        this.addRule({
            'increment': (arg1: number = 1, arg2?: number): string => {
                this.baseIncrement += arg1;
                return (arg2 ? (Array(arg2).join('0') + this.baseIncrement).slice(-arg2) : this.baseIncrement) + '';
            },
            'datetime': (arg: string) => util.formatDate(this.getRndTime(), (arg ? arg : 'yyyy-MM-dd hh:mm:ss')),
            'date': () => util.formatDate(this.getRndTime(), 'yyyy-MM-dd'),
            'time': () => util.formatDate(this.getRndTime(), 'hh:mm:ss'),
            'year': () => +util.formatDate(this.getRndTime(), 'yyyy'),
            
            'enState': () => {
                if (this.stateIndex > -1) return names.eStates[this.stateIndex];
                else {
                    let nm = util.getItem(names.eStates);

                    this.stateIndex = names.eStates.indexOf(nm);
                    return nm;
                }
            },
            'cnState': () => {
                if (this.stateIndex > -1) return names.cStates[this.stateIndex];
                else {
                    let nm = util.getItem(names.cStates);

                    this.stateIndex = names.cStates.indexOf(nm);
                    return nm;
                }
            },
            'citycode':() => this.division.division.county,
            'province':() => this.division.region().province,
            'prefecture':() => this.division.region().prefecture,
            'county':() => this.division.region().county,
            'phone':() => {
                let cd = this.division.region(1).county, ps;

                if (this.is8bit.indexOf(cd) > -1) ps = cd + '-' +  new RandExp(/[268]\d{7}/).gen();
                else ps = cd + '-' +  new RandExp(/[268]\d{6}/).gen();
                return ps;
            },
            'zipcode': () => this.division.region(2).county,
            'bodycard': () => {
                const sn = this.division.division.county + util.formatDate(this.getRndTime(), 'yyyyMMdd') + new RandExp(/\d{3}/).gen(),
                    arr = sn.split(''),
                    factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                    parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                let sum = 0, ai = 0, wi = 0;

                for (let i = 0; i < 17; i++) {
                    ai = + arr[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                return sn + parity[sum % 11];
            },
            'autocard': () => {
                let card = this.division.region(5).prefecture,
                    ps: any = { '京': '[ACE-J]', '沪': '[A-E]', '津': '[A-DFG]' },
                    pf = card.length === 1 ? new RandExp(ps.hasOwnProperty(card) ? ps[card] : /[A-C]/).gen() : card;

                return pf + new RandExp(/\d{3}[A-HJ-NP-UW-Z]{2}|[A-HJ-NP-UW-Z]\d{4}/).gen();
            },
            'address': () => {
                return this.division.region(0).county.replace('县', '县城')
                    + util.getItem(names.road) + this.get('exp', '(路|街)(1\\d{3}|[1-9]\\d{2})号')
                    + util.getItems(names.commonWord, 2).join('')
                    + util.getItem(names.buildNature)
                    + this.get('exp', '[A-F]栋((一|二|三)单元)?[1-9]0[1-5]室');
            },
            'company': () => {
                return this.division.region().prefecture
                    + util.getItems(names.commonWord, 2).join('')
                    + util.getItem(names.companyNature) + '有限公司';
            },
            'lon': () => this.division.region(3).county + this.get('exp', '\\d{8}'),
            'lat': () => this.division.region(4).county + this.get('exp', '\\d{8}')
        });

    }
}

