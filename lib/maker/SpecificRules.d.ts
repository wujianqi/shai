import { RuleFunction, RulesInterface, baseRuleName } from './rules';
declare type rulesName = baseRuleName | 'increment' | 'datetime' | 'date' | 'time' | 'year' | 'hour' | 'phone' | 'zipcode' | 'province' | 'prefecture' | 'county' | 'bodycard' | 'autocard' | 'lon' | 'lat' | 'company' | 'address' | 'custom';
export { RuleFunction, RulesInterface, rulesName };
export interface SettingOption {
    'divisionCode'?: string;
    'beginTime'?: Date;
    'endTime'?: Date;
}
export interface SpecificRulesInterface {
    [key: string]: RegExp | RuleFunction;
    increment(arg1?: number, arg2?: number): string;
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
    address(): string;
    company(): string;
    lon(): string;
    lat(): string;
    custom(key: string): string | number | boolean;
}
export default class SpecificRules {
    private config;
    private baseIncrement;
    private is8b;
    private getRndTime;
    private division;
    protected __methods: {
        [key: string]: {
            'fn': RuleFunction;
            'args'?: any[];
        };
    };
    protected __rules: SpecificRulesInterface & RulesInterface;
    add(key: string, makeFunc: RuleFunction): void;
    increment: number;
    private maps;
    constructor(option?: SettingOption);
}
