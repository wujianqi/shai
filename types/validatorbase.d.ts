import Base, { RuleFunc, Rules, BaseInterface } from './base';
export interface ValidRuleFunc extends RuleFunc {
    (value: string | number, ...values: (string | number | boolean)[]): boolean;
}
export interface ValidRules extends Rules {
    [key: string]: RegExp | ValidRuleFunc;
}
export interface ValidatorBaseInterface extends BaseInterface {
    addRule(arg: string | ValidRules, value?: RegExp | ValidRuleFunc): void;
    readonly type: any;
}
export default class ValidatorBase extends Base implements ValidatorBaseInterface {
    protected chain: {
        new (): {
            __caches: any[];
        };
    };
    private addProp(key, map);
    readonly type: any;
    addRule(arg: string | ValidRules, value?: RegExp | ValidRuleFunc): void;
    constructor();
}
