import { MakerSetting, MakeFunction, rulesName } from './specificRules';
export { MakerSetting, MakeFunction, rulesName as MethodNames, };
declare function get(methodName: rulesName, ...args: any[]): string | number | boolean;
declare function get(methodName: 'custom', arg2: MakeFunction): string | number | boolean;
declare function get(methodName: 'custom', arg2: string, ...args: any[]): string | number | boolean;
export declare const maker: {
    setting: MakerSetting;
    add(key: string, makeFunc: MakeFunction): void;
    get: typeof get;
    toJSON(content: string | object, parseValueType?: string | boolean, optionKey?: string): string;
    make(content: string | object, parseValueType?: string | boolean, optionKey?: string): object;
};
