import SpecificRules, {
    config,
    customRule,
    MakerSetting,
    MakeFunction,
    rulesName,
} from './specificRules';
import { findBlock, parseTPL } from './template';

export {
    MakerSetting,
    MakeFunction,
    rulesName as MethodNames,
};

let optionPropKey = 'makerOption';
const parseTypes = ['int', 'number', 'increment', 'bool'];
let __specr: SpecificRules = new SpecificRules();

function get(methodName: rulesName, ...args: any[]): string | number | boolean;
function get(methodName: 'custom', arg2: MakeFunction): string | number | boolean;
function get(methodName: 'custom', arg2: string, ...args: any[]): string | number | boolean;
function get(method: rulesName, ...args: any[]): string | number | boolean {
    let result = '';
    const rule = __specr.rules[method];

    if (rule) {
        if (rule instanceof RegExp) { result = __specr.rules.regexp(rule); }
        else if (typeof rule === 'function') {
            result = (rule as MakeFunction)(...args) as string;
        }
    } else { throw new TypeError(`没有找到“${method}”相关生成数据的方法！`); }

    return result;
}

/**
 * @class 数据生成、模拟
 */
export const maker = {
    set setting(option: MakerSetting) {
        Object.assign(config, option);
    },
    get setting() {
        return {
            set divisionCode(code: string | number) {
                Object.assign(config, {
                    divisionCode: String(code),
                });
            },
            set beginTime(time: Date) {
                Object.assign(config, {
                    beginTime: time,
                });
            },
            set endTime(time: Date) {
                Object.assign(config, {
                    endTime: time,
                });
            },
            set incrementBase(num: number) {
                Object.assign(config, {
                    incrementBase: num,
                });
            },
        };
    },

    /**
   * 添加函数引用，在custom规则中作为参数调用
   * @param makeFunc
   */
    add(key: string, makeFunc: MakeFunction): void {
        customRule[key] = makeFunc;
    },

    /**
   * 生成模拟数据
   * @param {string} [ruleStr] 方法属性名
   * @returns {string | number | boolean} 返回模拟数据
   * @example
   * get('md5');
   */
    get,

    /**
   * 根据模块内容，生成数据
   * @param {tring | object} content JSON模版内容
   * @param {string | boolean} parseValueType 是否需要转换值的类型，默认是，即转换值类型
   * @param {string} optionKey 自定义循环输出的对象属性名，默认为makerOption
   * @returns {object}
   */
    toJSON(
        content: string | object,
        parseValueType?: string | boolean,
        optionKey?: string,
    ): string {
        try {
            let data: string;
            const hasParse = typeof parseValueType === 'boolean' ? parseValueType : true,
                tpl = JSON.stringify(
                    typeof content === 'string' ? JSON.parse(content) : content,
                );

            if (typeof parseValueType === 'string') {
                const typs = parseValueType.trim().split(',');
                typs.forEach((item) => {
                    if (parseTypes.indexOf(item) === -1) { parseTypes.push(item); }
                });
            }            
            if (typeof optionKey == 'string' && optionKey !== '') {
                optionPropKey = optionKey;
            }
            if (hasParse) {
                const reg = new RegExp(
                        `(?!:\\s*)"<%\\s*(${parseTypes.join('|')})[^%>"]*%>"`,
                        'g',
                    ),
                    ns = (str: string) =>
                        str.replace(reg, ($0): any => $0.replace(/"/g, ''));

                data = findBlock(ns(tpl), optionPropKey);
            } else { data = findBlock(tpl, optionPropKey); }
            return parseTPL(data, maker.get, () => __specr = new SpecificRules());
        } catch (error) {
            throw new SyntaxError(`请检查模板格式！${error.message}`);
        }
    },
    make(
        content: string | object,
        parseValueType?: string | boolean,
        optionKey?: string,
    ): object {
        return JSON.parse(maker.toJSON(content, parseValueType, optionKey));
    },

};
