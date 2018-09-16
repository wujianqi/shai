import ValidatorBase, { ValidBaseInterface, ValidRuleFunc, Chain } from './validatorbase';

export interface Item {
    value: any;
    callback?: (faults: string[]) => void;
    rule?: ValidChain;
    require?: boolean;
    english?: boolean;
    qq?: boolean;
    age?: boolean;
    zipcode?: boolean;
    ip?: boolean;
    port?: boolean;
    bizcode?: boolean;
    invoice?: boolean;
    bankcard?: boolean;
    currency?: boolean;
    float?: boolean;
    int?: boolean;
    decimal?: boolean;
    chinese?: boolean;
    mail?: boolean;
    url?: boolean;
    account?: boolean;
    password?: boolean;
    safe?: boolean;
    dbc?: boolean;
    hex?: boolean;
    color?: boolean;
    ascii?: boolean;
    base64?: boolean;
    md5?: boolean;
    uuid?: boolean;
    mobile?: boolean;
    telphone?: boolean;
    phone?: boolean;
    percent?: boolean;
    year?: boolean;
    month?: boolean;
    day?: boolean;
    hour?: boolean;
    minute?: boolean;
    second?: boolean;
    time?: boolean;
    date?: boolean;
    datetime?: boolean;
    file?: boolean;
    image?: boolean;
    word?: boolean;
    lon?: boolean;
    lat?: boolean;
    approval?: boolean;
    citycode?: boolean;
    address?: boolean;
    upper?: boolean;
    lower?: boolean;
    even?: boolean;
    odd?: boolean;
    ipv6?: boolean;
    bodycard?: boolean;
    autocard?: boolean;
    not?: string | number | Date;
    eq?: string | number | Date;
    gt?: string | number | Date;
    gte?: string | number | Date;
    lt?: string | number | Date;
    lte?: string | number | Date;
    between?: string | number | Date;
    min?: (string | number | Date)[];
    max?: (string | number | Date)[];
    len?: string | number;
    in?: string | number;
    minlength?: string | number;
    maxlength?: string | number;
    [key: string]: any;
};

export interface ValidChain extends Chain {
    require?: ValidChain;
    english?: ValidChain;
    qq?: ValidChain;
    age?: ValidChain;
    zipcode?: ValidChain;
    ip?: ValidChain;
    port?: ValidChain;
    bizcode?: ValidChain;
    invoice?: ValidChain;
    bankcard?: ValidChain;
    currency?: ValidChain;
    float?: ValidChain;
    int?: ValidChain;
    decimal?: ValidChain;
    chinese?: ValidChain;
    mail?: ValidChain;
    url?: ValidChain;
    account?: ValidChain;
    password?: ValidChain;
    safe?: ValidChain;
    dbc?: ValidChain;
    hex?: ValidChain;
    color?: ValidChain;
    ascii?: ValidChain;
    base64?: ValidChain;
    md5?: ValidChain;
    uuid?: ValidChain;
    mobile?: ValidChain;
    telphone?: ValidChain;
    phone?: ValidChain;
    percent?: ValidChain;
    year?: ValidChain;
    month?: ValidChain;
    day?: ValidChain;
    hour?: ValidChain;
    minute?: ValidChain;
    second?: ValidChain;
    time?: ValidChain;
    date?: ValidChain;
    datetime?: ValidChain;
    file?: ValidChain;
    image?: ValidChain;
    word?: ValidChain;
    lon?: ValidChain;
    lat?: ValidChain;
    approval?: ValidChain;
    citycode?: ValidChain;
    address?: ValidChain;
    upper?: ValidChain;
    lower?: ValidChain;
    even?: ValidChain;
    odd?: ValidChain;
    ipv6?: ValidChain;
    bodycard?: ValidChain;
    autocard?: ValidChain;
    not?: (arg: string | number | Date) => ValidChain;
    eq?: (arg: string | number | Date) => ValidChain;
    gt?: (arg: string | number | Date) => ValidChain;
    gte?: (arg: string | number | Date) => ValidChain;
    lt?: (arg: string | number | Date) => ValidChain;
    lte?: (arg: string | number | Date) => ValidChain;
    between?: (arg: string | number | Date) => ValidChain;
    min?: (args: (string | number | Date)[]) => ValidChain;
    max?: (args: (string | number | Date)[]) => ValidChain;
    len?: (arg: string | number) => ValidChain;
    in?: (arg: string | number) => ValidChain;
    minlength?: (arg: string | number) => ValidChain;
    maxlength?: (arg: string | number) => ValidChain;
}

export interface ValidatorInterface extends ValidBaseInterface {
    readonly type: ValidChain;
    check(value: any, rn?: string, ...args: any[]): boolean;
    checkItem(options: Item): boolean;
    checkItems(items: Item[]): boolean;
}

/**
 * @class 验证类
 */
export default class Validator extends ValidatorBase implements ValidatorInterface {
    /**
   * 单项单规则验证
   * @param {*} value 检测的值，必含
   * @param {string} [ruleStr] 规则属性，默认为判断是否为空，可选
   * @param {...*} args 对比值、参考值等自定义验证方法扩展参数，可选
   * @returns {boolean} 是否验证通过
   * @example
   * check('password1','==','password2')
   */
    check(value: any, rn: string = 'require', ...args: any[]): boolean {
        let passed = false;

        const val = typeof value === 'string' ? value.trim() : value,
            rule = this.getRule(rn);

        if (rule) {
            if (rule instanceof RegExp) passed = rule.test(val + '');
            else passed = <boolean>rule(val, ...args);
        } else throw new Error(`没有找到“${rn}”相关验证规则！`);

        return passed;
    }

    /**
   * 单项组合规则验证，对象方式
   * @param {object} options 属性对象。
   * @prop {*} value 必备选项，验证目标数据
   * @prop {boolean} require 可选, 值不为空才检测
   * @prop {type} rule 使用链式表达式检查，可选
   * @prop {function} callback 默认验证结果处置方法，可选，参数faults为没通过的项的集合
   * @returns {boolean} 是否验证通过
   * @example
   * checkItem({value:'password1', password:true, eq:'password2'})
   */
    checkItem(options: Item): boolean {
        let passed = false, opts = options, cb, val = opts.value;
        const hasVal = (!val || (val + '').trim() === '');

        delete opts.value;
        if (opts.hasOwnProperty('callback') && opts.callback) { // 取回调
            cb = opts.callback;
            delete opts.callback;
        }

        if (opts.hasOwnProperty('rule') && opts.rule) { // 转换链式规则为动态属性
            opts.rule.__caches.forEach(t => {
                if (t instanceof Object) (<any>Object).assign(opts, t);
                else opts[t] = true;
            });
            delete opts.rule;
        }

        if (opts.hasOwnProperty('require') && !opts['require'] && hasVal) passed = true;
        else {
            let checkeds: boolean[] = [], faults: string[] = [], rs;

            Object.keys(opts).forEach(k => { // 取出动态属性规则
                const prop = opts[k];

                if (Array.isArray(prop)) rs = this.check(val, k, ...prop);
                else if (typeof prop === 'boolean') rs = this.check(val, k) && prop;
                else rs = this.check(val, k, prop);
                checkeds.push(rs);
                if (rs === false) faults.push(k);
            });
            if (typeof cb === 'function') cb(faults); // 执行回调
            if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
        }
        return passed;
    }

    /**
     * 多项组合规则验证
     * @param {array} items 组对象
     * @returns {boolean} 是否验证通过
     */
    checkItems(items: Item[]): boolean {
        let passed = false, checkeds: boolean[] = [];

        if (Array.isArray(items) && items.length > 0) {
            items.forEach(item => {
                if (item instanceof Object && item.hasOwnProperty('value')) checkeds.push(this.checkItem(item));
                else throw new Error('验证组内容不合要求!');
            });
            if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
        }
        return passed;
    }

    constructor() {
        super();

        const rules = {
            'require': /.+/,
            'english': /^[A-Za-z]+$/,
            'qq': /^[1-9]\d{4,10}$/,
            'age': /^(0|[1-9]\d?|1[0-2]\d)$/,
            'zipcode': /^(\d[1-7]|[1-9][0-7])\d{4}$/,
            'ip': /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
            'port': /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,
            'bizcode': /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
            'invoice': /^(((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12]))\d{5}[1-9][1-7][0-4])$/,
            'bankcard': /^(10|30|35|37|4\d||5[0-6]|58|60|62|6[8-9]|84|8[7-8]|9[0-2]|9[4-6]|9[8-9])\d{14,17}$/,
            'aeo': /^AEO<[A-Z]{2,3}\d{4,15}[A-Z]?>$/,
            'currency': /(^[-]?[1-9]\d{0,2}($|(\,\d{3})*($|(\.\d{1,2}$))))|((^[0](\.\d{1,2})?)|(^[-][0]\.\d{1,2}))$/,
            'float': /^(\-|\+)?\d+(\.\d+)?$/,
            'int': /^-?\d+$/,
            'decimal': /^-?\d+\.\d{1,}$/,
            'chinese': /^[\u2E80-\uFE4F]+$/,
            'mail': /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
            'url': /(http|ftp|https|ws|wss):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
            'account': /^[A-Za-z0-9]+(_[A-Za-z0-9]+)*[A-Za-z0-9]+$/,
            'password': /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,}$/,
            'safe': />|<|,|\[|\]|\{|\}|\?|\/|\+|=|\||\'|\\|\'|:|;|\~|\!|\@|\#|\*|\$|\%|\^|\&|\(|\)|`/i,
            'dbc':/[\uFF01-\uFF60\uFF0A-\uFF5F\u3000-\u3003]/,
            'hex': /^[0-9A-F]+$/i,
            'color': /^#?[a-fA-F0-9]{6}$/i,
            'ascii': /^[\u0000-\u007F]+$/,
            'base64': /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i,
            'md5': /^(([0-9A-F]{16})|([0-9A-F]{32}))$/i,
            'uuid': /^[0-9A-F]{8}(-[0-9A-F]{4}){3}-[0-9A-F]{12}$/i,
            'mobile': /^((\+86)|(86))?(13\d|(14[5-7])|(15([0-3]|[5-9]))|166|17(0|1|8])|18\d|19(8|9))\d{8}$/,
            'telphone': /^[+]{0,1}\d{1,3}[ ]?([-]?(\d|[ ]){1,12})+$/,
            'phone': /^((\+86)|(86))?((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
            'percent': /^-?\d+(\.\d{2})?%$/,
            'year': /^(19|20)\d{2}$/,
            'month': /^(0?[1-9]|1[0-2])$/,
            'day': /^(([1-9])|([1-2]\d)|(3[0-1]))$/,
            'hour': /^((1?\d)|(2[0-3]))$/,
            'minute': /^[1-5]?\d$/,
            'time': /^(\d|([0-1]\d|2[0-3])):([0-5]\d):([0-5]\d)$/,
            'date': /^((((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13578]|1[02])\5(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13456789]|1[012])\11(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)0?2\17(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\/)0?2\25(29)))$/, // eslint-disable-line max-len
            'datetime': /^((((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13578]|1[02])\5(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13456789]|1[012])\11(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)0?2\17(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\/)0?2\25(29)))\s+(\d|([0-1]\d|2[0-3])):(\d|([0-5]?\d)):(\d|([0-5]?\d))$/, // eslint-disable-line max-len
            'file': /^([^<>/\\\|:""\*\?]+)\.\w+$/,
            'image': /^([^<>/\\\|:""\*\?]+)\.(jpg|jpeg|gif|png|bmp|svg)$/i,
            'word': /^([^<>/\\\|:""\*\?]+)\.(txt|doc|docx|rtf|pdf|wps)$/i,
            'lon': /^(\-|\+)?(0?\d{1,2}\.\d{1,15}|1[0-7]?\d{1}\.\d{1,15}|180\.0{1,15})$/,
            'lat': /^(\-|\+)?([0-8]?\d{1}\.\d{1,15}|90\.0{1,15})$/,
            'approval': /^([\u2E80-\uFE4F]+)\u5b57(\u3014|\[)(19|20)\d{2}(\u3015|\])\u7b2c?\d{1,}\u53f7$/,
            'citycode': /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12]))\d{4}$/,
            'address': /^[\u2E80-\uFE4F]+(\u5e02|\u53BF|\u533A|\u65D7|\u4E61|\u9547|\u8857\u9053|\u5DDE)\S{3,}$/,
            'isbn': /^(978\-\d\-\d{3}\-\d{5}\-[a-z0-9]$)|(978\d{9}[a-z0-9])$/i,
            'upper': /[A-Z]/,
            'lower': /[a-z]/,
            'even': <ValidRuleFunc>((arg: string | number) => ((+arg) & 1) === 0),
            'odd': <ValidRuleFunc>((arg: string | number) => ((+arg) & 1) !== 0),
            'ipv6': <ValidRuleFunc>((arg: string) => {
                const m = arg.match(/:/g),
                    t1 = m ? m.length < 8 : false,
                    t2 = /:/.test(arg),
                    t3 = /::/.test(arg),
                    t4 = m ? m.length === 1 : false,
                    t5 = /^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i.test(arg),
                    t6 = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(arg);

                return t1 && t2 && (t3 ? (t4 && t5) : t6);
            }),
            'bodycard': <ValidRuleFunc>((arg: string | number) => {
                const val = arg + '', args = val.toUpperCase().split(''),
                    factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                    parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
                    reg = /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((19|20)\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((19|20)\d{2}(0[13578]|1[02])31)|((19|20)\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;
                let sum = 0, ai = 0, wi = 0;

                for (let i = 0; i < 17; i++) {
                    ai = parseInt(args[i], 10);
                    wi = factor[i];
                    sum += ai * wi;
                }
                return reg.test(val) && parity[sum % 11] == args[17];
            }),
            'autocard': <ValidRuleFunc>((arg: string) => {
                const sn = '\\u4EAC\\u6D25\\u6CAA\\u6E1D\\u5180\\u8C6B\\u4E91\\u8FBD\\u9ED1\\u6E58\\u7696\\u9C81\\u65B0\\u82CF\\u6D59\\u8D63\\u9102\\u6842\\u7518\\u664B\\u8499\\u9655\\u5409\\u95FD\\u8D35\\u7CA4\\u9752\\u85CF\\u5DDD\\u5B81\\u743C',
                    reg1 = new RegExp('(^[' + sn + '\\u4F7F\\u9886;][A-HJ-NP-Z]([A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9\\u6302\\u5B66\\u8B66]|[DF][A-HJ-NP-Z0-9]{5}|[A-HJ-NP-Z0-9]{5}[DF])$)|(\\u7CA4Z[A-HJ-NP-Z0-9]{4}[\\u6E2F\\u6FB3])'),
                    reg2 = new RegExp('(^WJ[' + sn + '](\\d{5}|[BDGHJSTX]\\d{4}|\\d{4}[BDGHJSTX])$)|(^[A-Z]{2}\\d{5}$)/'),
                    matc = arg.match(/[A-Z]/g);

                return reg1.test(arg) && matc && matc.length < 4 || reg2.test(arg);
            }),
            'not': <ValidRuleFunc>(<T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) != (+arg2)),
            'eq': <ValidRuleFunc>(<T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) == (+arg2)),
            'gt': <ValidRuleFunc>(<T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) > (+arg2)),
            'gte': <ValidRuleFunc>(<T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) >= (+arg2)),
            'lt': <ValidRuleFunc>(<T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) < (+arg2)),
            'lte': <ValidRuleFunc>(<T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) <= (+arg2)),
            'between': <ValidRuleFunc>(<T extends string | number | Date>(arg1: T, arg2: T, arg3: T) => (+arg1) > (+arg2) && (+arg1) < (+arg3)),
            'min': <ValidRuleFunc>(<T extends string | number | Date>(arg1: T, ...args: T[]) => (+arg1) === Math.min(...args.map(item => (+item)))),
            'max': <ValidRuleFunc>(<T extends string | number | Date>(arg1: T, ...args: T[]) => (+arg1) === Math.max(...args.map(item => (+item)))),
            'in': <ValidRuleFunc>(<T extends string | number>(arg1: T, arg2: T) => (arg2 + '').indexOf(arg1 + '') > -1),
            'length': <ValidRuleFunc>(<T extends string | number>(arg1: T, arg2: T) => (arg1 + '').length == (+arg2)),
            'minlength': <ValidRuleFunc>(<T extends string | number>(arg1: T, arg2: T) => (arg1 + '').length < (+arg2)),
            'maxlength': <ValidRuleFunc>(<T extends string | number>(arg1: T, arg2: T) => (arg1 + '').length > (+arg2))
        }

        this.addRule(rules);
        this.addRule('second', rules['minute']);
    }
}