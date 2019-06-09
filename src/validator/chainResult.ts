import { Chain, ChainBase } from "./chain";
import { rules, RulesMap, RuleFunction } from "./rules";
import { message, MessageInfo, config } from "./message";

type ruleNames = keyof RulesMap;

export interface IChain extends ChainBase {
  readonly result: boolean;
  get(trigger?: string): any[];
}

export default class ChainResult extends Chain implements IChain {
  private faults: MessageInfo; // 未通过项

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

  private format = (info: string): string => {
    let nn = this.names[2].concat();

    return info
      .replace(/%n/g, this.names[0])
      .replace(/%t/g, n => (nn.length > 0 ? nn.shift() : ""));
  };

  /**
   * 取最终验证结果
   */
  get result(): boolean {
    if (this.value === void 0) throw new TypeError("没有设定验证内容！");

    let checkeds: boolean[] = [],
      val = typeof this.value === "string" ? this.value.trim() : this.value,
      rulesKeys = Object.keys(this.map);

    if (rulesKeys.indexOf("required") === -1 && (val === "" || val === null))
      return true; // 非必需，无值终止判断

    rulesKeys.forEach(key => {
      // 遍历要判断的项
      let rs: boolean,
        r = this.map[key];

      if (typeof r === "boolean") {
        rs = this.__chk(this.value, <ruleNames>key);
        if (rs === false) {
          // 验证错误
          if (!this.faults) this.faults = {};
          this.faults[key] = this.format(<string>message[key]);
          if (config.printout) console.warn(`【${key}】:`, this.faults[key]);
          if (this.failed[key]) this.failed[key]();
        } else if (this.passed[key]) this.passed[key](); // 验证通过
      } else if (r.length > 0) {
        let sub = r[0],
          fiters = ["min", "max", "custom", "in", "has"],
          hasFiterKey = fiters.indexOf(key) === -1,
          isCustom = key === "custom" && typeof sub === "string";

        this.names[2] = []; // 将实参内容对消息格式化
        if (this.names[1].length === 0)
          this.names[1].push(hasFiterKey ? "对比值" : "范围值");
        if (r.length > 0 && hasFiterKey) {
          r.forEach(a => {
            // 时间、数字特别处理
            if (typeof a === "number" || a instanceof Date)
              this.names[2].push(a + "");
            else if (this.names[1].length > 0)
              this.names[2].push(this.names[1].shift());
          });
        } else if (this.names[1].length > 0)
          this.names[2].push(this.names[1].shift());

        rs = this.__chk(this.value, <ruleNames>key, ...r);

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
      checkeds.push(rs);
    });
    if (this.failed["together"] && this.faults)
      this.failed["together"](this.faults); // 验证错误批量处理
    return checkeds.length > 0 ? checkeds.indexOf(false) === -1 : false;
  }

  /**
   * async-validator 验证规则兼容处理
   */
  get(trigger?: string): any[] {
    let keys = Object.keys(this.map),
      types = ["string", "number", "object", "array", "boolean"],
      r1: any = {
        required: keys.indexOf("required") > -1,
        message: message.required
      },
      r2: any = {
        validator: (rule: any, value: any) => {
          let result = this.check(value).result,
            errs: string[] = [];

          if (result === false) {
            let fault = this.faults;

            Object.keys(fault).forEach(f => {
              if (f !== "customItems") errs.push(<string>fault[f]);
            });
            if (fault.customItems)
              Object.keys(fault.customItems).forEach(n =>
                errs.push(<string>fault.customItems[n])
              );
          }
          return result ? result : new Error(errs.join("\n"));
        }
      };

    for (let i = 0; i < types.length; i++) {
      if (keys.indexOf(types[i]) > -1) {
        r1.type = types[i];
        break;
      }
    }
    if (trigger) r1["trigger"] = r2["trigger"] = trigger;
    return [r1, r2];
  }
}
