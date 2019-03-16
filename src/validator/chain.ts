import { RulesInterface } from './rules';

/**
 * @interface 验证规则链，扩展新规则，可继承本接口
 */
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
    readonly aeo?: this;
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
    not?(...args: (string | number | Date)[]): this;
    eq?(...args: (string | number | Date)[]): this;
    gt?(...args: (string | number | Date)[]): this;
    gte?(...args: (string | number | Date)[]): this;
    lt?(...args: (string | number | Date)[]): this;
    lte?(...args: (string | number | Date)[]): this;
    between?(...args: (string | number | Date)[]): this;
    min?(...args: (string | number | Date)[]): this;
    max?(...args: (string | number | Date)[]): this;
    in?(...args: (string | number)[]): this;
    length?(...args: (string | number)[]): this;
    minlength?(...args: (string | number)[]): this;
    maxlength?(...args: (string | number)[]): this;
}

/**
 * @class 验证链
 */
export class Chain implements ChainInterface{
    /**
     * 缓存规则名称
     */
    __caches: any[] = [];

    static addProp(key: string, rules: RulesInterface): void {
        if (Chain.prototype.hasOwnProperty(key)) return;
        
        let prop: { [key: string]: any } = {
                enumerable: true
            }, rule = rules[key];            

            if (rule instanceof RegExp || (typeof rule === 'function' && rule.length === 1)) {
                prop['get'] = function () {
                    this.__caches.push(key);
                    return this;
                }
            } else if (typeof rule === 'function') {
                prop['value'] = function (...args: (string | number| Date)[]) {
                    let obj: any = {};

                    obj[key] = args;
                    this.__caches.push(obj);
                    return this;
                }
            }

        Object.defineProperty(Chain.prototype, key, prop);
    }

}
