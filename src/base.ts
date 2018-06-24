export interface RuleFunc {
    (...values: (boolean | string | number)[]): boolean | string | number;
}

export interface Rules {
    [key: string]: RegExp | RuleFunc;
}

export interface BaseInterface {
    addRule(arg: string | Rules, value?: RegExp | RuleFunc): void;
    getRule(key: string): RegExp | RuleFunc;
}

/**
 * @class 正则、方法规则集合基类
 */
export default class Base implements BaseInterface {
    protected ruleMap: Rules = {};
    protected isObject = (value: any): value is object => {
        return typeof value === 'object' && Object.prototype.toString.call(value) === '[object Object]';
    };    

 
    /**
     * 扩展规则
     * @param arg  参数字符串或规则集合对象
     * @param value 值，第一个参数为键字符串时使用
     */
    addRule(arg: string | Rules, value?: RegExp | RuleFunc): void {
        if(typeof arg === 'string' && value) this.ruleMap[arg] = value;
        else if(this.isObject(arg))  (<any>Object).assign(this.ruleMap, arg);
    }

    /**
     * 取规则对象
     * @param key 规则属性名
     */
    getRule(key: string): RegExp | RuleFunc {
        return this.ruleMap[key];
    }

    constructor() {
        this.addRule = this.addRule.bind(this);
        this.getRule = this.getRule.bind(this);
    }

}