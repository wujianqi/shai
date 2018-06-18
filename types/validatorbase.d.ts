import Base, { BaseInterface } from './base';
export interface ValidRuleFunc {
    (value: string | number, ...values: (string | number)[]): boolean;
}
export interface ValidRules {
    [key: string]: RegExp | ValidRuleFunc;
}
export interface ValidatorBaseInterface extends BaseInterface {
    addRule(key: string, value: RegExp | ValidRuleFunc): void;
    addRules(option: ValidRules): void;
    readonly type: any;
}
export default class ValidatorBase extends Base implements ValidatorBaseInterface {
    protected chain: {
        new (): {
            __caches: any[];
        };
    };
    private addProp;
    readonly type: any;
    addRule(key: string, value: RegExp | ValidRuleFunc): void;
    addRules(option: ValidRules): void;
    constructor();
}
