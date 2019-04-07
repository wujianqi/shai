import { rules, RuleFunction } from './rules';

export interface ChainInterface {
    __caches: any[];
    readonly string?: this;
    readonly number?: this;
    readonly boolean?: this;
    readonly object?: this;
    readonly array?: this;
    readonly null?: this;
    readonly require?: this;
    readonly english?: this;
    readonly qq?: this;
    readonly age?: this;
    readonly zipcode?: this;
    readonly ip?: this;
    readonly port?: this;
    readonly bizcode?: this;
    readonly invoice?: this;
    readonly bankcard?: this;
    readonly currency?: this;
    readonly float?: this;
    readonly int?: this;
    readonly decimal?: this;
    readonly chinese?: this;
    readonly mail?: this;
    readonly url?: this;
    readonly account?: this;
    readonly password?: this;
    readonly safe?: this;
    readonly dbc?: this;
    readonly hex?: this;
    readonly color?: this;
    readonly ascii?: this;
    readonly base64?: this;
    readonly md5?: this;
    readonly uuid?: this;
    readonly mobile?: this;
    readonly telphone?: this;
    readonly phone?: this;
    readonly percent?: this;
    readonly year?: this;
    readonly month?: this;
    readonly day?: this;
    readonly hour?: this;
    readonly minute?: this;
    readonly time?: this;
    readonly date?: this;
    readonly datetime?: this;
    readonly file?: this;
    readonly image?: this;
    readonly word?: this;
    readonly lon?: this;
    readonly lat?: this;
    readonly approval?: this;
    readonly citycode?: this;
    readonly address?: this;
    readonly upper?: this;
    readonly lower?: this;
    readonly even?: this;
    readonly odd?: this;
    readonly ipv6?: this;
    readonly bodycard?: this;
    readonly autocard?: this;
    readonly empty?: this;
    not?(arg: string | number | Date): this;
    eq?(arg: string | number | Date): this;
    gt?(arg: string | number | Date): this;
    gte?(arg: string | number | Date): this;
    lt?(arg: string | number | Date): this;
    lte?(arg: string | number | Date): this;
    between?<T extends string | number | Date>(arg1: T, arg2: T): this;
    min?(...args: Array<string | number | Date>): this;
    max?(...args: Array<string | number | Date>): this;
    length?(arg: string | number): this;
    minlength?(arg: string | number): this;
    maxlength?(arg: string | number): this;
    in?(arg: string | number | any[] | {}): this;
    regexp?(arg: RegExp | string ): this;
    custom?(arg: RuleFunction ): this;
}

var props:PropertyDescriptorMap = {} , that:ChainInterface;

/**
 * @class 验证链
 */
export class Chain implements ChainInterface{
    /**
     * 缓存规则名称
     */
    __caches: any[] = [];
    constructor() {
        that = this;
    }
}

Object.keys(rules).forEach(key => {
    let rule = rules[key];

    if (rule instanceof RegExp || (typeof rule === 'function' && rule.length === 1)) {
        props[key] = {
            get: () => {
                that.__caches.push(key);
                return that;
            }
        }
    } else if (typeof rule === 'function') {
        props[key] = {
            value: (...args: any[]) => {
                let obj: any = {};

                obj[key] = args;
                that.__caches.push(obj);
                return that;
            }
        }
    }
});

Object.defineProperties(Chain.prototype, props);
