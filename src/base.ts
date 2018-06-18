export interface RuleFunc {
    (...values: (boolean | string | number)[]): boolean | string | number;
}

export interface Rules {
    [key: string]: RegExp | RuleFunc;
}

export interface BaseInterface {
    addRule(key: string, value: RegExp | RuleFunc): void;
    addRules(option: Rules): void;
    getRule(key: string): RegExp | RuleFunc;
}

/**
 * @class 正则、方法规则集合基类
 */
export default class Base implements BaseInterface {
    protected ruleMap: Rules = {};

    /**
     * 扩展规则
     * @param key 规则属性名
     * @param value 规则值，正则或函数
     */
    addRule(key: string, value: RegExp | RuleFunc): void {
        this.ruleMap[key] = value;
    }

    /**
     * 多规则扩展
     * @param option 规则对象集合
     */
    addRules(option: Rules): void {
        (<any>Object).assign(this.ruleMap, option);
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
        this.addRules = this.addRules.bind(this);
        this.getRule = this.getRule.bind(this);
    }

}