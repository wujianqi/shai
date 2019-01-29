import { Rules, RuleFunction } from './rules';

/**
 * @class 验证链
 */
export default class Chain {
    /**
     * 缓存规则名称
     */
    caches: any[] = [];

    /*
    constructor() {
        Object.keys(ValidRules).forEach(k => this.addProp(k));
    }
    */

    static addProp(key: string): void {
        let prop: { [key: string]: any } = {},
            rule = Rules[key];

        if (rule instanceof RegExp || (<RuleFunction>rule).length === 1) {
            prop['get'] = function () {
                this.caches.push(key);
                return this;
            }
        } else {
            prop['value'] = function (...args: (string | number)[]) {
                let obj: any = {};

                obj[key] = args;
                this.caches.push(obj);
                return this;
            }
        }
        Object.defineProperty(Chain.prototype, key, prop);
    }


    get string() {
        this.caches.push('string');
        return this;
    }
    get number() {
        this.caches.push('number');
        return this;
    }
    get boolean() {
        this.caches.push('boolean');
        return this;
    }
    get object() {
        this.caches.push('object');
        return this;
    }
    get array() {
        this.caches.push('array');
        return this;
    }
    get null() {
        this.caches.push('null');
        return this;
    }
    get require() {
        this.caches.push('require');
        return this;
    }
    get english() {
        this.caches.push('english');
        return this;
    }
    get qq() {
        this.caches.push('qq');
        return this;
    }
    get age() {
        this.caches.push('age');
        return this;
    }
    get zipcode() {
        this.caches.push('zipcode');
        return this;
    }
    get ip() {
        this.caches.push('ip');
        return this;
    }
    get port() {
        this.caches.push('port');
        return this;
    }
    get bizcode() {
        this.caches.push('bizcode');
        return this;
    }
    get invoice() {
        this.caches.push('invoice');
        return this;
    }
    get bankcard() {
        this.caches.push('bankcard');
        return this;
    }
    get aeo() {
        this.caches.push('aeo');
        return this;
    }
    get currency() {
        this.caches.push('currency');
        return this;
    }
    get float() {
        this.caches.push('float');
        return this;
    }
    get int() {
        this.caches.push('int');
        return this;
    }
    get decimal() {
        this.caches.push('decimal');
        return this;
    }
    get chinese() {
        this.caches.push('chinese');
        return this;
    }
    get mail() {
        this.caches.push('mail');
        return this;
    }
    get url() {
        this.caches.push('url');
        return this;
    }
    get account() {
        this.caches.push('account');
        return this;
    }
    get password() {
        this.caches.push('password');
        return this;
    }
    get safe() {
        this.caches.push('safe');
        return this;
    }
    get dbc() {
        this.caches.push('dbc');
        return this;
    }
    get hex() {
        this.caches.push('hex');
        return this;
    }
    get color() {
        this.caches.push('color');
        return this;
    }
    get ascii() {
        this.caches.push('ascii');
        return this;
    }
    get base64() {
        this.caches.push('base64');
        return this;
    }
    get md5() {
        this.caches.push('md5');
        return this;
    }
    get uuid() {
        this.caches.push('uuid');
        return this;
    }
    get mobile() {
        this.caches.push('mobile');
        return this;
    }
    get telphone() {
        this.caches.push('telphone');
        return this;
    }
    get phone() {
        this.caches.push('phone');
        return this;
    }
    get percent() {
        this.caches.push('percent');
        return this;
    }
    get year() {
        this.caches.push('year');
        return this;
    }
    get month() {
        this.caches.push('month');
        return this;
    }
    get day() {
        this.caches.push('day');
        return this;
    }
    get hour() {
        this.caches.push('hour');
        return this;
    }
    get minute() {
        this.caches.push('minute');
        return this;
    }
    get time() {
        this.caches.push('time');
        return this;
    }
    get date() {
        this.caches.push('date');
        return this;
    }
    get datetime() {
        this.caches.push('datetime');
        return this;
    }
    get file() {
        this.caches.push('file');
        return this;
    }
    get image() {
        this.caches.push('image');
        return this;
    }
    get word() {
        this.caches.push('word');
        return this;
    }
    get lon() {
        this.caches.push('lon');
        return this;
    }
    get lat() {
        this.caches.push('lat');
        return this;
    }
    get approval() {
        this.caches.push('approval');
        return this;
    }
    get citycode() {
        this.caches.push('citycode');
        return this;
    }
    get address() {
        this.caches.push('address');
        return this;
    }
    get upper() {
        this.caches.push('upper');
        return this;
    }
    get lower() {
        this.caches.push('lower');
        return this;
    }
    get even() {
        this.caches.push('even');
        return this;
    }
    get odd() {
        this.caches.push('odd');
        return this;
    }
    get ipv6() {
        this.caches.push('ipv6');
        return this;
    }
    get bodycard() {
        this.caches.push('bodycard');
        return this;
    }
    get autocard() {
        this.caches.push('autocard');
        return this;
    }
    not(...args: (string | number | Date)[]) {
        this.caches.push({not: args });
        return this;
    }
    eq(...args: (string | number | Date)[]) {
        this.caches.push({eq: args });
        return this;
    }
    gt(...args: (string | number | Date)[]) {
        this.caches.push({gt: args });
        return this;
    }
    gte(...args: (string | number | Date)[]) {
        this.caches.push({gte: args });
        return this;
    }
    lt(...args: (string | number | Date)[]) {
        this.caches.push({lt: args });
        return this;
    }
    lte(...args: (string | number | Date)[]) {
        this.caches.push({lte: args });
        return this;
    }
    between(...args: (string | number | Date)[]) {
        this.caches.push({between: args });
        return this;
    }
    min(...args: (string | number | Date)[]) {
        this.caches.push({min: args });
        return this;
    }
    max(...args: (string | number | Date)[]) {
        this.caches.push({max: args });
        return this;
    }
    in(...args: (string | number)[]) {
        this.caches.push({in: args });
        return this;
    }
    length(...args: (string | number)[]) {
        this.caches.push({length: args });
        return this;
    }
    minlength(...args: (string | number)[]) {
        this.caches.push({minlength: args });
        return this;
    }
    maxlength(...args: (string | number)[]) {
        this.caches.push({maxlength: args });
        return this;
    }
}