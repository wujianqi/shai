import { MakerSetting, RuleFunction, rulesName } from "./specificRules";
export { MakerSetting, RuleFunction as MethodFuction };
export interface IMaker {
    setting: MakerSetting;
    add(key: string, func: RuleFunction): void;
    get(methodName: rulesName, ...args: any[]): string | number | boolean;
    get(methodName: "custom", arg2: RuleFunction): string | number | boolean;
    get(methodName: "custom", arg2: string, ...args: any[]): string | number | boolean;
    make(content: string | object, parseValueType?: string | boolean, optionKey?: string): object;
}
export declare const maker: IMaker;
