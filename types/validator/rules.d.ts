export interface RuleFunction {
    (...values: any[]): boolean;
}
export interface RulesInterface<T> {
    [key: string]: T;
}
export declare var Rules: RulesInterface<RegExp | RuleFunction>;
