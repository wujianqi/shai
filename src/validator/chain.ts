import { rules, RulesMap, RuleFunction, customRule } from "./rules";
import { objectPath } from "./objectPath";
import { MessageInfo } from "./message";

interface CallBackFunction {
  [key: string]: Function;
}

export interface OnFaultsFunction {
  (faultMessage?: MessageInfo): void;
}
export interface ChainBase {
  check(value: any): this;
  check(value: object, path: string | number | Array<string | number>): this;
  on(str: Function, fnc: string): this;
  on(str: keyof RulesMap, fnc: Function): this;
  on(str: OnFaultsFunction): this;
  ok(str: Function, fnc: string): this;
  ok(str: keyof RulesMap, fnc: Function): this;
  name(fieldName: string, override?: boolean): this;
  target(...targetNames: string[]): this;
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
  readonly objectid?: this;
  readonly empty?: this;
  not?(arg: any): this;
  eq?(arg: any): this;
  gt?(arg: string | number | Date): this;
  gte?(arg: string | number | Date): this;
  lt?(arg: string | number | Date): this;
  lte?(arg: string | number | Date): this;
  between?<T extends string | number | Date>(arg1: T, arg2: T): this;
  min?<T extends string | number | Date>(arg1: T, ...args: T[]): this;
  max?<T extends string | number | Date>(arg1: T, ...args: T[]): this;
  length?(arg: string | number): this;
  minlength?(arg: string | number): this;
  maxlength?(arg: string | number): this;
  bitmax?(arg: string | number): this;
  in?(arg: string | number | any[] | object): this;
  has?(arg: string | number | any[] | object): this;
  regexp?(arg: RegExp | string): this;
  custom?(arg: RuleFunction): this;
  custom?(arg: string, ...args: Array<any>): this;
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
  protected map: Array<string | Array<string | any[]>>;
  protected value: any;
  protected failed: CallBackFunction;
  protected passed: CallBackFunction;
  protected names: {
    [0]: string; // name
    [1]: string[]; // target
    [2]: string[]; // temp
  };

  constructor() {
    this.map = [];
    this.failed = {};
    this.passed = {};
    this.names = ["", [], []];
  }

  $set(key: string, value?: any[]) {
    if(value === void 0) this.map.push(key);
    else this.map.push([key, value]);
    return this;
  }

  /**
   * 链式组合规则验证，按对象路径查找值进行链式验证
   * @param data
   * @param path
   */
  check(data: any, path?: string | number | Array<string | number>) {
    if (!!path && typeof data === "object") data = objectPath(data, path);
    this.value = data;
    return this;
  }

  /**
   * 设置名称，用于格式化消息
   * @param fieldname 名称
   */
  name(fieldName: string, override: boolean = true) {
    if (override) this.names[0] = fieldName;
    else if (this.names[0] === "") this.names[0] = fieldName;
    return this;
  }
  target(...targetNames: string[]) {
    targetNames.forEach(n => this.names[1].push(n));
    return this;
  }

  /**
   * 判断后的处理方法
   * @param arg1
   * @param arg2
   */
  on(
    arg1: keyof RulesMap | OnFaultsFunction | Function,
    arg2?: string | Function
  ) {
    if (typeof arg1 === "string" && typeof arg2 === "function")
      this.failed[arg1] = arg2;
    else if (
      typeof arg1 === "function" &&
      typeof arg2 === "string" &&
      customRule.hasOwnProperty(arg2)
    )
      this.failed["$" + arg2] = arg1;
    if (typeof arg1 === "function")
      this.failed["together"] = <OnFaultsFunction>arg1;
    return this;
  }
  ok(arg1: keyof RulesMap | Function, arg2?: string | Function) {
    if (typeof arg1 === "string" && typeof arg2 === "function")
      this.passed[arg1] = arg2;
    else if (
      typeof arg1 === "function" &&
      typeof arg2 === "string" &&
      customRule.hasOwnProperty(arg2)
    )
      this.passed["$" + arg2] = arg1;
    return this;
  }
}

Object.keys(rules).forEach(key => {
  let rule = rules[key],
    descriptor = Object.create(null);

  if (
    rule instanceof RegExp ||
    (typeof rule === "function" && rule.length === 1)
  ) {
    descriptor = {
      get: function() {
        (<InnerChain>this).$set(key);
        return this;
      }
    };
  } else if (typeof rule === "function") {
    descriptor = {
      value: function(...args: any[]) {
        (<InnerChain>this).$set(key, args);
        return this;
      }
    };
  }
  Object.defineProperty(Chain.prototype, key, descriptor);
});

export { Chain };
