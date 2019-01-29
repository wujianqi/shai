import { Item } from './validator';
import Maker, { MakerConfig } from './Maker';
export { Item, MakerConfig };
export default class Shai {
    maker: Maker;
    validator: {
        addRule(arg: string | import("./validator/rules").RulesInterface<RegExp | import("./validator/rules").RuleFunction>, value?: RegExp | import("./validator/rules").RuleFunction | undefined): void;
        getRule(key: string): RegExp | import("./validator/rules").RuleFunction;
        readonly type: import("./validator/chain").default;
        check(value: any, rn?: string, ...args: any[]): boolean;
        checkItem(options: Item): boolean;
        checkItems(items: Item[]): boolean;
        checkJSON<T extends {}>(JSONData: string | T, struct: T, callback?: ((faults: string[], path: (string | number)[]) => void) | undefined): boolean;
    };
    constructor(opts?: MakerConfig);
}
