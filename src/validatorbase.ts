import Base, { BaseInterface } from './base';

export interface ValidRuleFunc {
    (value:string | number, ...values: (string | number)[]): boolean;
}

export interface ValidRules {
    [key: string]: RegExp | ValidRuleFunc;
}

export interface ValidatorBaseInterface extends BaseInterface {
    addRule(key: string, value: RegExp | ValidRuleFunc): void;
    addRules(option: ValidRules): void;
    readonly type: any;
}

/**
 * @class 数据验证链式基类
 */
export default class ValidatorBase extends Base implements ValidatorBaseInterface {
    protected chain = class {
        __caches: any[] = [];
    };

    private addProp(key: string, map: ValidRules): void {
        let prop: { [key: string]: any } = {};

        if (map[key] instanceof RegExp || (<ValidRuleFunc>map[key]).length === 1) {
            prop['get'] = function () {
                this.__caches.push(key);
                return this;
            }
        } else {
            prop['value'] = function (...args: (string | number)[]) {
                let obj: any = {};

                obj[key] = args;
                this.__caches.push(obj);
                return this;
            }
        }
        Object.defineProperty(this.chain.prototype, key, prop);
    }

    /**
     * 链式规则调用，缓存设值内容
     */
    get type():any {
        return new this.chain();
    };

    addRule(key: string, value: RegExp | ValidRuleFunc): void {
        super.addRule(key, value);
        this.addProp(key, <ValidRules>this.ruleMap);
    }

    addRules(option: ValidRules): void {
        super.addRules(option);
        Object.keys(option).forEach(k => this.addProp(k, <ValidRules>this.ruleMap));
    }

    constructor() {
        super();

        this.addRule = this.addRule.bind(this);
        this.addRules = this.addRules.bind(this);
    }
    
}
