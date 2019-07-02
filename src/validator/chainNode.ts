import Chain, { ChainBase } from './chain';
import { config, message, MessageInfo } from './message';
import { ValidFunction, rules } from './rules';

type ruleNames = keyof typeof rules;
export { ChainBase }

/**
 * 验证链单节点处理
 */
export default class ChainNode extends Chain {
    protected faults: MessageInfo = {}; // 未通过项

    // 格式化错误消息
    protected format(info: string): string {
        const nn = this.names[2].concat();

        return info
            .replace(/%n/g, this.names[0])
        /* eslint-disable @typescript-eslint/no-unused-vars */
            .replace(/%t/g, n => (nn.length > 0 ? nn.shift() : ''));
    }

    // 默认的错误消息处理
    private padding(key: string, args: any[], hasCustomKey:boolean = false): void {
        const hasFiterKey = ['min', 'max', 'custom', 'in', 'has'].indexOf(key) === -1;   
        const targets = this.names[1]; // 对比值
        let msgs:string[] = this.names[2] = []; // 单节点验证消息
        let params = (key === 'custom' && hasCustomKey) ? args.slice(1) : args;

        if (params.length > 0) {
            params.forEach(a => {
                let msg;
                // 时间、数字特别处理
                if (typeof a === 'number' || a instanceof Date || !isNaN(Number(a.toString()))) {                    
                    msg = String(a);
                } else if(targets.length === 0) {
                    msg = hasFiterKey ? '对比值' : '范围值';                    
                } else {
                    msg = targets.shift();
                }
                msgs.push(msg);
            });
        }
    }

    /**
   * 单个规则验证
   * @param {*} value 检测的值，必含
   * @param {string} [ruleStr] 规则属性，默认为判断是否为空，可选
   * @param {...*} args 对比值、参考值等自定义验证方法扩展参数，可选
   * @returns {boolean} 是否验证通过
   * @example
   * chk('password1','eq','password2')
   */
    private chk(value: any, ruleName: ruleNames = 'required', ...args: any[]): boolean | Promise<boolean> {
        let passed: boolean | Promise<boolean> = false;
        const r = rules[ruleName],
            v = typeof value === 'string' ? value.trim() : value;

        if (r) {
            if (r instanceof RegExp) {
                passed = (r as RegExp).test(v);
            } else if (typeof r === 'function') {
                passed = (r as ValidFunction)(v, ...args);
            }
        } else {
            throw new TypeError(`没有找到“${ruleName}”相关验证规则！`);
        }
        return passed;
    }

    // 自定义函数的消息处理
    protected bindCustom(args: any[], passed: boolean): void {
        const key = args[0] as string;
        if (passed) {
            if (this.passed['$' + key]) {
                this.passed['$' + key]();
            }
            if (this.passed[key]) {
                this.passed[key]();
            }
        } else {
            this.padding('custom', args, true);
            const mr = (message as MessageInfo).customItems;
            const item: {
                [key: string]: string;
            } = {};

            item[key] = this.format(mr[key] ? mr[key] : message.custom as string);            
            if (this.faults.customItems){
                Object.assign(this.faults.customItems, item);
            } else {
                this.faults.customItems = item;
            }            
            if (config.printout) {
                console.warn(`【custom.${key}】:`, item[key]);
            }
            if (this.failed['$' + key]) {
                this.failed['$' + key]();
            }
            if (this.failed[key]) {
                this.failed[key]();
            }
        }
    }

    // 单个验证链节点验证，同步处理错误消息与结果
    protected validNode(node: string | (string | any[])[]): boolean | Promise<boolean> {
        let rs: boolean | Promise<boolean> = false;

        if (typeof node === 'string') { // 单参数方法或正则
            rs = this.chk(this.value, node as ruleNames);
            if (rs === false) {
                this.faults[node] = this.format((message as MessageInfo)[node] as string);
                if (config.printout) {
                    console.warn(`【${node}】:`, this.faults[node]);
                }
                if (this.failed[node]) {
                    this.failed[node]();
                }
            } else if (this.passed[node]) {
                this.passed[node]();
            }
        } else if (Array.isArray(node)) { // 多参数方法
            const key = node[0] as string,
                args = node[1] as any[],
                isCustom = key === 'custom' && typeof args[0] === 'string';

            rs = this.chk(this.value, key as ruleNames, ...args);
            // 自定义函数特殊处理
            if (isCustom && typeof rs === 'boolean') {
                this.bindCustom(args, rs);
            } else if (rs === false) {
                this.padding(key, args);
                this.faults[key] = this.format((message as MessageInfo)[key] as string);
                if (config.printout) {
                    console.warn(`【${key}】:`, this.faults[key]);
                }
                if (this.failed[key]) {
                    this.failed[key]();
                }
            } else if (rs === true) {
                if (this.passed[key]) {
                    this.passed[key]();
                }
            }
        } else {
            throw new TypeError('链参数设置有错误！');
        }
        return rs;
    }
}