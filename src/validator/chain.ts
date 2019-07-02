import { MessageInfo } from './message';
import { objectPath } from './objectPath';
import { customRule, ValidFunction, rules } from './rules';

type RulesMap = typeof rules;
interface CallBackFunction {
    [key: string]: Function;
}
interface StructObject<T> {
    [key: string]: StructArray<T> | Struct<T> | T[] | T;
}
interface StructArray<T> extends Array<StructObject<T>> {
    [key: number]: StructObject<T> ;
}
export type Struct<T> = StructArray<T> | StructObject<T>;
export type OnFaultsFunction = (faultMessage?: MessageInfo) => void;
export interface ChainBase {
    readonly string?: this;
    readonly number?: this;
    readonly boolean?: this;
    readonly object?: this;
    readonly array?: this;
    readonly null?: this;
    readonly required?: this;
    readonly english?: this;
    readonly nospace?: this;
    readonly nodbc?: this;
    readonly alphanum?: this;
    readonly qq?: this;
    readonly age?: this;
    readonly zipcode?: this;
    readonly ip?: this;
    readonly port?: this;
    readonly domain?: this;
    readonly maca?: this;
    readonly bizcode?: this;
    readonly invoice?: this;
    readonly bankcard?: this;
    readonly currency?: this;
    readonly float?: this;
    readonly int?: this;
    readonly decimal?: this;
    readonly chinese?: this;
    readonly mail?: this;
    readonly url?: this;
    readonly account?: this;
    readonly password?: this;
    readonly safe?: this;
    readonly hex?: this;
    readonly color?: this;
    readonly ascii?: this;
    readonly base64?: this;
    readonly md5?: this;
    readonly uuid?: this;
    readonly mobile?: this;
    readonly telphone?: this;
    readonly phone?: this;
    readonly percent?: this;
    readonly year?: this;
    readonly month?: this;
    readonly day?: this;
    readonly hour?: this;
    readonly minute?: this;
    readonly time?: this;
    readonly date?: this;
    readonly datetime?: this;
    readonly file?: this;
    readonly image?: this;
    readonly word?: this;
    readonly lon?: this;
    readonly lat?: this;
    readonly approval?: this;
    readonly citycode?: this;
    readonly address?: this;
    readonly upper?: this;
    readonly lower?: this;
    readonly even?: this;
    readonly odd?: this;
    readonly ipv6?: this;
    readonly bodycard?: this;
    readonly autocard?: this;
    readonly isbn?: this;
    readonly tag?: this;
    readonly jwt?: this;
    readonly empty?: this;
    each(struct: Struct<this>): this;
    check(value: any): this;
    check(value: object, path: string | number | (string | number)[]): this;
    on(str: Function, fnc: string): this;
    on(str: keyof RulesMap, fnc: Function): this;
    on(str: OnFaultsFunction): this;
    ok(str: Function, fnc: string): this;
    ok(str: keyof RulesMap, fnc: Function): this;
    alias(fieldName: string, override?: boolean): this;
    target(...targetNames: string[]): this;
    not?(arg: any): this;
    eq?(arg: any): this;
    gt?(arg: string | number | Date): this;
    gte?(arg: string | number | Date): this;
    lt?(arg: string | number | Date): this;
    lte?(arg: string | number | Date): this;
    between?<T extends string | number | Date>(arg1: T, arg2: T): this;
    min?<T extends string | number | Date>(arg1: T, ...args: T[]): this;
    max?<T extends string | number | Date>(arg1: T, ...args: T[]): this;
    len?(arg: string | number): this;
    minlen?(arg: string | number): this;
    maxlen?(arg: string | number): this;
    charlen?(arg: string | number): this;
    in?(arg: string | number | any[] | object): this;
    has?(arg: string | number | any[] | object): this;
    regexp?(arg: RegExp | string): this;
    custom?(arg: ValidFunction): this;
    custom?(arg: string, ...args: any[]): this;
}

interface InnerChain extends ChainBase {
    $set(key: string, value?: any[]): this;
}

/**
 * @class 验证链
 */
class Chain implements InnerChain {
    /**
   * 索引设定的规则及参数
   */
    protected map: (string | (string | any[])[])[];
    protected value: any;
    protected failed: CallBackFunction;
    protected passed: CallBackFunction;
    protected names: [string, string[], string[]];
    protected substruct: Struct<this>;

    constructor() {
        this.map = [];
        this.failed = {};
        this.passed = {};
        this.names = ['', [], []];
    }

    public $set(key: string, value?: any[]) {
        if (value === void 0) {
            if(this.map.indexOf(key) === -1) { this.map.push(key) }
        }
        else { this.map.push([key, value]); }
        return this;
    }

    /**
   * 链式组合规则验证，按对象路径查找值进行链式验证
   * @param data
   * @param path
   */
    public check(data: any, path?: string | number | (string | number)[]) {
        if (!!path && typeof data === 'object') { data = objectPath(data, path); }
        this.value = data;
        return this;
    }

    /**
   * 设置名称，用于格式化消息
   * @param fieldname 名称
   */
    public alias(fieldName: string, override: boolean = true) {
        if (override) { this.names[0] = fieldName; }
        else if (this.names[0] === '') { this.names[0] = fieldName; }
        return this;
    }
    public target(...targetNames: string[]) {
        targetNames.forEach((n) => this.names[1].push(n));
        return this;
    }

    /**
     * 
     * @param struct 按数据类型结构组合验证
     */
    public each(struct: Struct<this>) {
        this.substruct = struct;
        return this;
    }

    /**
   * 判断后的处理方法
   * @param arg1
   * @param arg2
   */
    public on(
        arg1: keyof RulesMap | OnFaultsFunction | Function,
        arg2?: string | Function,
    ) {
        if (typeof arg1 === 'string' && typeof arg2 === 'function') {
            this.failed[arg1] = arg2;
        }
        else if (typeof arg1 === 'function' &&
            typeof arg2 === 'string' &&
            customRule.hasOwnProperty(arg2)) {
            this.failed['$' + arg2] = arg1;
        }
        if (typeof arg1 === 'function') {
            this.failed.together = arg1 as OnFaultsFunction;
        }
        return this;
    }
    public ok(arg1: keyof RulesMap | Function, arg2?: string | Function) {
        if (typeof arg1 === 'string' && typeof arg2 === 'function') {
            this.passed[arg1] = arg2;
        }
        else if (typeof arg1 === 'function' &&
            typeof arg2 === 'string' &&
            customRule.hasOwnProperty(arg2)) {
            this.passed['$' + arg2] = arg1;
        }
        return this;
    }
}

const rls: RulesMap & { [key: string]: RegExp | ValidFunction } = rules;
Object.keys(rls).forEach(key  => {
    const rule = rls[key];
    let descriptor = Object.create(null);

    if (rule instanceof RegExp || (typeof rule === 'function' && rule.length === 1)) {
        descriptor = {
            get() {
                (this as InnerChain).$set(key);
                return this;
            },
        };
    } else if (typeof rule === 'function') {
        descriptor = {
            value(...args: any[]) {
                (this as InnerChain).$set(key, args);
                return this;
            },
        };
    }
    Object.defineProperty(Chain.prototype, key, descriptor);
});

export default Chain;
