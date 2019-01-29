import { RuleFunction, RulesInterface } from './rules';
import Division from './division';
declare type ruletype = RegExp | RuleFunction;
export interface MakerConfig {
    'divisionCode'?: string;
    'beginTime'?: Date;
    'endTime'?: Date;
}
export default class Maker {
    private config;
    private is8bit;
    private getRndTime;
    private stateIndex;
    protected baseIncrement: number;
    protected rules: RulesInterface<ruletype>;
    protected division: Division;
    addRule(arg: string | RulesInterface<ruletype>, value?: ruletype): void;
    getRule(key: string): ruletype;
    get(methodName: string, ...args: any[]): string | number | boolean;
    private parseTPL;
    make(content: string, n1?: number, n2?: number): string;
    increment: number;
    constructor(option?: MakerConfig);
}
export {};
