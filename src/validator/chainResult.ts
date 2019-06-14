import { Chain, ChainBase } from "./chain";
import { rules, RulesMap, RuleFunction } from "./rules";
import { message, MessageInfo, config } from "./message";

export type ruleNames = keyof RulesMap;

export interface IChain extends ChainBase {
  readonly result: boolean;
  trigger(type: string): this;
  readonly rule: any[];
}

export default class ChainResult extends Chain implements IChain {
  private faults: MessageInfo; // 未通过项
  private eventType: string = "";

  /**
   * 单项单规则验证
   * @param {*} value 检测的值，必含
   * @param {string} [ruleStr] 规则属性，默认为判断是否为空，可选
   * @param {...*} args 对比值、参考值等自定义验证方法扩展参数，可选
   * @returns {boolean} 是否验证通过
   * @example
   * __chk('password1','eq','password2')
   */
  private __chk(
    value: any,
    ruleName: ruleNames = "required",
    ...args: any[]
  ): boolean {
    let passed = false,
      r = rules[ruleName],
      v = typeof value === "string" ? value.trim() : value;

    if (r) {
      if (r instanceof RegExp) passed = (<RegExp>r).test(v);
      else if (typeof r === "function") passed = (<RuleFunction>r)(v, ...args);
    } else throw new TypeError(`没有找到“${ruleName}”相关验证规则！`);

    return passed;
  }

  private format(info: string): string {
    let nn = this.names[2].concat();

    return info
      .replace(/%n/g, this.names[0])
      .replace(/%t/g, n => (nn.length > 0 ? nn.shift() : ""));
  }

  private __chkItem(item: string | (string | any[])[]): boolean {
    let rs: boolean = false;

    if (typeof item === "string") {
      rs = this.__chk(this.value, <ruleNames>item);
      if (rs === false) {
        // 验证错误
        if (!this.faults) this.faults = {};
        this.faults[item] = this.format(<string>message[item]);
        if (config.printout) console.warn(`【${item}】:`, this.faults[item]);
        if (this.failed[item]) this.failed[item]();
      } else if (this.passed[item]) this.passed[item](); // 验证通过
    } else if (Array.isArray(item)) {
      let key = <string>item[0],
        args = <any[]>item[1],
        sub = args[0],
        fiters = ["min", "max", "custom", "in", "has"],
        hasFiterKey = fiters.indexOf(key) === -1,
        isCustom = key === "custom" && typeof sub === "string";

      this.names[2] = []; // 将实参内容对消息格式化
      if (this.names[1].length === 0)
        this.names[1].push(hasFiterKey ? "对比值" : "范围值");
      if (args.length > 0 && hasFiterKey) {
        args.forEach(a => {
          // 时间、数字特别处理
          if (typeof a === "number" || a instanceof Date)
            this.names[2].push(a + "");
          else if (this.names[1].length > 0)
            this.names[2].push(this.names[1].shift());
        });
      } else if (this.names[1].length > 0)
        this.names[2].push(this.names[1].shift());

      rs = this.__chk(this.value, <ruleNames>key, ...args);

      if (rs === false) {
        // 验证错误
        if (!this.faults) this.faults = {};
        if (isCustom) {
          let mr = message.customItems,
            fc = this.faults.customItems;

          if (!fc) fc = {};
          fc[sub] = mr[sub] ? mr[sub] : this.format(<string>message[key]);
          if (config.printout) console.warn(`【custom.${sub}】:`, fc[sub]);
          if (this.failed["$" + sub]) this.failed["$" + sub]();
        } else {
          this.faults[key] = this.format(<string>message[key]);
          if (config.printout) console.warn(`【${key}】:`, this.faults[key]);
        }
        if (this.failed[key]) this.failed[key]();
      } else {
        // 验证通过
        if (isCustom && this.passed["$" + sub]) this.passed["$" + sub]();
        if (this.passed[key]) this.passed[key]();
      }
    } else {
      throw new TypeError("链参数设置有错误！");
    }
    return rs;
  }

  /**
   * 取最终验证结果
   */
  get result(): boolean {
    if (this.value === void 0) throw new TypeError("没有设定验证内容！");

    let checkeds: boolean[] = [],
      val = typeof this.value === "string" ? this.value.trim() : this.value;

    if (this.map.indexOf("required") === -1 && (val === "" || val === null))
      return true; // 非必需，无值终止判断

    this.map.forEach(k => checkeds.push(this.__chkItem(k)));
    if (this.failed["together"] && this.faults)
      this.failed["together"](this.faults); // 验证错误批量处理
    return checkeds.length > 0 ? checkeds.indexOf(false) === -1 : false;
  }

  trigger(type: string) {
    this.eventType = type;
    return this;
  }

  /**
   * async-validator 验证规则兼容处理
   */
  get rule(): any[] {
    let types = ["string", "number", "object", "array", "boolean"],
      hasTrigger = this.eventType !== "",
      isRequired = this.map.indexOf("required") > -1,
      rls: any[] = [
        {
          required: isRequired,
          message: this.format(message.required)
        }
      ];

    if (hasTrigger) rls[0].trigger = this.eventType;
    this.map.forEach(k => {
      if (typeof k === "string" && types.indexOf(k) > -1) {
        rls[0].type = k;
      } else if (k !== "required") {
        let obj: any = {};

        obj.validator = (rule: any, value: any) => {
          let result = this.check(value).__chkItem(k);

          if (result === true) return true;
          let fs = this.faults,
            msg = "";

          if (typeof k === "string") msg = <string>fs[k];
          else if (Array.isArray(k)) {
            let key = <string>k[0],
              args = k[1],
              sub = args[0];

            if (key === "custom" && fs.customItems && fs.customItems[sub])
              msg = fs.customItems[sub];
            else msg = <string>fs[key];
          }
          return new Error(msg);
        };
        if (hasTrigger) obj.trigger = this.eventType;
        rls.push(obj);
      }
    });
    return rls;
  }
}
