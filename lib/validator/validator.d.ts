import { IChain } from "./chainResult";
import { RuleFunction } from "./rules";
import { MessageInfo } from "./message";
export { RuleFunction, IChain };
export interface ValidSetting {
    isdev?: boolean;
    message?: MessageInfo;
}
export interface IValidator {
    setting: ValidSetting;
    check(value: any): IChain;
    check(value: object, path: string | number | Array<string | number>): IChain;
    readonly string: IChain;
    readonly number: IChain;
    readonly boolean: IChain;
    readonly array: IChain;
    readonly object: IChain;
    readonly null: IChain;
    add(key: string, func: RuleFunction, msg?: string): void;
    checkItems(chains: IChain[]): boolean;
    verify(JSONData: string | object, struct: object, callback?: (faults: MessageInfo, path: (string | number)[]) => void): boolean;
}
export declare const validator: IValidator;
