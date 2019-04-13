import { RuleFunction, RulesMap } from './rules';
import { ChainInterface } from './chain';
declare type rulesName = keyof RulesMap;
export { RuleFunction };
export interface Item {
    value: any;
    format?: ChainInterface;
    require?: boolean;
    callback?: (faults: string[]) => void;
}
export default class Validator {
    private __methods;
    private __rules;
    constructor();
    add(key: string, func: RuleFunction): void;
    readonly string: ChainInterface;
    readonly number: ChainInterface;
    readonly object: ChainInterface;
    readonly array: ChainInterface;
    readonly boolean: ChainInterface;
    readonly null: ChainInterface;
    check(value: any, ruleName?: rulesName, ...args: any[]): boolean;
    checkItem(option: Item): boolean;
    checkItems(items: Item[]): boolean;
    verify(JSONData: string | object, struct: object, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
}
