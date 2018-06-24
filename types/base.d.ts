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
export default class Base implements BaseInterface {
    protected ruleMap: Rules;
    protected isObject: (value: any) => value is object;
    addRule(arg: string | Rules, value?: RegExp | RuleFunc): void;
    getRule(key: string): RegExp | RuleFunc;
    constructor();
}
