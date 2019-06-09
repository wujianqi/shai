import Chain, { IChain } from "./chainResult";
import { objectPath } from "./objectPath";
import { customRule, RuleFunction } from "./rules";
import { message, MessageInfo, config } from "./message";

export { RuleFunction, IChain };

export interface ValidSetting {
  isdev?: boolean;
  message?: MessageInfo;
}
export interface IValidator {
  setting: ValidSetting;
  check(value: any): IChain;
  check(
    value: object,
    path: string | number | Array<string | number>
  ): IChain;
  readonly string: IChain;
  readonly number: IChain;
  readonly boolean: IChain;
  readonly array: IChain;
  readonly object: IChain;
  readonly null: IChain;
  add(key: string, func: RuleFunction, msg?: string): void;
  checkItems(chains: IChain[]): boolean;
  verify(
    JSONData: string | object,
    struct: object,
    callback?: (faults: MessageInfo, path: (string | number)[]) => void
  ): boolean;
}

/**
 * @module 验证器
 */
export const validator: IValidator = {
  set setting(option: ValidSetting) {
    if (option && !!option.isdev) config.printout = option.isdev;
    if (option && option.message) (<any>Object).assign(message, option.message);
  },
  get setting() {
    return {
      set isdev(dev:boolean) { config.printout = dev },
      get isdev() { return config.printout },
      message
    }
  },

  /**
   * 添加函数引用，在custom规则中作为参数调用
   * @param key
   * @param func
   * @param msg
   */
  add(key: string, func: RuleFunction, msg?: string): void {
    customRule[key] = func;
    if (msg) message.customItems[key] = msg;
  },

  /**
   * 链式规则调用
   */
  get string(): IChain {
    return (<IChain>new Chain()).string;
  },
  get number(): IChain {
    return (<IChain>new Chain()).number;
  },
  get object(): IChain {
    return (<IChain>new Chain()).object;
  },
  get array(): IChain {
    return (<IChain>new Chain()).array;
  },
  get boolean(): IChain {
    return (<IChain>new Chain()).boolean;
  },
  get null(): IChain {
    return (<IChain>new Chain()).null;
  },

  /**
   * 链式组合规则验证，按对象路径查找值进行链式验证
   * @param data
   * @param path
   */
  check(data: any, path?: string | number | Array<string | number>) {
    return (<IChain>new Chain()).check(data, path);
  },

  checkItems(chains: IChain[]): boolean {
    let results: Array<boolean> = [];

    chains.forEach(o => results.push(o.result));
    return results.indexOf(false) === -1;
  },

  /**
   * 类型与数据匹配
   * @param {string|object} JSON 数据
   * @param {object} struct 数据类型对象 (检测链)
   * @param {function} callback 自定义回调，可选，参数为未通过项、对象层级路径
   * @returns {boolean} 是否验证通过
   */
  verify(
    JSONData: string | object,
    struct: object,
    callback?: (faults: MessageInfo, path: (string | number)[]) => void
  ): boolean {
    let checkeds: boolean[] = [];
    const dataObj =
      typeof JSONData === "string" ? JSON.parse(JSONData) : JSONData;

    const checkValue = (
      dt: string | number | object,
      rule: IChain,
      p: (string | number)[]
    ) => {
      let chain = rule.check(dt)
        .name((Array.isArray(p) ? p.join(".") : p), false);

      if (typeof callback === "function")
        chain = chain.on((fault: MessageInfo) => callback(fault, p));
      checkeds.push(chain.result);
    };
    const findMany = (
      path: (string | number)[],
      rule: IChain
    ): void => {
      let ids: number[] = [],
        lastRight = path.slice(path.lastIndexOf(0) + 1);

      path.forEach((v, i) => {
        if (v === 0) ids.push(i);
      });

      const getMany = (n: number, pr?: number) => {        
        let left = path.slice(0, ids[n]), // 递归取数据，生成路径集
          next = n + 1,
          p: any[],
          dt: any,
          len: number;

        if (pr && left.lastIndexOf(0) > -1)
          left.splice(left.lastIndexOf(0), 1, pr);
        dt = objectPath(dataObj, left);
        len = (<(string | number)[]>dt).length;

        for (let j = 0; j < len; j++) { // 循环数据列
          p = lastRight ? left.concat(j, lastRight) : left.concat(j);
          if (ids[next]) getMany(next, j);
          else checkValue(objectPath(dataObj, p), rule, p);
        }
      };
      getMany(0);
    };
    const findData = (
      type: IChain,
      path: (string | number)[]
    ): void => { // 匹配路径数据
      let dt = objectPath(dataObj, path);

      if (path.indexOf(0) > -1) findMany(path, type);
      else if (dt !== void 0) {
        if (Array.isArray(dt))
          dt.forEach((d, i) => {
            checkValue(d, type, path.concat(i));
          });
        else checkValue(dt, type, path);
      }
      /* else {
        throw new TypeError(`没有找到要检查的${path.join(".")}的目标数据！`);
      } */
    };
    const itemCheck = (types: any, path: (string | number)[]): void => {
      Object.keys(types).forEach(key => {
        let p = path.concat(),
          t: any;
        const datatype = types[key];

        p.push(key);
        if (Array.isArray(datatype) && datatype.length > 0) {
          t = datatype[0];
          p.push(0);
        } else {
          t = datatype;
        }

        if (t instanceof Chain) findData(t, p);
        else itemCheck(t, p);
      });
    };

    itemCheck(struct, []);
    return checkeds.length > 0 ? checkeds.indexOf(false) === -1 : false;
  }
}
