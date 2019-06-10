import SpecificRules, {
  MakerSetting,
  RuleFunction,
  rulesName
} from "./specificRules";

export {
  MakerSetting,
  RuleFunction as MethodFuction,
  rulesName as MethodNames
};

export interface IMaker {
  setting: MakerSetting;
  add(key: string, func: RuleFunction): void;
  get(methodName: rulesName, ...args: any[]): string | number | boolean;
  get(methodName: "custom", arg2: RuleFunction): string | number | boolean;
  get(
    methodName: "custom",
    arg2: string,
    ...args: any[]
  ): string | number | boolean;
  make(
    content: string | object,
    parseValueType?: string | boolean,
    optionKey?: string
  ): object;
}

var optionPropKey = "makerOption";
var parseTypes = ["int", "number", "increment", "bool"];
var specificRules = new SpecificRules();

/**
 * 批量数据--模版生成
 * @param content
 * @param n1
 * @param n2
 */
function bulk(content: string, n1?: number, n2?: number): string {
  let num = 0;

  if (typeof n1 === "number" && typeof n2 === "number")
    num = specificRules.rules.int(n1, n2);
  else if (typeof n1 === "number") num = n1;

  if (num > 0) {
    let list = [],
      i;

    for (i = 0; i < num; i++) list.push(content);
    return "[" + list.join(",") + "]";
  } else return content;
}

/**
 * 递归嵌套数据--模版生成
 * @param content
 * @param level
 * @param keyName
 * @param num
 */
function nested(
  content: string,
  level: number,
  keyName: string,
  num?: number
): string {
  let newstr = content;
  const makedata = (): void => {
    level--;
    if (level < 0) return void 0;
    newstr = newstr.replace(
      /(?<=@@).*(?=##)/,
      ($0): any => {
        return `${$0},${keyName}:${bulk(`@@${$0}##`, num)}`;
      }
    );
    makedata();
  };

  makedata();
  return newstr;
}

/**
 * 批量、嵌套数据模板，选项转换
 * @param content
 */
function convertOption(content: string): string {
  let objbody: string, n1: number, n2: number, itemsKey: string;
  const reg = new RegExp(`"${optionPropKey}":\\[([^\\]]+)\\],?`);

  objbody = content.replace(
    reg,
    (n, m): any => {
      let args = m.split(",");

      n1 = +args[0];
      n2 = args.length > 1 ? +args[1] : void 0;
      itemsKey = args.length > 2 ? args[2] : void 0;
      return "";
    }
  );
  if (typeof itemsKey === "string") objbody = nested(objbody, n1, itemsKey, n2);
  else objbody = bulk(objbody, n1, n2);

  return objbody;
}

/**
 * 含循环输出配置的模板内容转换
 * @param content
 */
function findBlock(content: string): string {
  let s1 = content;
  const rpb = (str: string) => str.replace(/\{/g, "@@").replace(/\}/g, "##"); // 转换子对象标识，便于获取父对象
  const unrpb = (str: string) => str.replace(/@@/g, "{").replace(/##/g, "}"); // 子对象标识转换回来

  const callfn = (): void => {
    // 递归获取子对象块
    if (s1.indexOf(optionPropKey) === -1) return void 0;

    s1 = s1.replace(
      /\{(?=(?:(?!\{)[\s\S])*$)[\s\S]*?\}/,
      ($0): any => {
        if (new RegExp(optionPropKey).test($0)) return convertOption(rpb($0));
        else return rpb($0);
      }
    );
    callfn();
  };
  callfn();
  return unrpb(s1);
}

/**
 * 模版输出项解析
 * @param content
 */
function parseTPL(content: string): string {
  return content.replace(
    /<%([^(%>)\n\r]+)%>/g,
    ($0, $1): any => {
      const key = $1.replace(/\s+/g, "");

      if (key.indexOf(",") > -1) {
        let args = key.split(",");

        args.forEach((item: any, i: number) => {
          if (/^true$/.test(item)) args[i] = true;
          else if (/^false$/.test(item)) args[i] = false;
          else if (/^(\-|\+)?\d+(\.\d+)?$/.test(item)) args[i] = +item;
        });
        return maker.get(args.shift(), ...args);
      } else {
        return maker.get(key);
      }
    }
  );
}

/**
 * @class 数据生成、模拟
 */
export const maker: IMaker = {
  set setting(option: MakerSetting) {
    specificRules = new SpecificRules(option);
  },
  get setting() {
    return {
      set divisionCode(code: string | number) {
        specificRules = new SpecificRules({
          divisionCode: code + ""
        });
      },
      set beginTime(time: Date) {
        specificRules = new SpecificRules({
          beginTime: time
        });
      },
      set endTime(time: Date) {
        specificRules = new SpecificRules({
          endTime: time
        });
      },
      set incrementBase(num: number) {
        specificRules = new SpecificRules({
          incrementBase: num
        });
      }
    };
  },
  add: specificRules.add.bind(specificRules),

  /**
   * 生成模拟数据
   * @param {string} [ruleStr] 方法属性名
   * @returns {string | number | boolean} 返回模拟数据
   * @example
   * get('md5');
   */
  get(methodName: rulesName, ...args: any[]): string | number | boolean {
    let result = "";
    const rule = specificRules.rules[methodName];

    if (rule) {
      if (rule instanceof RegExp) result = specificRules.rules.regexp(rule);
      else if (typeof rule === "function")
        result = (<RuleFunction>rule)(...args) as string;
    } else throw new TypeError(`没有找到“${methodName}”相关生成数据的方法！`);

    return result;
  },

  /**
   * 根据模块内容，生成数据
   * @param {tring | object} content JSON模版内容
   * @param {string | boolean} parseValueType 是否需要转换值的类型，默认是，即转换值类型
   * @param {string} optionKey 自定义循环输出的对象属性名，默认为makerOption
   * @returns {object}
   */
  make(
    content: string | object,
    parseValueType?: string | boolean,
    optionKey?: string
  ): object {
    try {
      let data: string, tpl: string;
      const hasParse =
        typeof parseValueType === "boolean" ? parseValueType : true;

      if (typeof parseValueType === "string") {
        let typs = parseValueType.trim().split(",");
        typs.forEach(item => {
          if (parseTypes.indexOf(item) === -1) parseTypes.push(item);
        });
      }
      tpl = JSON.stringify(
        typeof content === "string" ? JSON.parse(content) : content
      );
      if (typeof optionKey == "string" && optionKey !== "")
        optionPropKey = optionKey;
      if (hasParse) {
        const reg = new RegExp(
            `(?!:\\s*)"<%\\s*(${parseTypes.join("|")})[^%>"]*%>"`,
            "g"
          ),
          ns = (str: string) =>
            str.replace(reg, ($0): any => $0.replace(/"/g, ""));

        data = parseTPL(findBlock(ns(tpl)));
      } else data = parseTPL(findBlock(tpl));

      return JSON.parse(data);
    } catch (error) {
      throw new SyntaxError(`请检查模板格式！${error.message}`);
    }
  }
};
