import Validator, { Item, ValidChain, ValidatorInterface } from './validator';
export interface DataItem extends Item {
    null?: boolean;
    boolean?: boolean;
    string?: boolean;
    number?: boolean;
    array?: boolean;
    object?: boolean;
    rule?: DataChain;
}
export interface DataChain extends ValidChain {
    null?: ValidChain;
    boolean?: ValidChain;
    string?: ValidChain;
    number?: ValidChain;
    array?: ValidChain;
    object?: ValidChain;
}
export interface DataValidatorInterface extends ValidatorInterface {
    readonly type: DataChain;
    checkItem(options: DataItem): boolean;
    checkItems(items: DataItem[]): boolean;
    checkJSON<T extends {}>(JSONData: string | T, struct: T, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
}
export default class DataValidator extends Validator implements DataValidatorInterface {
    checkJSON<T extends {}>(JSONData: string | T, struct: T, callback?: (faults: string[], path: (string | number)[]) => void): boolean;
    constructor();
}
