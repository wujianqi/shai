import RandExp from 'randexp';
import md5 from 'md5';
import { util } from './util';
import names from './names.json';

export interface RuleFunction {
    (...values: any[]): boolean | string | number;
}

export interface RulesInterface {
    [key:string]: RegExp | RuleFunction;
    md5(arg?: string, arg2?:boolean): string;
    uuid(arg?: string): string;
    now(arg?: string): string;
    exp(arg?: string | RegExp): string;
    enum<T extends boolean | string | number>(...args: T[]): T;
    int(arg1?: number, arg2?: number): number;
    number(arg1?: number, arg2?: number, arg3?: number): number;
    bool():boolean;
    month():number;
    day():number;
    minute():number;    
    validcode(arg?: number): string;
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
    english(arg: string, num?: number): string;
    chinese(arg: string, num?: number): string;
    ip(local?: boolean): string;
    text(arg?: string, n1?: number, n2?: number): string;
    price(arg1?: number, arg2?: number, arg3?: boolean): string;
    enName():string;
    enMaleName():string;
    enFemaleName():string;
    surname():string;
    cnName():string;
    cnMaleName():string;
    cnFemaleName():string;   
    enState():string;
    cnState():string;
    company():string;
    address():string;
}

export const rules:RulesInterface = {
	md5: (arg: string = new Date().getTime() + '', isShorter: boolean = false): string => {
		const value = md5(arg);
		return isShorter ? value.substr(8, 16) : value;
	},
	uuid: (arg: string = '-'): string => {
		let d = new Date().getTime(),
			str = 'xxxxxxxx' + arg + 'xxxx' + arg + '4xxx' + arg + 'yxxx' + arg + 'xxxxxxxxxxxx',
			uuid = str.replace(/[xy]/g, function (c) {
				const r = (d + Math.random() * 16) % 16 | 0;

				d = Math.floor(d / 16);
				return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
			});

		return uuid;
	},
	now: (arg?: string): string => {
		return util.formatDate(new Date(), (arg ? arg : 'yyyy-MM-dd hh:mm:ss'));
	},
	exp: (arg?: string | RegExp): string => arg ? new RandExp(arg).gen() : new RandExp(/.+/).gen(),
	enum: <T extends boolean | string | number>(...args: T[]): T => util.getItem(args),
    int: (arg1: number = 0, arg2: number = 100) => util.getInt(arg1, arg2),
    number: (arg1: number = 0, arg2: number = 10000, arg3: number = 2) => util.getNumber(arg1, arg2, arg3),
    bool: () => util.getItem([true, false]),
    month: () => util.getInt(1, 12),
    day: () => util.getInt(1, 31),
    hour: () => util.getInt(0, 23),
    minute: () => util.getInt(1, 59),    
    validcode: (arg = 4) => new RandExp('[A-Z0-9]{' + arg + '}').gen(),
    mid: /[1-9A-Z][0-9A-Z]{1,7}(\-[0-9A-Z]{2,6}){0,2}/,
    account: /[a-zA-Z]{1,3}[a-zA-Z0-9]{3,6}/,
    password: /[a-zA-Z0-9][a-zA-Z0-9\W_]{7}/,
    color: /#[A-F0-9]{6}/,
    url: /http(s?):\/\/www\.[a-z]{3,8}\.(com|cn|net|org|com\.cn)(\/[a-z]{3,5})?/,
    mail: /([a-z0-9]{3,6}[-_]?[a-z0-9]{3,6})@[a-z]{3,8}\.(com|cn|net|org)/,
    mobile: /(13\d|(14[5-7])|(15([0-3]|[5-9]))|17(0|1|8])|18\d)\d{8}/,
    port: /[1-9]\d{3}/,
    bizcode: /91[1-4]\d{5}[0-9A-HJ-NPQRTUWXY]{10}/,
    bankcard: /62(([0-3]\d)(4[0-5])|5([0-3]|5|8|9)|70|8[2-3])\d{12,15}/,
    qq: /[1-9]\d{4,10}/,

    english: (arg: string, num: number = 1): string => {
        const d = arg ? arg : 'abcdefghijklmnopqrstuvwxyz';

        return util.getItems(d.split(''), num).join('');
    },
    chinese: (arg: string, num: number = 1): string => {
        let d = arg ? arg : String.fromCharCode(util.getInt(19968, 40869));

        return util.getItems(d.split(''), num).join('');
    },    
    ip: (local: boolean = false) => {
        const node = "(\\d{1,2}|1\\d\\d|2[0-4]\\d|25[0-5])";
        if (local) {
            return new RandExp('((192\\.168)|(172\\.0)|(10\.0))\\.' + node + '\\.' + node).gen();
        } else {
            return new RandExp([node, node, node, node].join('\\.')).gen();
        }
    },
    text: (arg: string = '填充文本样式', n1?: number, n2?: number): string => {
        let d = 40;

        if (typeof n1 === 'number' && typeof n2 === 'number') d = util.getInt(n1, n2);
        else if (typeof n1 === 'number') d = n1;
        return Array(d + 1).join(arg);
    },
    price: (arg1: number = 0, arg2: number = 10000, arg3: boolean = true): string => {
        let n, d = util.getNumber(arg1, arg2, 2);
        const r1 = /\d{1,3}(?=(\d{3})+$)/g, r2 = /^(-?)(\d+)((\.\d+)?)$/;

        if (arg3) n = (d + '').replace(r2, ((s, s1, s2, s3) => s1 + s2.replace(r1, '$&,') + s3));
        else n = d + '';
        return n;
    },    
    enName: () => util.getItem(names.eMaleName.concat(names.eFemaleName)) + ' ' + util.getItem(names.eSurname),
    enMaleName: () => util.getItem(names.eMaleName) + ' ' + util.getItem(names.eSurname),
    enFemaleName: () => util.getItem(names.eFemaleName) + ' ' + util.getItem(names.eSurname),
    surname:() => util.getItem(names.cSurname),
    cnName: () => util.getItem(names.cSurname) + util.getItem(names.cMaleName.concat(names.cFemaleName)),
    cnMaleName: () => util.getItem(names.cSurname) + util.getItem(names.cMaleName),
    cnFemaleName: () => util.getItem(names.cSurname) + util.getItem(names.cFemaleName),    
    enState: () => util.getItem(names.eStates),
    cnState: () => util.getItem(names.cStates),
    company: () => util.getItems(names.commonWord, 2).join('') + util.getItem(names.companyNature) + '有限公司',
    address: () => {
        return  util.getItem(names.road)
            + new RandExp(/(路|街)(1\d{3}|[1-9]\d{2})号/).gen()
            + new RandExp(/[A-F](栋((一|二|三|四|五)单元)|座)?[1-9]0[1-6]室/).gen()
            + util.getItems(names.commonWord, 2).join('') + util.getItem(names.buildNature);
    }
    
}
