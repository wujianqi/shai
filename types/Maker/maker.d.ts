import { RuleFunction, RulesInterface } from './rules';
import { SettingOption } from './SpecificRules';
declare type ruleType = RegExp | RuleFunction;
export { SettingOption };
export default class Maker {
    private __specificRules;
    private __rules;
    constructor(option?: SettingOption);
    increment: number;
    addRule(arg: string | RulesInterface, value?: ruleType): void;
    getRule(key: string): ruleType;
    get(methodName: string, ...args: any[]): string | number | boolean;
    private parseTPL;
    make(content: string, n1?: number, n2?: number): string;
}
