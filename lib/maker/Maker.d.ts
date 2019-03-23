import SpecificRules, { SettingOption, RuleFunction, rulesName } from './SpecificRules';
export { SettingOption, RuleFunction as MethodFuction };
export default class Maker extends SpecificRules {
    private __OptPropKey;
    constructor(option?: SettingOption);
    get(methodName: rulesName, ...args: any[]): string | number | boolean;
    private bulk;
    private nested;
    private convertOption;
    private findBlock;
    private parseTPL;
    make<T extends string | object>(content: T, parseValueType?: string | boolean, optionKey?: string): T;
}
