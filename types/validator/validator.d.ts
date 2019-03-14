import { RulesInterface, RuleFunction } from './rules';
import { ChainInterface } from './Chain';
declare type ruleType = RegExp | RuleFunction;
export interface Item {
    value: any;
    callback?: (faults: string[]) => void;
    rule?: ChainInterface;
    [key: string]: any;
}
export default class Validator {
    private __rules;
    constructor();
    addRule(arg: string | RulesInterface, value?: ruleType): void;
    getRule(key: string): ruleType;
    readonly type: ChainInterface;
    check(value: any, ruleName?: string, ...args: any[]): boolean;
    checkItem(options: Item): boolean;
    checkItems(items: Item[]): boolean;
    checkJSON<T extends {}>(JSONData: string | T, struct: T, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
}
export {};
