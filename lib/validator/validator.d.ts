import { ChainInterface } from "./chainResult";
import { RuleFunction } from "./rules";
import { MessageInfo } from "./message";
export { RuleFunction, ChainInterface };
export interface ValidSettingOption {
    isdev?: boolean;
    message?: MessageInfo;
}
export interface ValidatorInterface {
    new (option?: ValidSettingOption): this;
    check(value: any): ChainInterface;
    check(value: object, path: string | number | Array<string | number>): ChainInterface;
    readonly string: ChainInterface;
    readonly number: ChainInterface;
    readonly boolean: ChainInterface;
    readonly array: ChainInterface;
    readonly object: ChainInterface;
    readonly null: ChainInterface;
    add(key: string, func: RuleFunction, msg?: string): void;
    checkItems(chains: ChainInterface[]): boolean;
    verify(JSONData: string | object, struct: object, callback?: (faults: MessageInfo, path: (string | number)[]) => void): boolean;
}
export default class Validator {
    constructor(option?: ValidSettingOption);
    add(key: string, func: RuleFunction, msg?: string): void;
    readonly string: ChainInterface;
    readonly number: ChainInterface;
    readonly object: ChainInterface;
    readonly array: ChainInterface;
    readonly boolean: ChainInterface;
    readonly null: ChainInterface;
    check(data: any, path?: string | number | Array<string | number>): ChainInterface;
    checkItems(chains: ChainInterface[]): boolean;
    verify(JSONData: string | object, struct: object, callback?: (faults: MessageInfo, path: (string | number)[]) => void): boolean;
}
