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
export default class Base implements BaseInterface {
    protected ruleMap: Rules;
    addRule(key: string, value: RegExp | RuleFunc): void;
    addRules(option: Rules): void;
    getRule(key: string): RegExp | RuleFunc;
    constructor();
}
