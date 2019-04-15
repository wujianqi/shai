import { Chain, RuleFunction, ChainInterface, OnFaultsFunction, CallbackFunction } from './chain';
import { objectPath } from './objectPath';

type rulefnc = { [key:string]: RuleFunction } ;

export { RuleFunction, OnFaultsFunction, CallbackFunction };

/**
 * @module 验证器
 */
export default class Validator {    
    private methods: rulefnc = {};
    private newrule: rulefnc = {
        'custom': (arg: any, key: string|RuleFunction, ...args:Array<any>) => {
            if (typeof key === 'string' && this.methods[key]) return this.methods[key](arg, ...args);
            else if (typeof key === "function") return key(arg, ...args);
        }
    };

    /**
     *  将未通过验证的信息打印出来
     */
    isdev:boolean = false;

    /**
     * 添加函数引用，在custom规则中作为参数调用
     * @param func
     */
    add(key:string, func:RuleFunction): void {
        this.methods[key] = func;
    }

    /**
     * 链式规则调用
     */
    get string(): ChainInterface {
        return (<ChainInterface>new Chain(this.newrule)).string;
    }
    get number(): ChainInterface {
        return (<ChainInterface>new Chain(this.newrule)).number;
    }
    get object(): ChainInterface {
        return (<ChainInterface>new Chain(this.newrule)).object;
    }
    get array(): ChainInterface {
        return (<ChainInterface>new Chain(this.newrule)).array;
    }
    get boolean(): ChainInterface {
        return (<ChainInterface>new Chain(this.newrule)).boolean;
    }
    get null(): ChainInterface {
        return (<ChainInterface>new Chain(this.newrule)).null;
    }

    /**
     * 链式组合规则验证
     * @param value
     */
    check(value: any):ChainInterface {      
        return new Chain(this.newrule).$set({ value: value, isdev: this.isdev });
    }

    /**
     * 按对象路径查找值进行链式验证
     * @param obj
     * @param path
     */
    get(obj:object, path:Array<number | string> | number | string) {
        return this.check(objectPath(obj, path));
    }

    /**
     * 类型与数据匹配
     * @param {string|object} JSON 数据
     * @param {object} struct 数据类型对象 (检测链)
     * @param {function} callback 自定义回调，可选，参数为未通过项、对象层级路径
     * @returns {boolean} 是否验证通过
     */
    verify(JSONData: string | object, struct: object, callback?: (faults: string[], path: (string | number)[]) => void): boolean {
        let passed = false, checkeds: boolean[] = [];
        const dataObj = typeof JSONData === 'string' ? JSON.parse(JSONData) : JSONData;

        const checkValue = (dt: string | number | object, rule: ChainInterface, p: (string | number)[]) => {
            let chain = rule.$set({value: dt});

            if (typeof callback === 'function' ) chain = chain.on((faults: string[]) => callback(faults, p));
            else if (this.isdev) chain = chain.on((faults: string[]) => {
                faults.forEach(f => console.error(`${p.join('.')}的值，不符合“${f}”项的要求！`) );
            });
            checkeds.push(chain.result);
        };
        const findMany = (path: (string | number)[], rule: ChainInterface): void => {
            let ids: number[] = [],
                lastRight = path.slice(path.lastIndexOf(0) + 1);

            path.forEach((v, i) => {
                if (v === 0) ids.push(i);
            });

            const getMany = (n: number, pr?: number) => { // 递归取数据，生成路径集
                let left = path.slice(0, ids[n]), next = n + 1,
                    p: any[], dt: any, len: number;

                if (pr && left.lastIndexOf(0) > -1) left.splice(left.lastIndexOf(0), 1, pr);
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
        const findData = (type: ChainInterface, path: (string | number)[]): void => { //匹配路径数据
            let dt = objectPath(dataObj, path);

            if (path.indexOf(0) > -1) findMany(path, type);            
            else if (dt !== void 0) {
                if (Array.isArray(dt)) dt.forEach((d, i) => {
                    checkValue(d, type, path.concat(i));
                });
                else checkValue(dt, type, path);
            } else {
                throw new TypeError(`没有找到要检查的${path.join('.')}的目标数据！`);
            }
        };
        const itemCheck = (types: any, path: (string | number)[]): void => {
            Object.keys(types).forEach(key => {                
                let p = path.concat(), t: any;
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
        if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
        return passed;
    }
}
