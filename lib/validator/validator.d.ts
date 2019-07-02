import { ChainConstructor } from './chainResult';
import { MessageInfo } from './message';
import { ValidFunction } from './rules';
import { group } from './chainUtil';
export { ValidFunction, ChainConstructor };
export interface ValidSetting {
    isdev?: boolean;
    message?: MessageInfo;
}
declare function check(value: any): ChainConstructor;
declare function check(value: object, path: string | number | (string | number)[]): ChainConstructor;
export declare const validator: {
    setting: ValidSetting;
    add(key: string, func: ValidFunction, msg?: string): void;
    readonly string: ChainConstructor;
    readonly number: ChainConstructor;
    readonly object: ChainConstructor;
    readonly array: ChainConstructor;
    readonly boolean: ChainConstructor;
    readonly null: ChainConstructor;
    check: typeof check;
    group: typeof group;
};
