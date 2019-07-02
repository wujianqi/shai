import { MessageInfo } from './message';
declare type dataType = 'string' | 'number' | 'object' | 'array' | 'boolean';
export interface AsyncValidatorRule {
    type?: dataType;
    required?: boolean;
    message?: string;
    trigger?: string;
    validator?(rule: any, value: any, cb?: Function): boolean | Error;
}
export declare function getRule(ruleMap: any[], check: (type: string | (string | any[])[], value: any) => boolean | Promise<boolean>, onfaults: () => MessageInfo, requiredMessage: string, trigger?: string): AsyncValidatorRule[];
export {};
