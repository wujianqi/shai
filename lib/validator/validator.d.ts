import { RuleFunction, ChainInterface, OnFaultsFunction, CallbackFunction } from './chain';
export { RuleFunction, OnFaultsFunction, CallbackFunction };
export default class Validator {
    private methods;
    private newrule;
    add(key: string, func: RuleFunction): void;
    readonly string: ChainInterface;
    readonly number: ChainInterface;
    readonly object: ChainInterface;
    readonly array: ChainInterface;
    readonly boolean: ChainInterface;
    readonly null: ChainInterface;
    check(value: any): ChainInterface;
    get(obj: object, path: Array<number | string> | number | string): ChainInterface;
    verify(JSONData: string | object, struct: object, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
}
