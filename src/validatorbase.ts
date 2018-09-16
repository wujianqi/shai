import Base, { RuleFunc, Rules, BaseInterface } from './base';

export interface ValidRuleFunc extends RuleFunc {
    (...values: any[]): boolean;
}

export interface ValidRules extends Rules {
    [key: string]: RegExp | ValidRuleFunc;
}

export interface Chain {
    readonly __caches: any[];
}

interface ChainClass {
    new(): Chain;
}

export interface ValidBaseInterface extends BaseInterface{
    readonly type: Chain;
    addRule(arg: string | ValidRules, value?: RegExp | ValidRuleFunc): void;
}

/**
 * @class 数据验证链式基类
 */
export default class ValidatorBase extends Base implements ValidBaseInterface {
    private chain: ChainClass = class {
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
    get type(): Chain {
        return new this.chain();
    };

    addRule(arg: string | ValidRules, value?: RegExp | ValidRuleFunc): void {
        super.addRule(arg, value);
        if (typeof arg === 'string' && value) {
            this.ruleMap[arg] = value;
            this.addProp(arg, <ValidRules>this.ruleMap);

        } else if (this.isObject(arg)) {
            (<any>Object).assign(this.ruleMap, arg);
            Object.keys(arg).forEach(k => this.addProp(k, <ValidRules>this.ruleMap));
        }

    }
}
