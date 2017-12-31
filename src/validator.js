/** @module 数据验证 */
import { types } from './type';

const RULE_CACHE = Symbol();
var rule, ruleMap = {};

/**
 * @prop  {regexp} rquire      任意字符，必填项
 * @prop  {regexp} english     英文字母
 * @prop  {regexp} qq          QQ号 5-11位
 * @prop  {regexp} age         年龄 0-129岁
 * @prop  {regexp} time        时间 12:12:12
 * @prop  {regexp} year        年份 1900-2099
 * @prop  {regexp} month       月份
 * @prop  {regexp} day         日
 * @prop  {regexp} hour        小时 0-23
 * @prop  {regexp} minute      分钟 0-59
 * @prop  {regexp} second      秒钟 0-59
 * @prop  {regexp} zipcode     邮编
 * @prop  {regexp} ip          IP地址
 * @prop  {regexp} port        端口
 * @prop  {regexp} currency    货币，双精度，带分号
 * @prop  {regexp} float       浮点数
 * @prop  {regexp} int         整数
 * @prop  {regexp} decimal     小数点1位及以上
 * @prop  {regexp} chinese     中文
 * @prop  {regexp} mail        邮箱地址
 * @prop  {regexp} url         网址
 * @prop  {regexp} account     账号名，abcd_dafsd_da
 * @prop  {regexp} password    密码，
 * @prop  {regexp} safe        安全敏感字符
 * @prop  {regexp} dbc         全角
 * @prop  {regexp} hex         HEX码
 * @prop  {regexp} color       颜色码，16进制
 * @prop  {regexp} ascii       ASCII码
 * @prop  {regexp} base64      BASE64码
 * @prop  {regexp} guid        GUID码
 * @prop  {regexp} mobile      手机 +8613700000000
 * @prop  {regexp} telphone    电话手机混合
 * @prop  {regexp} phone       固话，可带分机
 * @prop  {regexp} percent     百分数，可两位小数点
 * @prop  {regexp} date        日期 2017-7-17，含大小月、闰月检测
 * @prop  {regexp} datetime    日期 + 时间
 * @prop  {regexp} file        文件
 * @prop  {regexp} image       图像文件
 * @prop  {regexp} word        文档文件
 * @prop  {regexp} lon         地理位置——经度，最少一位小数
 * @prop  {regexp} lat         地理位置——纬度，最少一位小数
 * @prop  {regexp} approval    审批文号 某字〔2004〕18号 或 某字[2004]18号
 * @prop  {regexp} bizcode     统一信用代码
 * @prop  {regexp} invoice     增值税发票代码
 * @prop  {regexp} bankcard    银联卡卡号
 * @prop  {regexp} citycode    地区代码
 */
const base = {
  'rquire': /.+/,
  'english': /^[A-Za-z]+$/,
  'qq': /^[1-9]\d{4,10}$/,
  'age': /^(0|[1-9]\d?|1[0-2]\d)$/,
  'zipcode': /^(\d[1-7]|[1-9][0-7])\d{4}$/,
  'ip': /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/, // eslint-disable-line max-len
  'port': /^([0-9]|[1-9]\d{1,3}|[1-5]\d{4}|6[0-5]{2}[0-3][0-5])$/,
  'bizcode': /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/,
  'invoice': /^(((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12]))\d{5}[1-9][1-7][0-4])$/,
  'bankcard': /^(10|30|35|37|4\d||5[0-6]|58|60|62|6[8-9]|84|8[7-8]|9[0-2]|9[4-6]|9[8-9])\d{14,17}$/,
  'currency': /(^[-]?[1-9]\d{0,2}($|(\,\d{3})*($|(\.\d{1,2}$))))|((^[0](\.\d{1,2})?)|(^[-][0]\.\d{1,2}))$/,
  'float': /^(\-|\+)?\d+(\.\d+)?$/,
  'int': /^-?\d+$/,
  'decimal': /^-?\d+\.\d{1,}$/,
  'chinese': /^[\u2E80-\uFE4F]+$/,
  'mail': /\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*/,
  'url': /(http|ftp|https|ws|wss):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&:/~\+#]*[\w\-\@?^=%&/~\+#])?/,
  'account': /^[A-Za-z0-9]+(_[A-Za-z0-9]+)*[A-Za-z0-9]+$/,
  'password': /^(?![a-zA-Z]+$)(?![A-Z0-9]+$)(?![A-Z\W_]+$)(?![a-z0-9]+$)(?![a-z\W_]+$)(?![0-9\W_]+$)[a-zA-Z0-9\W_]{8,}$/, // eslint-disable-line max-len
  'safe': />|<|,|\[|\]|\{|\}|\?|\/|\+|=|\||\'|\\|\'|:|;|\~|\!|\@|\#|\*|\$|\%|\^|\&|\(|\)|`/i,
  'dbc': /[ａ-ｚＡ-Ｚ０-９！＠＃￥％＾＆＊（）＿＋｛｝［］｜：＂＇；．，／？＜＞｀～　]/, // eslint-disable-line no-irregular-whitespace
  'hex': /^[0-9A-F]+$/i,
  'color': /^#?[a-fA-F0-9]{6}$/i,
  'ascii': /^[\u0000-\u007F]+$/,
  'base64': /^(?:[A-Z0-9+\/]{4})*(?:[A-Z0-9+\/]{2}==|[A-Z0-9+\/]{3}=|[A-Z0-9+\/]{4})$/i,
  'md5': /^(([0-9A-F]{16})|([0-9A-F]{32}))$/i,
  'uuid': /^[0-9A-F]{8}(-[0-9A-F]{4}){3}-[0-9A-F]{12}$/i,
  'mobile': /^((\+86)|(86))?(13\d|(14[5-7])|(15([0-3]|[5-9]))|166|17(0|1|8])|18\d|19(8|9))\d{8}$/,
  'telphone': /^[+]{0,1}\d{1,3}[ ]?([-]?(\d|[ ]){1,12})+$/,
  'phone': /^((\+86)|(86))?((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/, // eslint-disable-line max-len
  'percent': /^-?\d+(\.\d{2})?%$/,
  'year': /^(19|20)\d{2}$/,
  'month': /^(0?[1-9]|1[0-2])$/,
  'day': /^(([1-9])|([1-2]\d)|(3[0-1]))$/,
  'hour': /^((1?\d)|(2[0-3]))$/,
  'minute': /^[1-5]?\d$/,
  'time': /^(\d|([0-1]\d|2[0-3])):([0-5]\d):([0-5]\d)$/,
  'date': /^((((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13578]|1[02])\5(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13456789]|1[012])\11(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)0?2\17(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\/)0?2\25(29)))$/, // eslint-disable-line max-len
  'datetime': /^((((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13578]|1[02])\5(0?[1-9]|[12]\d|3[01]))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)(0?[13456789]|1[012])\11(0?[1-9]|[12]\d|30))|(((1[6-9]|[2-9]\d)\d{2})(-|\/)0?2\17(0?[1-9]|1\d|2[0-8]))|(((1[6-9]|[2-9]\d)(0[48]|[2468][048]|[13579][26])|((16|[2468][048]|[3579][26])00))(-|\/)0?2\25(29)))\s+(\d|([0-1]\d|2[0-3])):(\d|([0-5]?\d)):(\d|([0-5]?\d))$/, // eslint-disable-line max-len
  'file': /^[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z0-9]+$/,
  'image': /^.+\.(jpg|jpeg|gif|png|bmp|svg)$/i,
  'word': /^.+\.(txt|doc|docx|rtf|pdf|wps)$/i,
  'lon': /^(\-|\+)?(0?\d{1,2}\.\d{1,}|1[0-7]?\d{1}\.\d{1,}|180\.0{1,})$/,
  'lat': /^(\-|\+)?([0-8]?\d{1}\.\d{1,}|90\.0{1,})$/,
  'approval': /^([\u2E80-\uFE4F]+)\u5b57(\u3014|\[])(19|20)\d{2}(\u3015|\])\u7b2c?\d{1,}\u53f7$/,
  'citycode': /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12]))\d{4}$/,
  'address': /^[\u2E80-\uFE4F]+(\u5e02|\u53BF|\u533A|\u65D7|\u4E61|\u9547|\u8857\u9053|\u5DDE)\S{3,}$/,
  'upper': /[A-Z]/,
  'lower': /[a-z]/
};

ruleMap.base = Object.keys(base);

/**
 * @prop  {function} even      奇数
 * @prop  {function} even      偶数
 * @prop  {function} ipv6      IPV6
 * @prop  {function} bodycard  身份证
 * @prop  {function} autocard  车牌号
 */
const fncOne = {
  'even': arg => ((+arg) & 1) === 0,
  'odd': arg => ((+arg) & 1) !== 0,

  ipv6(arg) {
    const m = arg.match(/:/g),
      t1 = m ? m.length < 8 : false,
      t2 = /:/.test(arg),
      t3 = /::/.test(arg),
      t4 = m.length === 1,
      t5 = /^::$|^(::)?([\da-f]{1,4}(:|::))*[\da-f]{1,4}(:|::)?$/i.test(arg),
      t6 = /^([\da-f]{1,4}:){7}[\da-f]{1,4}$/i.test(arg);

    // console.log(t1, t2, t3, t4, t5, t6);
    return t1 && t2 && (t3 ? (t4 && t5) : t6);
  },
  bodycard(arg) {
    const args = arg.toUpperCase().split(''),
      factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ],
      parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ],
      reg = /^((1[1-5])|(2[1-3])|(3[1-7])|(4[1-6])|(5[0-4])|(6[1-5])|71|(8[12])|91)\d{4}(((19|20)\d{2}(0[13-9]|1[012])(0[1-9]|[12]\d|30))|((19|20)\d{2}(0[13578]|1[02])31)|((19|20)\d{2}02(0[1-9]|1\d|2[0-8]))|(19([13579][26]|[2468][048]|0[48])0229))\d{3}(\d|X|x)?$/; // eslint-disable-line max-len
    let sum = 0, ai = 0, wi = 0;

    for (let i = 0; i < 17; i++) {
      ai = args[i];
      wi = factor[i];
      sum += ai * wi;
    }
    return reg.test(arg) && parity[sum % 11] == args[17]; // eslint-disable-line eqeqeq
  },
  autocard(arg) {
    const sn = '京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼',
      reg1 = new RegExp('(^[' + sn + '使领][A-HJ-NP-Z]([A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警]|[DF][A-HJ-NP-Z0-9]{5}|[A-HJ-NP-Z0-9]{5}[DF])$)|(粤Z[A-HJ-NP-Z0-9]{4}[港澳])'), // eslint-disable-line max-len
      reg2 = new RegExp('(^WJ[' + sn + '](\\d{5}|[BDGHJSTX]\\d{4}|\\d{4}[BDGHJSTX])$)|(^[A-Z]{2}\\d{5}$)/');

    return reg1.test(arg) && arg.match(/[A-Z]/g).length < 4 || reg2.test(arg);
  }
};

ruleMap.fncOne = Object.keys(fncOne);

function convert(content) { // 支持文本类型的数字及日期比较
  let value = content;

  if (typeof content === 'string') {
    if (base['float'].test(content)) value = +content;
    else if (base['date'].test(content) || base['datetime'].test(content)) {
      value = content.indexOf('-') > -1 ? new Date(content.replace(/-/g, '/')) : new Date(content);
    }
  }
  return value;
}

function checkLen(type, arg1, arg2) {
  let p, s = false;
  const l = parseInt(arg2, 10);

  if (types.isObject(arg2)) p = Object.keys(arg2).length;
  else if (types.isArray(arg2)) p = arg2.length;
  else p = (arg1 + '').length;

  switch (type) {
    case 0:
      s = p === l;
      break;
    case 1:
      s = p >= l;
      break;
    case 2:
      s = p <= l;
      break;
  }
  return s;
}

/**
 * @prop  {function} not       不等于
 * @prop  {function} eq        等于
 * @prop  {function} gt        大于
 * @prop  {function} gte       大于或等于
 * @prop  {function} lt        小于
 * @prop  {function} lte       小于或等于
 * @prop  {function} min       最小
 * @prop  {function} max       最大
 * @prop  {function} minlen    最小长度
 * @prop  {function} maxlen    最大长度
 * @prop  {function} len       等于长度
 * @prop  {function} in        包含
 */
const fncMany = {
  'not': (arg1, arg2) => convert(arg1) !== convert(arg2),
  'eq': (arg1, arg2) => convert(arg1) === convert(arg2),
  'gt': (arg1, arg2) => convert(arg1) > convert(arg2),
  'gte': (arg1, arg2) => convert(arg1) >= convert(arg2),
  'lt': (arg1, arg2) => convert(arg1) < convert(arg2),
  'lte': (arg1, arg2) => convert(arg1) <= convert(arg2),
  'bet': (arg1, arg2, arg3) => arg1 > arg2 && arg1 < arg3,
  'min': (arg1, ...args) => convert(arg1) === Math.min.apply(null, args),
  'max': (arg1, ...args) => convert(arg1) === Math.max.apply(null, args),
  'len': (arg1, arg2) => checkLen(0, arg1, arg2),
  'minl': (arg1, arg2) => checkLen(1, arg1, arg2),
  'maxl': (arg1, arg2) => checkLen(2, arg1, arg2),
  'in': (arg, arg2) => {
    let p = false;

    if (types.isObject(arg2)) p = Object.keys(arg2).indexOf(arg) > -1;
    else if (types.isArray(arg2)) p = arg2.indexOf(arg) > -1;
    else p = new RegExp(arg).test(arg2);
    return p;
  }
};

ruleMap.fncMany = Object.keys(fncMany);
rule = Object.assign(base, Object.assign(fncOne, fncMany));

export default class Validator {
  constructor() {
    this.addRule = this.addRule.bind(this);
    this.check = this.check.bind(this);
    this.checkItem = this.checkItem.bind(this);
    this.checkItems = this.checkItems.bind(this);
  }

  /**
   * 扩展自定义验证方法
   * @param {object} option 对象
   * @example
   * addRule({ mystr: /^abc$/, myfnc: arg => { return arg!=0 }})
   */
  addRule(option) {
    Object.keys(option).forEach(key => {
      const newRule = option[key];

      if (types.isRegexp(newRule)) {
        if (ruleMap.base.indexOf(key) === -1) ruleMap.base.push(key);
      } else if (types.isFunction(newRule)) {
        if (newRule.length === 1 && ruleMap.fncOne.indexOf(key) === -1) ruleMap.fncOne.push(key);
        else if (ruleMap.fncMany.indexOf(key) === -1) ruleMap.fncMany.push(key);
      } else throw new TypeError('扩展规则类型非函数或正则！');
    });
    Object.assign(rule, option);
  }

  /**
   * 缓存链式类型检测项设值内容
   */
  get t() {
    let chain = Object.create(null), caches = [];
    const oneKeys = ruleMap.base.concat(ruleMap.fncOne);

    // 单形参
    oneKeys.forEach(k =>{
      Object.defineProperty(chain, k, {
        get: () => {
          caches.push(k);
          chain[RULE_CACHE] = caches;
          return chain;
        }
      });
    });

    // 多形参
    ruleMap.fncMany.forEach(k =>{
      Object.defineProperty(chain, k, {
        value: (...args) => {
          let obj = {};

          obj[k] = args;
          caches.push(obj);
          chain[RULE_CACHE] = caches;
          return chain;
        }
      });
    });

    return chain;
  }

  /**
   * 单项单规则验证
   * @param {*} value 检测的值，必含
   * @param {string} [ruleStr] 规则属性，默认为判断是否为空，可选
   * @param {...*} args 对比值、参考值等自定义验证方法扩展参数，可选
   * @returns {boolean} 是否验证通过
   * @example
   * check('password1','==','password2')
   */
  check(value, rn = 'rquire', ...args) {
    let passed = false;
    const val = typeof value === 'string' ? value.trim() : value,
      c = {'==': 'eq', '!=': 'not', '>': 'gt', '>=': 'gte', '<': 'lt', '<=': 'lte'},
      ruleName = c.hasOwnProperty(rn) ? c[rn] : rn;

    if (rule.hasOwnProperty(ruleName)) {
      if (args.length > 0) passed = rule[ruleName].apply(this, [val].concat(args));
      else if (types.isFunction(rule[ruleName])) passed = rule[ruleName](val);
      else if (types.isRegexp(rule[ruleName])) passed = rule[ruleName].test(val);
    } else throw new TypeError('没有找到相关验证规则！');

    return passed;
  }

  /**
   * 单项组合规则验证，对象方式
   * @param {object} options 属性对象。
   * @prop {*} value 必备选项，验证目标数据
   * @prop {t} rule 使用链式表达式检查，可选
   * @prop {function} callback 默认验证结果处置方法，可选，参数faults为没通过的项的集合
   * @returns {boolean} 是否验证通过
   * @example
   * checkItem({value:'password1', password:true, eq:'password2'})
   */
  checkItem(options) {
    let passed = false, opts = options, cb, val = opts.value;
    const hasVal = (!val || (val + '').trim() === '');

    delete opts.value;
    if (opts.hasOwnProperty('callback')) { // 取回调
      cb = opts.callback;
      delete opts.callback;
    }
    if (opts.hasOwnProperty('rule')) { // 转换链式规则为动态属性
      const caches = opts.rule[RULE_CACHE];

      if (caches !== void 0) {
        caches.forEach(t => {
          if (types.isObject(t)) Object.assign(opts, t);
          else opts[t] = true;
        });
      }
      delete opts.rule;
    }

    if (opts.hasOwnProperty('rquire') && !opts['rquire'] && hasVal) passed = true;
    else {
      let checkeds = [], faults = [], rs;

      Object.keys(opts).forEach(k => { // 取出动态属性规则
        const prop = opts[k];

        if (types.isArray(prop)) rs = this.check.apply(this, [val, k].concat(prop));
        else if (typeof prop === 'boolean') rs = this.check(val, k) && prop;
        else rs = this.check(val, k, prop);
        checkeds.push(rs);
        if (rs === false) faults.push(k);
      });
      if (types.isFunction(cb)) cb(faults); // 执行回调
      if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
    }
    return passed;
  }

  /**
   * 多项组合规则验证
   * @param {array} items 组对象
   * @returns {boolean} 是否验证通过
   */
  checkItems(items) {
    let passed = false, checkeds = [];

    if (types.isArray(items) && items.length > 0) {
      items.forEach(item => {
        if (types.isObject(item)) checkeds.push(this.checkItem(item));
        else throw new TypeError('验证组内容不是对象!');
      });
      if (checkeds.length > 0) passed = checkeds.indexOf(false) === -1;
    }
    return passed;
  }

};
