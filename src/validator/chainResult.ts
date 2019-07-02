import Chain, { ChainBase } from './chainNode';
import { findChain, group, msgPrint, parentPath} from './chainUtil';
import { message, config } from './message';
import { getRule, AsyncValidatorRule } from './asyncValidatorRule';

export interface ChainConstructor extends ChainBase {
    readonly result: boolean;
    readonly asyncResult: Promise<boolean>;
    readonly isAsync: boolean;
    readonly rule: any[];
    trigger(type: string): this;
}

/**
 * 验证结果处理
 */
export default class ChainResult extends Chain implements ChainConstructor {
    /**
   * 取同步验证结果
   */
    get result(): boolean {
        if (this.value === void 0) {
            throw new TypeError('没有找到需要验证对象，请检查！');
        }
        const checkeds: boolean[] = [];
        const val = typeof this.value === 'string' ? this.value.trim() : this.value;

        if (this.substruct && typeof this.value === 'object') {
            const res = this.eachValid();

            if(typeof res === 'boolean') checkeds.push(res);
        }
        if (this.map.indexOf('required') === -1 && (val === '' || val === null)) {
            return true;
        } // 非必需，无值终止判断

        this.map.forEach(k => {
            const res = this.validNode(k);

            if (typeof res === 'boolean') {
                checkeds.push(res);
            } else if (Promise && res instanceof Promise) {
                // 索引异步函数
                if(this.sync === true) this.sync = false;
                this.asyncFns.push(res);
                if (typeof k[1][0] === 'string') {
                    this.asyncParams.push(k[1]);
                } else {
                    this.asyncParams.push(null);
                }
            }
        });
        if (this.sync) {
            this.together();
        }
        return checkeds.length > 0 ? checkeds.indexOf(false) === -1 : false;
    }

    /**
   * 取异步验证结果
   */
    get asyncResult(): Promise<boolean> {
        const checked = this.result;
        return new Promise((resolve, reject) => {
            if (this.substruct && typeof this.value === 'object') {
                const res = this.eachValid();

                if(res instanceof Promise) this.asyncFns.push(res);
            }
            Promise.all(this.asyncFns)
                .then(res => {
                    res.forEach((v, i) => {
                        if (this.asyncParams[i]) {
                            this.bindCustom(this.asyncParams[i], v);
                        }
                    });
                    this.together();
                    resolve(res.concat([checked]).indexOf(false) === -1);
                })
                .catch(error => {
                    reject(error);
                });
        });
    }

    get rule(): AsyncValidatorRule[] {
        const check = (k: string | (string | any[])[], value: any) => this.check(value).validNode(k);
        const onFault = () => this.faults;
        const msg = this.format(message.required);
        const evt = this.eventType === '' ? this.eventType : void 0;

        return getRule(this.map, check, onFault, msg, evt);
    }

    get isAsync(): boolean {
        return !this.sync;
    }
    private asyncFns: Promise<boolean>[] = [];
    private asyncParams: any[] = [];
    private sync = true;
    private eventType: string = '';

    public trigger(type: string) {
        this.eventType = type;
        return this;
    }

    // 集中回调未通过验证项
    private together(): void {
        if (this.failed.together && Object.keys(this.faults).length > -1) {
            this.failed.together(this.faults);
        }
    }

    private eachValid(): boolean | Promise<boolean> {
        let lastpath: (string | number)[];
        const chains: this[] = [];
        const addChain = (path: (string | number)[], chain: this): void => {            
            let c = chain.check(this.value, path);
            if(config.printout) {
                const pi = msgPrint(path);

                if (pi) {
                    c = c.on(pi);
                }     
                if (!lastpath) lastpath = [];       
                lastpath = path;
            } 
            chains.push(c); 
        };
        
        findChain(this.constructor, this.substruct, [], addChain);
        if(config.printout) parentPath.path = lastpath;
        return group(chains);
    }
}
