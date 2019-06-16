import { RuleFunction, RulesMap, RulesInterface } from "./rules";
declare type rulesName = keyof RulesMap | keyof SpecificRulesMap;
export { RuleFunction, rulesName };
export interface MakerSetting {
    divisionCode?: string | number;
    beginTime?: Date;
    endTime?: Date;
    incrementBase?: number;
}
export interface SpecificRulesMap {
    increment(arg1?: boolean, arg2?: number): number;
    datetime(arg?: string): string;
    date(): string;
    time(): string;
    year(): string;
    citycode(): string;
    province(): string;
    prefecture(): string;
    county(): string;
    phone(): string;
    zipcode(): string;
    bodycard(): string;
    autocard(): string;
    road(): string;
    build(): string;
    address(): string;
    company(): string;
    lon(): string;
    lat(): string;
    custom(key: string | RuleFunction, ...args: Array<any>): string | number | boolean;
}
export declare var config: {
    divisionCode: string;
    beginTime: Date;
    endTime: Date;
    incrementBase: number;
};
export declare function add(key: string, makeFunc: RuleFunction): void;
export default class SpecificRules {
    private history;
    private __rules;
    private division;
    private readonly getRndTime;
    readonly rules: RulesInterface & SpecificRulesMap;
    reload(): void;
    private maps;
}
