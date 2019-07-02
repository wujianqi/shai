import Chain, { ChainConstructor } from './chainResult';
import { config, message, MessageInfo } from './message';
import { customRule, ValidFunction } from './rules';
import { group, parentPath } from './chainUtil';

export { ValidFunction, ChainConstructor };

export interface ValidSetting {
    isdev?: boolean;
    message?: MessageInfo;
}

function check(value: any): ChainConstructor;
function check(value: object, path: string | number | (string | number)[]): ChainConstructor;
function check(value: any, path?: string | number | (string | number)[]) {
    return (new Chain() as ChainConstructor).check(value, path);
}

/**
 * @module 验证器
 */
export const validator = {
    set setting(option: ValidSetting) {
        if (option && !!option.isdev) { config.printout = option.isdev; }
        if (option && option.message) { Object.assign(message, option.message); }
    },
    get setting() {
        return {
            set isdev(dev: boolean) {
                parentPath.path = [];
                config.printout = dev;                
            },
            get isdev() { return config.printout; },
            message,
        };
    },

    /**
   * 添加函数引用，在custom规则中作为参数调用
   * @param key
   * @param func
   * @param msg
   */
    add(key: string, func: ValidFunction, msg?: string): void {
        customRule[key] = func;
        if (msg) { (message as MessageInfo).customItems[key] = msg; }
    },

    /**
   * 链式规则调用
   */
    get string(): ChainConstructor {
        return (new Chain() as ChainConstructor).string;
    },
    get number(): ChainConstructor {
        return (new Chain() as ChainConstructor).number;
    },
    get object(): ChainConstructor {
        return (new Chain() as ChainConstructor).object;
    },
    get array(): ChainConstructor {
        return (new Chain() as ChainConstructor).array;
    },
    get boolean(): ChainConstructor {
        return (new Chain() as ChainConstructor).boolean;
    },
    get null(): ChainConstructor {
        return (new Chain() as ChainConstructor).null;
    },

    /**
   * 链式组合规则验证
   * @param data
   * @param path 按对象路径过滤或查找值
   */    
    check,
    group,
};
