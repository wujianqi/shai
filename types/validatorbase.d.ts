import Base, { RuleFunc, Rules, BaseInterface } from './base';
export interface ValidRuleFunc extends RuleFunc {
    (...values: any[]): boolean;
}
export interface ValidRules extends Rules {
    [key: string]: RegExp | ValidRuleFunc;
}
export interface Chain {
    readonly __caches: any[];
}
export interface ValidBaseInterface extends BaseInterface {
    readonly type: Chain;
    addRule(arg: string | ValidRules, value?: RegExp | ValidRuleFunc): void;
}
export default class ValidatorBase extends Base implements ValidBaseInterface {
    private chain;
    private addProp(key, map);
    readonly type: Chain;
    addRule(arg: string | ValidRules, value?: RegExp | ValidRuleFunc): void;
}
