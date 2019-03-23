export interface RuleFunction {
	(...values: any[]): boolean;
}

export type rulesName = 'string' | 'number' | 'boolean' | 'object' | 'null' | 'array' | 'regexp' | 'custom'
	| 'require' | 'english' | 'qq' | 'age' | 'zipcode' | 'ip' | 'port' | 'bizcode' | 'invoice' | 'bankcard'
	| 'aeo' | 'currency' | 'float' | 'int' | 'decimal' | 'chinese' | 'mail' | 'url' | 'account' | 'password'
	| 'safe' | 'dbc' | 'hex' | 'color' | 'ascii' | 'base64' | 'md5' | 'uuid' | 'mobile' | 'telphone' | 'phone'
	| 'percent' | 'year' | 'month' | 'day' | 'hour' | 'minute' | 'time' | 'date' | 'datetime' | 'file' | 'image'
	| 'word' | 'lon' | 'lat' | 'approval' | 'citycode' | 'address' | 'upper' | 'lower' | 'isbn:' | 'even' | 'odd'
	| 'ipv6' | 'bodycard' | 'autocard' | 'not' | 'eq' | 'gt' | 'gte' | 'lt' | 'lte' | 'between' | 'min' | 'max'
	| 'length' | 'minlength' | 'maxlength' | 'in';

export interface RulesInterface {
	[key: string]: RegExp | RuleFunction;
	string(arg: any): boolean;
	number(arg: any): boolean;
	boolean(arg: any): boolean;
	object(arg: any): boolean;
	array(arg: any): boolean;
	null(arg: any): boolean;
	require: RegExp;
	english: RegExp;
	qq: RegExp;
	age: RegExp;
	zipcode: RegExp;
	ip: RegExp;
	port: RegExp;
	bizcode: RegExp;
	invoice: RegExp;
	bankcard: RegExp;
	aeo: RegExp;
	currency: RegExp;
	float: RegExp;
	int: RegExp;
	decimal: RegExp;
	chinese: RegExp;
	mail: RegExp
	url: RegExp;
	account: RegExp;
	password: RegExp;
	safe: RegExp;
	dbc: RegExp;
	hex: RegExp;
	color: RegExp;
	ascii: RegExp;
	base64: RegExp;
	md5: RegExp;
	uuid: RegExp;
	mobile: RegExp;
	telphone: RegExp;
	phone: RegExp;
	percent: RegExp;
	year: RegExp;
	month: RegExp;
	day: RegExp;
	hour: RegExp;
	minute: RegExp;
	time: RegExp;
	date: RegExp;
	datetime: RegExp;
	file: RegExp;
	image: RegExp;
	word: RegExp;
	lon: RegExp;
	lat: RegExp;
	approval: RegExp;
	citycode: RegExp;
	address: RegExp;
	upper: RegExp;
	lower: RegExp;
	isbn: RegExp;
	even(arg: string | number): boolean;
	odd(arg: string | number): boolean;
	ipv6(arg: string): boolean;
	bodycard(arg: string | number): boolean;
	autocard(arg: string): boolean;
	not<T extends string | number | Date>(arg1: T, arg2: T): boolean;
	eq<T extends string | number | Date>(arg1: T, arg2: T): boolean;
	gt<T extends string | number | Date>(arg1: T, arg2: T): boolean;
	gte<T extends string | number | Date>(arg1: T, arg2: T): boolean;
	lt<T extends string | number | Date>(arg1: T, arg2: T): boolean;
	lte<T extends string | number | Date>(arg1: T, arg2: T): boolean;
	between<T extends string | number | Date>(arg1: T, arg2: T, arg3: T): boolean;
	min<T extends string | number | Date>(arg1: T, ...args: T[]): boolean;
	max<T extends string | number | Date>(arg1: T, ...args: T[]): boolean;
	length<T extends string | number>(arg1: T, arg2: T): boolean;
	minlength<T extends string | number>(arg1: T, arg2: T): boolean;
	maxlength<T extends string | number>(arg1: T, arg2: T): boolean;
	in<T extends string | number | any[] | {}>(arg1: T, arg2: T): boolean;	
	regexp: (arg: any, arg2: RegExp | string ) => boolean;
	custom: (arg: any, arg2: RuleFunction ) => boolean;
}

/**
 * @module 验证规则集
 */
export const rules: RulesInterface = {
	object: (arg: any) => typeof arg === 'object' && Object.prototype.toString.call(arg) === '[object Object]',
	null: (arg: any) => !arg && typeof arg != 'undefined' && arg != 0,
	boolean: (arg: any) => typeof arg === 'boolean',
	string: (arg: any) => typeof arg === 'string',
	number: (arg: any) => typeof arg === 'number',
	array: (arg: any) => Array.isArray(arg),
	require: /.+/,
	english: /^[A-Za-z]+$/,
	qq: /^[1-9]\d{4,10}$/,
	age: /^(0|[1-9]\d?|1[0-2]\d)$/,
	zipcode: /^(\d[1-7]|[1-9][0-7])\d{4}$/,
	ip: /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/,
	port: /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,
	bizcode: /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
	invoice: /^(((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12]))\d{5}[1-9][1-7][0-4])$/,
	bankcard: /^(10|30|35|37|4\d||5[0-6]|58|60|62|6[8-9]|84|8[7-8]|9[0-2]|9[4-6]|9[8-9])\d{14,17}$/,
	aeo: /^AEO<[A-Z]{2,3}\d{4,15}[A-Z]?>$/,
	currency: /(^[-]?[1-9]\d{0,2}($|(\,\d{3})*($|(\.\d{1,2}$))))|((^[0](\.\d{1,2})?)|(^[-][0]\.\d{1,2}))$/,
	float: /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/,
	int: /^-?\d+$/,
	decimal: /^-?\d+\.\d{1,}$/,
	chinese: /^[\u2E80-\uFE4F]+$/,
	mail: /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
	url: /(http|ftp|https|ws|wss):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
	account: /^[A-Za-z0-9]+(_[A-Za-z0-9]+)*[A-Za-z0-9]+$/,
	password: /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,}$/,
	safe: />|<|,|\[|\]|\{|\}|\?|\/|\+|=|\||\'|\\|\'|:|;|\~|\!|\@|\#|\*|\$|\%|\^|\&|\(|\)|`/i,
	dbc: /[\uFF01-\uFF60\uFF0A-\uFF5F\u3000-\u3003]/,
	hex: /^[0-9A-F]+$/i,
	color: /^#?[a-fA-F0-9]{6}$/i,
	ascii: /^[\u0000-\u007F]+$/,
	base64: /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i,
	md5: /^(([0-9A-F]{16})|([0-9A-F]{32}))$/i,
	uuid: /^[0-9A-F]{8}(-[0-9A-F]{4}){3}-[0-9A-F]{12}$/i,
	mobile: /^((\+86)|(86))?(13\d|(14[5-7])|(15([0-3]|[5-9]))|166|17(0|1|8])|18\d|19(8|9))\d{8}$/,
	telphone: /^[+]{0,1}\d{1,3}[ ]?([-]?(\d|[ ]){1,12})+$/,
	phone: /^((\+86)|(86))?((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/,
	percent: /^-?\d+(\.\d{2})?%$/,
	year: /^(19|20)\d{2}$/,
	month: /^(0?[1-9]|1[0-2])$/,
	day: /^(([1-9])|([1-2]\d)|(3[0-1]))$/,
	hour: /^((1?\d)|(2[0-3]))$/,
	minute: /^[1-5]?\d$/,
	time: /^(\d|([0-1]\d|2[0-3])):([0-5]\d):([0-5]\d)$/,
	date: /^((((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13578]|1[02])\5(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13456789]|1[012])\11(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)0?2\17(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\/)0?2\25(29)))$/, // eslint-disable-line max-len
	datetime: /^((((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13578]|1[02])\5(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13456789]|1[012])\11(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)0?2\17(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\/)0?2\25(29)))\s+(\d|([0-1]\d|2[0-3])):(\d|([0-5]?\d)):(\d|([0-5]?\d))$/, // eslint-disable-line max-len
	file: /^([^<>/\\\|:''\*\?]+)\.\w+$/,
	image: /^([^<>/\\\|:''\*\?]+)\.(jpg|jpeg|gif|png|bmp|svg)$/i,
	word: /^([^<>/\\\|:''\*\?]+)\.(txt|doc|docx|rtf|pdf|wps)$/i,
	lon: /^(\-|\+)?(0?\d{1,2}\.\d{1,15}|1[0-7]?\d{1}\.\d{1,15}|180\.0{1,15})$/,
	lat: /^(\-|\+)?([0-8]?\d{1}\.\d{1,15}|90\.0{1,15})$/,
	approval: /^([\u2E80-\uFE4F]+)\u5b57(\u3014|\[)(19|20)\d{2}(\u3015|\])\u7b2c?\d{1,}\u53f7$/,
	citycode: /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12]))\d{4}$/,
	address: /^[\u2E80-\uFE4F]+(\u5e02|\u53BF|\u533A|\u65D7|\u4E61|\u9547|\u8857\u9053|\u5DDE)\S{3,}$/,
	isbn: /^(978\-\d\-\d{3}\-\d{5}\-[a-z0-9]$)|(978\d{9}[a-z0-9])$/i,
	upper: /[A-Z]/,
	lower: /[a-z]/,
	even: (arg: string | number) => ((+arg) & 1) === 0,
	odd: (arg: string | number) => ((+arg) & 1) !== 0,
	ipv6: (arg: string) => {
		const m = arg.match(/:/g),
			t1 = m ? m.length < 8 : false,
			t2 = /:/.test(arg),
			t3 = /::/.test(arg),
			t4 = m ? m.length === 1 : false,
			t5 = /^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i.test(arg),
			t6 = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(arg);

		return t1 && t2 && (t3 ? (t4 && t5) : t6);
	},
	bodycard: (arg: string | number) => {
		const val = arg + '',
			args = val.toUpperCase().split(''),
			factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
			parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2],
			reg = /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((19|20)\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((19|20)\d{2}(0[13578]|1[02])31)|((19|20)\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/;
		let sum = 0,
			ai = 0,
			wi = 0;

		for (let i = 0; i < 17; i++) {
			ai = parseInt(args[i], 10);
			wi = factor[i];
			sum += ai * wi;
		}
		return reg.test(val) && parity[sum % 11] == args[17];
	},
	autocard: (arg: string) => {
		const sn = '\\u4EAC\\u6D25\\u6CAA\\u6E1D\\u5180\\u8C6B\\u4E91\\u8FBD\\u9ED1\\u6E58\\u7696\\u9C81\\u65B0\\u82CF\\u6D59\\u8D63\\u9102\\u6842\\u7518\\u664B\\u8499\\u9655\\u5409\\u95FD\\u8D35\\u7CA4\\u9752\\u85CF\\u5DDD\\u5B81\\u743C',
			reg1 = new RegExp('(^[' + sn + '\\u4F7F\\u9886;][A-HJ-NP-Z]([A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9\\u6302\\u5B66\\u8B66]|[DF][A-HJ-NP-Z0-9]{5}|[A-HJ-NP-Z0-9]{5}[DF])$)|(\\u7CA4Z[A-HJ-NP-Z0-9]{4}[\\u6E2F\\u6FB3])'),
			reg2 = new RegExp('(^WJ[' + sn + '](\\d{5}|[BDGHJSTX]\\d{4}|\\d{4}[BDGHJSTX])$)|(^[A-Z]{2}\\d{5}$)/'),
			matc = arg.match(/[A-Z]/g);

		return reg1.test(arg) && matc && matc.length < 4 || reg2.test(arg);
	},
	not: <T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) != (+arg2),
	eq: <T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) == (+arg2),
	gt: <T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) > (+arg2),
	gte: <T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) >= (+arg2),
	lt: <T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) < (+arg2),
	lte: <T extends string | number | Date>(arg1: T, arg2: T) => (+arg1) <= (+arg2),
	between: <T extends string | number | Date>(arg1: T, arg2: T, arg3: T) => (+arg1) > (+arg2) && (+arg1) < (+arg3),
	min: <T extends string | number | Date>(arg1: T, ...args: T[]) => (+arg1) === Math.min(...args.map(item => (+item))),
	max: <T extends string | number | Date>(arg1: T, ...args: T[]) => (+arg1) === Math.max(...args.map(item => (+item))),
	length: <T extends string | number>(arg1: T, arg2: T) => (arg1 + '').length == (+arg2),
	minlength: <T extends string | number>(arg1: T, arg2: T) => (arg1 + '').length < (+arg2),
	maxlength: <T extends string | number>(arg1: T, arg2: T) => (arg1 + '').length > (+arg2),
	in: (arg1: any, arg2: any):boolean => {
		if ((typeof arg1 === 'number'|| typeof arg1 === 'string') && (typeof arg2 === 'number'|| typeof arg2 === 'string')) {
			return (arg2 + '').indexOf(arg1 + '') > -1;
		} else if (Array.isArray(arg2)) return arg2.indexOf(arg1) > -1;
		else if (rules.object(arg2) && typeof arg1 === 'string') return arg2.hasOwnProperty(arg1);
		else if (rules.object(arg2) && typeof rules.object(arg1)) {
			let hasProp = [];

			for (const key in arg2) {
				if (arg2.hasOwnProperty(key)) hasProp.push(arg1.hasOwnProperty(key));
			}
			return hasProp.indexOf(false) === -1;
		}
		return false;
	},
	regexp: (arg: any, arg2: RegExp | string) => new RegExp(arg2).test(arg),
	custom: (arg: any, arg2: (arg3: any) => boolean) => arg2(arg)
}
