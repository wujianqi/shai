import { RulesInterface, RuleFunction } from './rules';
import Chain from './chain';
declare type ruletype = RegExp | RuleFunction;
export interface Item {
    value: any;
    callback?: (faults: string[]) => void;
    rule?: Chain;
    [key: string]: any;
}
export declare const Validator: {
    addRule(arg: string | RulesInterface<ruletype>, value?: RegExp | RuleFunction | undefined): void;
    getRule(key: string): ruletype;
    readonly type: Chain;
    check(value: any, rn?: string, ...args: any[]): boolean;
    checkItem(options: Item): boolean;
    checkItems(items: Item[]): boolean;
    checkJSON<T extends {}>(JSONData: string | T, struct: T, callback?: ((faults: string[], path: (string | number)[]) => void) | undefined): boolean;
};
export {};
