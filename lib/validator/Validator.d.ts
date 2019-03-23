import { rulesName, RuleFunction } from './rules';
import { ChainInterface } from './Chain';
export { RuleFunction };
export interface Item {
    value: any;
    format?: ChainInterface;
    require?: boolean;
    callback?: (faults: string[]) => void;
}
export default class Validator {
    readonly type: ChainInterface;
    check(value: any, ruleName?: rulesName, ...args: any[]): boolean;
    checkItem(option: Item): boolean;
    checkItems(items: Item[]): boolean;
    checkJSON<T extends {}>(JSONData: string | T, struct: T, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
}
