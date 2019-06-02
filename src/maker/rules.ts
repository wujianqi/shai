import RandExp from "randexp";
import { md5 } from "./md5";
import { util } from "./util";
import names from "./names.json";

export interface RuleFunction {
  (...values: any[]): boolean | string | number;
}

export interface RulesMap {
  md5(arg2?: boolean, arg?: string): string;
  uuid(arg?: string): string;
  now(arg?: string): string;
  regexp(arg?: string | RegExp): string;
  enum<T extends boolean | string | number>(...args: T[]): T;
  range(n1?: number, n2?: number, n3?: number): string;
  int(arg1?: number, arg2?: number): number;
  number(arg1?: number, arg2?: number, arg3?: number): number;
  bool(): boolean;
  month(): number;
  day(): number;
  hour(): number;
  minute(): number;
  rgb(arg?: boolean): string;
  hsl(arg?: boolean): string;
  mid: RegExp;
  account: RegExp;
  password: RegExp;
  color: RegExp;
  url: RegExp;
  mail: RegExp;
  mobile: RegExp;
  port: RegExp;
  bizcode: RegExp;
  bankcard: RegExp;
  qq: RegExp;
  alphanum(arg?: number): string;
  english(num?: number, arg?: string): string;
  upper(arg?: string): string;
  lower(arg?: string): string;
  chinese(num?: number, arg?: string): string;
  ip(local?: boolean): string;
  text(n1?: number, arg?: string, n2?: number): string;
  price(arg1?: number, arg2?: number, arg3?: boolean): string;
  esurname(): string;
  enName(): string;
  enMaleName(): string;
  enFemaleName(): string;
  surname(): string;
  cnName(): string;
  cnMaleName(): string;
  cnFemaleName(): string;
  enState(): string;
  cnState(): string;
  company(): string;
  road(): string;
  build(): string;
  job(): string;
  file(...exts: string[]): string;
  fieldType(str?: "mysql" | "sqlserver" | "oracle" | "sqlite"): string;
}

export interface RulesInterface extends RulesMap {
  [key: string]: RegExp | RuleFunction;
}

var lw = "abcdefghijklmnopqrstuvwxyz",
  r255 = "([1-9]{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])",
  rndText = (arg: string, num?: number) =>
    util.getItems(arg.split(""), num ? num : util.getInt(1, 9)).join(""),
  history = new Array(3), // 缓存部分数据引用记录一次
  geth = (index: number, value: string | number) => {
    let typ = history[index],
      nn: string | number;

    if (!typ) nn = value;
    else {
      nn = typ;
      typ = void 0;
    }
    return nn;
  };

export const rules: RulesInterface = {
  md5: (
    is16b: boolean = false,
    arg: string = new Date().getTime() + ""
  ): string => md5(arg, is16b),
  uuid: (arg: string = "-"): string => {
    let d = new Date().getTime(),
      str = ["xxxxxxxx", "xxxx", "4xxx", "yxxx", "xxxxxxxxxxxx"].join(arg),
      uuid = str.replace(/[xy]/g, function(c) {
        const r = (d + Math.random() * 16) % 16 | 0;

        d = Math.floor(d / 16);
        return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
      });

    return uuid;
  },
  now: (arg?: string): string => {
    return util.formatDate(new Date(), arg ? arg : "yyyy-MM-dd hh:mm:ss");
  },
  regexp: (arg?: string | RegExp): string =>
    arg ? new RandExp(arg).gen() : new RandExp(/.+/).gen(),
  enum: <T extends boolean | string | number>(...args: T[]): T =>
    util.getItem(args),
  range: (low = 1, high = 5, step = 1) => {
    let s = [];

    for (let i = low; i <= high; i += step) s.push(i);
    return s.join(",");
  },
  int: (low = 0, high = 100) => util.getInt(low, high),
  number: (low = 0, high = 10000, dec = 2) => util.getNumber(low, high, dec),
  bool: () => util.getItem([true, false]),
  month: () => util.getInt(1, 12),
  day: () => util.getInt(1, 31),
  hour: () => util.getInt(0, 23),
  minute: () => util.getInt(1, 59),
  mid: /[1-9A-Z][0-9A-Z]{1,7}(\-[0-9A-Z]{2,6}){0,2}/,
  account: /[a-zA-Z]{1,3}[a-zA-Z0-9]{6,8}/,
  password: /([a-z][A-Z][`~!@#$%^&*]\d){2}/,
  color: /#[A-F0-9]{6}/,
  url: /http(s?):\/\/www\.[a-z]{3,8}\.(com|cn|net|org|com\.cn)(\/[a-z]{3,5})?/,
  mail: /([a-z0-9]{3,6}[-_]?[a-z0-9]{3,6})@[a-z]{3,8}\.(com|cn|net|org)/,
  mobile: /(13\d|(14[5-7])|(15([0-3]|[5-9]))|17(0|1|8])|18\d)\d{8}/,
  port: /[1-9]\d{3}/,
  bizcode: /91[1-4]\d{5}[0-9A-HJ-NPQRTUWXY]{10}/,
  bankcard: /62(([0-3]\d)(4[0-5])|5([0-3]|5|8|9)|70|8[2-3])\d{12,15}/,
  qq: /([1-2]\d{10})|([1-9]\d{4,9})/,
  alphanum: (arg = 4) => new RandExp("[A-Z0-9]{" + arg + "}").gen(),
  rgb: (arg: boolean = false) => {
    if (arg) {
      return new RandExp(`rgb\\(${r255},${r255},${r255}\\)`).gen();
    } else {
      return new RandExp(`rgba\\(${r255},${r255},${r255},0\\.\\d\\)`).gen();
    }
  },
  hsl: (arg: boolean = false) => {
    if (arg)
      return `hsla(${[
        util.getInt(0, 360),
        util.getInt(0, 100) + "%",
        util.getInt(0, 100) + "%",
        util.getInt(0, 9) / 10
      ].join(",")})`;
    else
      return `hsl(${[
        util.getInt(0, 360),
        util.getInt(0, 100) + "%",
        util.getInt(0, 100) + "%"
      ].join(",")})`;
  },
  english: (num?: number, arg?: string) =>
    rndText(arg ? arg : lw + lw.toUpperCase(), num),
  upper: (arg?: string) =>
    typeof arg === "string" ? arg.toUpperCase() : rndText(lw.toUpperCase()),
  lower: (arg?: string) =>
    typeof arg === "string" ? arg.toLowerCase() : rndText(lw),
  chinese: (num?: number, arg?: string) => {
    if (typeof arg === "string") return rndText(arg, num);
    else
      return util
        .getItems(
          names.commonWord,
          typeof num === "number" ? num : util.getInt(1, 9)
        )
        .join("");
  },
  ip: (local: boolean = false) => {
    if (local) {
      return new RandExp(
        `((192\\.168)|(172\\.0)|(10\.0))\\.${r255}\\.${r255}`
      ).gen();
    } else {
      return new RandExp([r255, r255, r255, r255].join("\\.")).gen();
    }
  },
  text: (n1?: number, arg: string = "填充文本样式", n2?: number): string => {
    let d = 40;

    if (typeof n1 === "number" && typeof n2 === "number")
      d = util.getInt(n1, n2);
    else if (typeof n1 === "number") d = n1;
    return Array(d + 1).join(arg);
  },
  price: (
    low: number = 0,
    high: number = 10000,
    arg3: boolean = true
  ): string => {
    let n,
      d = util.getNumber(low, high, 2);
    const r1 = /\d{1,3}(?=(\d{3})+$)/g,
      r2 = /^(-?)(\d+)((\.\d+)?)$/;

    if (arg3)
      n = (d + "").replace(
        r2,
        (s, s1, s2, s3) => s1 + s2.replace(r1, "$&,") + s3
      );
    else n = d + "";
    return n;
  },
  esurname: () => (history[0] = util.getItem(names.eSurname)),
  enName: () =>
    util.getItem(names.eMaleName.concat(names.eFemaleName)) +
    " " +
    geth(0, rules.esurname()),
  enMaleName: () =>
    util.getItem(names.eMaleName) + " " + geth(0, rules.esurname()),
  enFemaleName: () =>
    util.getItem(names.eFemaleName) + " " + geth(0, rules.esurname()),
  surname: () => (history[1] = util.getItem(names.cSurname)),
  cnName: () =>
    geth(1, rules.surname()) +
    util.getItem(names.cMaleName.concat(names.cFemaleName)),
  cnMaleName: () => geth(1, rules.surname()) + util.getItem(names.cMaleName),
  cnFemaleName: () =>
    geth(1, rules.surname()) + util.getItem(names.cFemaleName),
  enState: () => {
    let index = util.getInt(0, names.eStates.length - 1);

    if (!history[2]) history[2] = index;
    return names.eStates[geth(2, index) as number];
  },
  cnState: () => {
    let index = util.getInt(0, names.cStates.length - 1);

    if (!history[2]) history[2] = index;
    return names.cStates[geth(2, index) as number];
  },
  company: () =>
    util.getItems(names.commonWord, util.getInt(2, 3)).join("") +
    util.getItem(names.companyNature) +
    "有限公司",
  road: () =>
    util.getItem(names.road) +
    new RandExp(/(路|街|大道)(1\d{3}|[1-9]\d{2})号/).gen(),
  build: () =>
    util.getItems(names.commonWord, 2).join("") +
    util.getItem(names.buildNature),
  job: () => util.getItem(names.jobs),
  file: (...exts) => {
    let ext,
      name = new RandExp(/[a-zA-Z][-_]*[a-zA-Z0-9]{1,9}/).gen();

    if (exts) ext = exts.length > 1 ? util.getItem(exts) : exts;
    else ext = util.getItem(["mp3", "doc", "txt"]);
    return `${name}.${ext}`;
  },
  fieldType: (str: "mysql" | "sqlserver" | "oracle" | "sqlite" = "mysql") => {
    let ds = {
      mysql: ["VARCHAR", "TEXT", "INTEGER", "FLOAT", "BLOB", "DATETIME"],
      sqlserver: ["nvarchar", "ntext", "decimal", "datetime", "bit", "int"],
      oracle: ["NVARCHAR2", "BLOB", "INTEGER", "DATE", "RAW", "LONG"],
      sqlite: ["INTEGER", "REAL", "INTEGER", "TEXT", "BLOB"]
    };
    return util.getItem(ds[str]);
  }
};
