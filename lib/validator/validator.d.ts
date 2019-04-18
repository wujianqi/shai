import { RuleFunction, ChainInterface, OnFaultsFunction, CallbackFunction } from './chain';
export { RuleFunction, ChainInterface, OnFaultsFunction, CallbackFunction };
export default class Validator {
    private methods;
    private newrule;
    isdev: boolean;
    add(key: string, func: RuleFunction): void;
    readonly string: ChainInterface;
    readonly number: ChainInterface;
    readonly object: ChainInterface;
    readonly array: ChainInterface;
    readonly boolean: ChainInterface;
    readonly null: ChainInterface;
    check(data: any, path?: Array<number | string> | number | string): ChainInterface;
    checkItems(chains: ChainInterface[]): boolean;
    verify(JSONData: string | object, struct: object, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
}
