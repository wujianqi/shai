import Division from './Division';
import { RuleFunction } from './rules';
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
}
export default class SpecificRules {
    private config;
    private is8b;
    private getRndTime;
    protected baseIncrement: number;
    protected division: Division;
    constructor(option?: SettingOption);
    increment: number;
    map: SpecificRulesInterface;
}
