import SpecificRules, { SettingOption, RuleFunction, rulesName } from './SpecificRules';

export { SettingOption, RuleFunction as MethodFuction }

/**
 * @class 数据生成、模拟
 */
export default class Maker extends SpecificRules {
    private __OptPropKey:string = 'makerOption';
    private __parseTypes:string[] = ['int', 'number', 'increment', 'bool'];

    constructor(option?:SettingOption) {
        super(option);
    }

    /**
    * 生成模拟数据
    * @param {string} [ruleStr] 方法属性名
    * @returns {string | number | boolean} 返回模拟数据
    * @example
    * get('md5');
    */
    get(methodName: rulesName, ...args: any[]): string | number | boolean {
        let result = '';

        const rule = this.__rules[methodName];
        if (rule) {            
            if (rule instanceof RegExp) result = this.__rules.regexp(rule);
            else {
                if (methodName === 'custom' && args.length > 1) this.__methods[args[0]].args = args.slice(1);
                result = (<RuleFunction>rule)(...args) as string;
            }
        } else throw new TypeError(`没有找到“${methodName}”相关生成数据的方法！`);

        return result;
    } 

    /**
     * 批量数据--模版生成
     * @param content
     * @param n1
     * @param n2
     */
    private bulk(content: string, n1?: number, n2?: number):string {
        let num = 0;

        if (typeof n1 === 'number' && typeof n2 === 'number') num = this.__rules.int(n1, n2);
        else if (typeof n1 === 'number') num = n1;

        if (num > 0) {
            let list = [], i;

            for (i = 0; i < num; i++) list.push(content);
            return '[' + list.join(',') + ']';

        } else return content;
    }

    /**
     * 递归嵌套数据--模版生成
     * @param content 
     * @param level
     * @param keyName
     * @param num
     */
    private nested(content: string, level:number, keyName:string, num?:number) {
        let newstr = content;
        const makedata = ():void => {
            level--;
            if (level < 0) return void 0;
            newstr = newstr.replace(/(?<=_@@).*(?=_##)/,($0):any => {
                return `${$0},${keyName}:${this.bulk(`_@@${$0}_##`, num )}`;
            })
            makedata();
        };

        makedata();
        return newstr;
    }

    /**
     * 批量、嵌套数据模板，选项转换 
     * @param content 
     */
    private convertOption (content: string):string {
        let objbody:string, n1:number, n2:number, itemsKey:string;
        const reg = new RegExp(`"${this.__OptPropKey}":\\[([^\\]]+)\\],?`);

        objbody = content.replace(reg, ($0, $1): any  => {
            let args = $1.split(',');

            n1 = +args[0];
            n2 = args.length > 1 ? +args[1] :void 0;
            itemsKey = args.length > 2 ? args[2] :void 0;
            return '';      
        });        
        if (typeof itemsKey === 'string') objbody = this.nested(objbody, n1, itemsKey, n2);
        else objbody = this.bulk(objbody, n1, n2);

        return objbody;
    }

    /**
     * 含循环输出配置的模板内容转换
     * @param content
     */
    private findBlock(content: string):string {
        let s1 = content;
        const rpb = (str:string) => str.replace(/\{/g,'_@@').replace(/\}/g, '_##'); // 转换子对象标识，便于获取父对象
        const unrpb  = (str:string) => str.replace(/_@@/g,'{').replace(/_##/g, '}'); // 子对象标识转换回来
         
        const callfn = ():void => { // 递归获取子对象块 
            if (s1.indexOf(this.__OptPropKey) === -1) return void 0; 

            s1 = s1.replace(/\{(?=(?:(?!\{)[\s\S])*$)[\s\S]*?\}/,($0):any => {          
                if (new RegExp(this.__OptPropKey).test($0)) return this.convertOption(rpb($0));
                else return rpb($0);
            })
            callfn();
        }
        callfn();
        return unrpb(s1);
    }
    
    /**
     * 模版输出项解析
     * @param content
     */
    private parseTPL(content: string): string {
        return content.replace(/<%([^(%>)\n\r]+)%>/g, ($0, $1): any  => {
            if ($1.indexOf(',') > -1) {
                let args = $1.split(',');

                args.forEach( (item:any, i:number) => {
                    if (/^true$/.test(item)) args[i] = true;
                    else if (/^false$/.test(item)) args[i] = false;
                    else if (/^(\-|\+)?\d+(\.\d+)?$/.test(item)) args[i] = +item;
                });
                if (args.length > 0)  return this.get(args.shift(), ...args);
            } else {
                return this.get($1);
            }
        })
    }

    /**
     * 根据模块内容，生成数据
     * @param {tring | object} content JSON模版内容
     * @param {string | boolean} parseValueType 是否需要转换值的类型，默认是，即转换值类型
     * @param {string} optionKey 自定义循环输出的对象属性名，默认为makerOption
     * @returns {tring | object} 
     */
    make <T extends string | object>(content: T, parseValueType?:string | boolean, optionKey?:string): T{
        try {
            let data: string, tpl:string;
            const isobject = typeof content === 'object', 
                cls = (str:string) => str.replace(/\s+/g,""),
                hasParse = typeof parseValueType ==='boolean' ? parseValueType : true;

            if (typeof parseValueType ==='string') {
                let typs = cls(parseValueType).split(',');
                typs.forEach(item => {
                    if (this.__parseTypes.indexOf(item) === -1 && this.__rules.hasOwnProperty(item)) 
                        this.__parseTypes.push(item);
                });
            }
            tpl = cls(isobject ? JSON.stringify(content) : <string>content);
            if (typeof optionKey == 'string' && optionKey !== '') this.__OptPropKey = optionKey;
            if (hasParse) {
                const reg = new RegExp(`(?!:\\s*)"<%\\s*(${this.__parseTypes.join('|')})[^%>"]*%>"`,'g'),
                    ns = (str:string) => str.replace(reg, ($0):any => $0.replace(/"/g,''));

                data = this.parseTPL(this.findBlock(ns(tpl)));
            }
            else data= this.parseTPL(this.findBlock(tpl));

            return isobject ? JSON.parse(data) : data;
        } catch (error) {
            throw new SyntaxError(`请检查模板格式！${error.message}`);
        }        
    }
}
