import Validator, { Item, ValidChain, ValidatorInterface } from './validator';
export interface JSONItem extends Item {
    null?: boolean;
    boolean?: boolean;
    string?: boolean;
    number?: boolean;
    array?: boolean;
    object?: boolean;
}
export interface JSONChain extends ValidChain {
    null?: ValidChain;
    boolean?: ValidChain;
    string?: ValidChain;
    number?: ValidChain;
    array?: ValidChain;
    object?: ValidChain;
}
export interface JsonValidatorInterface extends ValidatorInterface {
    readonly type: JSONChain;
    checkItem(options: JSONItem): boolean;
    checkItems(items: JSONItem[]): boolean;
    checkJSON(JSONStr: string, struct: any, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
}
export default class JSONValidator extends Validator implements JsonValidatorInterface {
    checkJSON(JSONStr: string, struct: any, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
    constructor();
}
