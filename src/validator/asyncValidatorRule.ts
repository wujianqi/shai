import { MessageInfo } from './message';

type dataType = 'string'|'number'|'object'|'array'|'boolean';
export interface AsyncValidatorRule {
    type?: dataType;
    required?: boolean;
    message?: string;
    trigger?: string;
    validator?(rule: any, value: any, cb?: Function): boolean | Error;
}
/**
 * async-validator 验证规则兼容处理
 */
export function getRule (
    ruleMap: any[], // 规则集
    check: (type: string | (string | any[])[], value: any) => boolean | Promise<boolean>, // 单项规则验证回调
    onfaults: () => MessageInfo, // 验收失败消息集
    requiredMessage: string, // 非空提示消息
    trigger?: string // 指定触发事件名
): AsyncValidatorRule[] {
    const types = ['string', 'number', 'object', 'array', 'boolean'];
    const isRequired = ruleMap.indexOf('required') > -1;
    const whitespace = (v: any) =>
        typeof v === 'string' ? v.trim() === '' : v === null;
    let rls: AsyncValidatorRule[] = [
        {
            required: isRequired,
            message: requiredMessage
        }
    ];

    ruleMap.forEach(k => {
        // 基本类型转换
        if (typeof k === 'string' && types.indexOf(k) > -1) {
            rls[0].type = k as dataType;
        } else if (k !== 'required') {
            const obj: any = {};
            const fnc = (key:string | (string | any[])[], 
                msg: string | Function) => (rule: any, value: any) => {
                if (!isRequired && whitespace(value)) {
                    return true;
                }
                return check(key, value) ? true :
                    new Error(typeof msg === 'function' ? msg(): msg);
            }

            if (Array.isArray(k)) {
                const key = k[0] as string;
                const args = k[1];

                if (key === 'custom') {
                    const sub = args[0];
                    const getMsg = () => {
                        const faults = onfaults();
                        let msg = '';
        
                        if (faults.customItems && faults.customItems[sub]) {
                            msg = faults.customItems[sub];
                        } else {
                            msg = faults[key] as string;
                        }
                        return msg;
                    };
                    obj.validator =  fnc(k, getMsg)
                } else {
                    obj.validator = fnc(k, onfaults()[key] as string)
                }
            } else {
                obj.validator = fnc(k, onfaults()[k] as string)                
            }
            rls.push(obj);
        }
    });

    if (trigger) {
        rls = rls.map(rule => {
            rule.trigger = trigger
            return rule;
        });
    }    
    return rls;
}
