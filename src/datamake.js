/** @module 数据生成 */
import RandExp from 'randexp';
import Region from './region';
import { config } from './config';
import { data } from './resource';
import { util } from './util';
import { types } from './type';
import md5 from 'md5';

var region, rd;

function getPosition(num1, num2) {
  const n = num1, l = (/\d+/.test(num2) && num2 > 0) ? num2 : 15;

  return util.getNumber(n, +(n + '9'), l);
}

/**
 * @prop  {function} exp        自定义正则，不带参数为随机任意字符
 * @prop  {function} range      自定义随机范围
 * @prop  {function} int        整数
 * @prop  {function} number     任意数字
 * @prop  {funciton} increment  自增整数
 * @prop  {function} bool       布尔
 * @prop  {function} datetime   日期时间，可选参数为指定格式，如 yyyy-MM-dd EEE hh:mm:ss
 * @prop  {function} chinese    中文随机文字
 * @prop  {regexp} uuid         uUID
 * @prop  {regexp} mid          产品型号
 * @prop  {regexp} color        颜色
 * @prop  {regexp} url          网址
 * @prop  {regexp} mail         邮箱
 * @prop  {regexp} mobile       手机
 * @prop  {regexp} telphone     固话
 * @prop  {function} datetime   时间
 * @prop  {regexp} enName       英文姓名
 * @prop  {regexp} enMaleName   英文姓名 男
 * @prop  {regexp} enFemaleName 英文姓名 女
 * @prop  {regexp} cnName       中文姓名
 * @prop  {regexp} cnMaleName   中文姓名 男
 * @prop  {regexp} cnFemaleName 中文姓名 女
 * @prop  {regexp} enState      英文国家名
 * @prop  {regexp} cnState      中文国家名
 * @prop  {function} company    公司名称
 * @prop  {function} autocard   车牌号
 * @prop  {function} citycode   行政代码
 * @prop  {function} province   省
 * @prop  {function} prefecture 市
 * @prop  {function} county     县区
 * @prop  {function} lon        经度
 * @prop  {function} lat        纬度
 * @prop  {function} sex        性别
 * @prop  {function} nation     民族
 * @prop  {function} affiliate  政治面貌
 * @prop  {function} edu        学历
 * @prop  {function} mary       婚姻状况
 * @prop  {function} health     健康状况
 * @prop  {function} bodycard   身份证
 * @description 可扩展，function设置返回值即可
 */
const methods = {
  'exp': (arg = /.+/) => new RandExp(typeof arg === 'string' ? new RegExp(arg) : arg).gen(),
  'range': (...args) => util.getItem(args),
  'int': (arg1 = 0, arg2 = 100) => util.getInt(arg1, arg2),
  'number': (arg1 = 0, arg2 = 10000, arg3 = 2) => util.getNumber(arg1, arg2, arg3),
  'bool': () => util.getItem([true, false]),
  'datetime': arg => util.formatDate(rd(), (arg ? arg : 'yyyy-MM-dd hh:mm:ss')),
  'date': () => util.formatDate(rd(), 'yyyy-MM-dd'),
  'time': () => util.formatDate(rd(), 'hh:mm:ss'),
  'year': () => +util.formatDate(rd(), 'yyyy'),
  'month': () => util.getInt(1, 12),
  'day': () => util.getInt(1, 31),
  'hour': () => util.getInt(0, 23),
  'minute': () => util.getInt(1, 59),
  'now': arg => util.formatDate(new Date(), (arg ? arg : 'yyyy-MM-dd hh:mm:ss')),
  'mid': /[0-9A-Z]{1,8}(\-[0-9A-Z]{2,6}){0,2}/,
  'validcode': (arg = 4) => new RandExp(new RegExp('[A-Z0-9]{' + arg + '}')).gen(),
  'account': /[a-zA-Z]{1,3}[a-zA-Z0-9]{3,6}/,
  'password': /[a-zA-Z0-9][a-zA-Z0-9\W_]{7}/,
  'color': /#[A-F0-9]{6}/,
  'url': /http:\/\/www\.[a-z]{3,8}\.(com|cn|net|org)(\/[a-z]{3,5})?/,
  'mail': /([a-z0-9]{3,6}[-_]?[a-z0-9]{3,6})@[a-z]{3,8}\.(com|cn|net|org)/,
  'mobile': /(13\d|(14[5-7])|(15([0-3]|[5-9]))|17(0|1|8])|18\d)\d{8}/,
  'telphone': /[0-8]\d{3}-(2|6|8)\d{6,7}/,
  'ip': /((192\.168)|(172\.0)|(10\.0))\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/,
  'port': /[1-9]\d{3}/,
  'zipcode': /(\d[1-7]|[1-9][0-7])\d{4}/,
  'bizcode': /91[1-4]\d{5}[0-9A-HJ-NPQRTUWXY]{10}/,
  'bankcard': /62(([0-3]\d)(4[0-5])|5([0-3]|5|8|9)|70|8[2-3])\d{12,15}/,
  'qq': /[1-9]\d{4,10}/,
  'enName': () => util.getItem(data.eMaleName.concat(data.eFemaleName)) + ' ' + util.getItem(data.eSurname),
  'enMaleName': () => util.getItem(data.eMaleName) + ' ' + util.getItem(data.eSurname),
  'enFemaleName': () => util.getItem(data.eFemaleName) + ' ' + util.getItem(data.eSurname),
  'cnName': () => util.getItem(data.cSurname) + util.getItem(data.cMaleName.concat(data.cFemaleName)),
  'cnMaleName': () => util.getItem(data.cSurname) + util.getItem(data.cMaleName),
  'cnFemaleName': () => util.getItem(data.cSurname) + util.getItem(data.cFemaleName),
  'enState': () => util.getItem(data.eStates),
  'cnState': () => util.getItem(data.cStates),
  'comDep': () => util.getItem(data.comDepartment),
  'comPos': () => util.getItem(data.comPos),
  'govDep': () => util.getItem(data.govDepartment) + util.getItem(['科', '处']),
  'govPos': () => util.getItem(data.govPos),
  'sex': () => util.getItem(data.sex),
  'nation': () => util.getItem(data.nation),
  'affiliate': () => util.getItem(data.affiliate),
  'edu': () => util.getItem(data.edu),
  'mary': () => util.getItem(data.mary),
  'health': () => util.getItem(data.health),

  increment(arg1 = 1, arg2) {
    config.baseIncrement += arg1;
    return arg2 ? (Array(arg2).join(0) + config.baseIncrement).slice(-arg2) : config.baseIncrement;
  },
  price(arg1 = 0, arg2 = 10000, arg3) {
    let d = util.getNumber(arg1, arg2, 2);
    const r1 = /\d{1,3}(?=(\d{3})+$)/g,
      r2 = /^(-?)(\d+)((\.\d+)?)$/;

    if (arg3) d = d.toString().replace(r2, ((s, s1, s2, s3) => s1 + s2.replace(r1, '$&,') + s3));
    return d;
  },

  citycode() {
    return region.cityCode;
  },
  province() {
    return region.province;
  },
  prefecture() {
    if (region.level === 1) region.extract();
    return region.prefecture;
  },
  county() {
    if (region.level < 3) region.extract();
    return region.county;
  },
  lon(arg) {
    return getPosition(region.point.lon, arg);
  },
  lat(arg) {
    return getPosition(region.point.lat, arg);
  },
  company() {
    return region.prefecture + util.getItems(data.commonWord, 2) + util.getItem(data.companyNature) + '有限公司';
  },
  autocard() {
    return region.shorter + new RandExp(/[A-C](\d{3}[A-HJ-NP-UW-Z]{2}|[A-HJ-NP-UW-Z]\d{4})/).gen();
  },
  address() {
    return region.county.replace('县', '县城') + util.getItem(data.road) + new RandExp(/路|街\d{3}号/).gen() +
      util.getItems(data.commonWord, 2) + util.getItem(data.buildNature) +
      new RandExp(/[A-F]栋[一二三四五]单元[1-7]0[1-5]室/).gen();
  },

  english(arg, num = 1) {
    const d = arg ? arg : 'abcdefghijklmnopqrstuvwxyz';

    return util.getItems(d.split(''), num);
  },
  chinese(arg, num = 1) {
    const d = arg ? arg.split('') : String.fromCharCode(util.getInt(19968, 40869));

    return util.getItems(d, num);
  },
  text(arg = '填充文本样式', n1, n2) {
    let d = 40;

    if (types.isNumber(n1) && types.isNumber(n2)) d = util.getInt(n1, n2);
    else if (types.isNumber(n1)) d = n1;
    return Array(d + 1).join(arg);
  },
  md5(arg = new Date().getTime(), is16 = false) {
    return is16 ? md5(arg).substr(8, 16) : md5(arg);
  },
  uuid(arg) {
    let d = new Date().getTime();
    const s = !arg ? '-' : '',
      str = 'xxxxxxxx' + s + 'xxxx' + s + '4xxx' + s + 'yxxx' + s + 'xxxxxxxxxxxx',
      uuid = str.replace(/[xy]/g, function (c) {
        const r = (d + Math.random() * 16) % 16 | 0;

        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
      });

    return uuid;
  },

  bodycard() {
    const sn = region.cityCode + util.formatDate(rd(), 'yyyyMMdd') + new RandExp(/\d{3}/).gen(),
      arr = sn.split(''),
      factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
      parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0, ai = 0, wi = 0;

    for (let i = 0; i < 17; i++) {
      ai = arr[i];
      wi = factor[i];
      sum += ai * wi;
    }
    return sn + parity[sum % 11];
  }

};

export default class DataMake {
  constructor() {
    this.addSchema = this.addSchema.bind(this);
    this.schema = this.schema.bind(this);
    this.makeData = this.makeData.bind(this);

    rd = () => util.randDate(config.beginTime.getTime(), config.endTime.getTime());
    region = new Region();
    region.extract();
  }

  /**
   * 扩展自定义生成数据方法
   * @param {object} option 对象
   * @example
   * addMethod({ mystr: /^abc$/, myfnc: arg => { return arg!=0 }})
   */
  addSchema(option) {
    Object.assign(methods, option);
  }

  /**
   * 生成模拟数据
   * @param {string} [ruleStr] 方法属性名
   * @returns {string} 返回模拟数据
   * @example
   * fake('address');
   */
  schema(methodName, ...args) {
    let result = '';

    if (methods.hasOwnProperty(methodName)) {
      if (types.isFunction(methods[methodName])) result = methods[methodName].apply(this, args);
      else if (types.isRegexp(methods[methodName])) result = new RandExp(methods[methodName]).gen();
      else throw new TypeError('扩展方法非函数或正则！');
    } else throw new TypeError('没有找到生成数据的方法！');
    return result;
  }

  /**
   * JSON数据模板解析
   * @param {string} content json字符串，通过##嵌套数据类型，多参数可使用逗号隔开如#int,10,20#
   * @param {number} n1 生成对象数目，生成数组字符串，可选
   * @param {number} n2 为随机数目上限，结合参数2使用，无此参数则不随机数目，可选
   * @returns {string} 替换数据后的json字符串
   */
  makeData(content, n1, n2) {
    let jsonstr, num, parseTPL = keyword => {
      return keyword.replace(/#([^#\n\r]+)#/g, ($0, $1) => {
        let args = $1.trim().split(',');

        if (args.length > 1) {
          args.forEach((arg, i) => {
            if (/^(\-|\+)?\d+(\.\d+)?$/.test(arg)) args[i] = parseFloat(arg);
            else if (typeof args[i] === 'boolean') args[i] = Boolean(args[i]);
          });
        }
        return this.schema.apply(this, args);
      });
    };

    if (types.isNumber(n1) && types.isNumber(n2)) num = util.getInt(n1, n2);
    else num = n1;
    if (types.isNumber(num)) {
      let list = [], i;

      for (i = 0; i < num; i++) list.push(parseTPL(content));
      jsonstr = '[' + list.join(',') + ']';
    } else jsonstr = parseTPL(content);
    return jsonstr;
  }

};
