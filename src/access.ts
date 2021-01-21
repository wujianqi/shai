import { uuid } from './util';

interface PlainObject {
  [key: string]: any;
  [key: number]: any;
}

export enum UniqueType {
  'increment',
  'uuid'
}

enum FilterType {
  'some',
  'every',
  'unique'
}

/**
 * @property uniqueKey 索引字段名
 * @property uniqueType 索引类型
 * @property api RESTAPI模板属性设定
 * @property page 分页属性设定 * 
 */
export interface AccessConfig {
  uniqueKey?: string;
  uniqueType?: UniqueType;
  api?: {
    statusField: string;
    messageField: string;
    resultsField: string;
    successCode: number;
    failureCode: number;
  },
  page?: {
    sizeField: string;
    currentField: string;
    countField: string;
    totalField: string;
    resultsField: string;    
  }
}

export function haskey(obj: PlainObject, k: string){
  return Object.prototype.hasOwnProperty.call(obj, k)
}

// ES5兼容处理
function extObj(target: any, source: PlainObject): any { 
  if(Object['assign']) return Object.assign(target, source);
  for (const key in source) { 
    if (haskey(source, key)) target[key] = source[key];
  }
  return target; 
}


const msgs = ['操作失败！', '查询参数错误！', '没有请求参数', '操作成功！'];

export default class {
  private __datas: PlainObject = [];
  private __opt: Required<AccessConfig> = {
    uniqueKey: 'id',
    uniqueType: UniqueType.increment,
    page: {
      sizeField: 'pageSize',
      currentField: 'pageIndex',
      countField: 'pageCount',
      totalField: 'total',
      resultsField: 'list'
    },
    api: {
      statusField: 'code',
      messageField: 'message',
      resultsField: 'data',
      successCode: 0,
      failureCode: 500
    }
  }
  private success(vo: any, msg?: string) {
    return {
      [this.__opt.api.statusField]: [this.__opt.api.successCode],
      [this.__opt.api.messageField]: typeof msg !== 'string' ? msgs[3]: msg,
      [this.__opt.api.resultsField]: vo
    };
  }
  private failure(err: number, msg?: string) {
    return { 
      [this.__opt.api.statusField]: [this.__opt.api.failureCode],
      [this.__opt.api.messageField]: typeof msg !== 'string' ? msgs[0] : msg,
    };
  }
  

  // 数据过滤
  private __filter(params: PlainObject, cb: (val: PlainObject) => PlainObject, type: FilterType) {
    if(type=== FilterType.unique && params && !params[this.__opt.uniqueKey]) 
      return this.failure(1, msgs[1]);
    else {
      const key = params[this.__opt.uniqueKey];
      let item = [];

      if(key) { // 索引值格式化
        const isnum = this.__opt.uniqueType === UniqueType.increment;

        if(typeof key === 'string' &&  isnum && /\d+/.test(key)) 
          params[this.__opt.uniqueKey] = parseInt(key);
      }
      if(type === FilterType.unique && key) {  // 按不重复索引值查询
        item = this.__datas.filter((t: PlainObject) =>
          t[this.__opt.uniqueKey] === params[this.__opt.uniqueKey])

      } else if (type === FilterType.some || type === FilterType.every) { // 按匹配1项或多项查询
        item = this.__datas.filter((item: PlainObject) => 
          Object.keys(params)[type === FilterType.some? 'some':'every'](f => item[f] === params[f]));
      }
      return cb(item);
    }
  }

  // 必要参数检测
  private __noparam(): object {
    return this.failure(2, msgs[2]);
  }
  
  // 值内容
  set data(dt: PlainObject) {
    if (dt && dt.length) this.__datas = dt;
  }
  get data() {
    return this.__datas;
  }
  set config(cfg: AccessConfig) {
    this.__opt = extObj(this.__opt, cfg);
  }

  /**
   * 新增数据
   * @param params  请求参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */  
  create(params: PlainObject, successMsg?: string, failMsg?: string) {
    if(!params) return this.__noparam();
    const isarr = Array.isArray(params);
    const item = this.__datas.length ? this.__datas[0]: ( isarr ? params[0] : params );    
    const isnum = this.__opt.uniqueType === UniqueType.increment;
    const keys = Object.keys(item);
    let lastindex = this.__datas.length ? this.__datas[this.__datas.length-1][this.__opt.uniqueKey] : 0;

    if(isarr) {  // 检测新增内容属性一致，并格式化索引值
      for (let index = 0; index < params.length; index++) {
        const p = params[index];
        const isok = Object.keys(p).every(k => ~keys.indexOf(k))
        if(!isok)  return this.failure(0, failMsg);
        else {
          if(isnum) lastindex++;
          p[this.__opt.uniqueKey] = isnum ? lastindex : uuid();
        }
      }      
    } else if(item !== params && !Object.keys(params).every(k => ~keys.indexOf(k))) 
      return this.failure(0, failMsg);
    else {
      if(isnum) lastindex++;
      params[this.__opt.uniqueKey] = isnum ? lastindex : uuid();
    }
    this.__datas = this.__datas.concat(params);
    return this.success(params, successMsg);
  }

  /**
   * 修改数据
   * @param params  请求参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */  
  update(params: PlainObject, successMsg?: string, failMsg?: string) {
    if(!params) return this.__noparam();
    return this.__filter(params, (item: PlainObject) => {      
      if(item.length) {
        for (const key in params) {
          if (haskey(params, key)) {
            if(item[0][key]) item[0][key] = params[key];
          }
        }
        return this.success(item[0], successMsg)
      } else return this.failure(0, failMsg);
    }, FilterType.unique);
  }

  /**
   * 读取数据
   * @param query  查询参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   * @param mergeObj 返回值拼合更多属性项，可选
   */
  read(query: PlainObject, successMsg?: string, failMsg?: string, mergeObj?: object) {
    if(!query) return this.__noparam();
    return this.__filter(query, (item: PlainObject) => {
      if(item.length === 1) {
        let obj = {};
        
        if(typeof mergeObj === 'object'){
          obj = extObj(obj, item[0])
          obj = extObj(obj, mergeObj)
        }
        return this.success(typeof mergeObj === 'object' ? obj : item[0], successMsg);
      } else return this.failure(0, failMsg);
    }, FilterType.every);
  }

  /**
   * 删除数据
   * @param query  查询参数，对象、值的集合均可
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */
  delete(query: PlainObject, successMsg?: string, failMsg?: string) {
    if(!query) return this.__noparam();
    if(!Array.isArray(query)) query = [ query ];
    let j = 0;
    query.forEach((d: any) => {
      for (let i = 0; i < this.__datas.length; i++) { // 查询关联项，并删除
        const item = this.__datas[i];
        const qi = typeof d === 'object' ? d[this.__opt.uniqueKey] : d;
        const isnum = this.__opt.uniqueType === UniqueType.increment;
        const index = isnum && /\d+/.test(qi) ? parseInt(qi) : qi;

        if(index === item[this.__opt.uniqueKey]){
          this.__datas.splice(i, 1);
          j++;
          break;
        }
      }
    })
    if(j > 0) return this.success(0, successMsg);
    else return this.failure(0, failMsg);
  }
  
  /**
   * 数据是否存在
   * @param query  查询参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   * @param mergeObj  返回值拼合更多属性项，可选
   */
  exist(query: PlainObject, successMsg?: string, failMsg?: string, mergeObj?: object) {
    if(!query) return this.__noparam();
    return this.__filter(query, (item: PlainObject) => {      
      if(item.length === 1) {
        let obj = {};
        
        if(typeof mergeObj === 'object'){
          obj = extObj(obj, item[0])
          obj = extObj(obj, mergeObj)
        }
        return this.success(typeof mergeObj === 'object' ? obj : item[0], successMsg);
      } else return this.failure(0, failMsg);
    }, FilterType.every);
  }

  /**
   * 数据列表
   * @param query  查询参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */
  list(query?: PlainObject, successMsg?: string) {
    if(query && Object.keys(query).length) {
      return this.__filter(query, (item: PlainObject) => {
        if(item.length) return this.success(item, successMsg);
        else return this.success(this.__datas, successMsg);
      }, FilterType.some);
    } else {
      return this.success(this.__datas, successMsg);
    }
  }

  /**
   * 分页数据列表
   * @param query  查询参数, 需含分页参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */
  pageList(query: PlainObject,  successMsg?: string) {
    let pageSize = query[this.__opt.page.sizeField];
    let current = query[this.__opt.page.currentField];

    if(!pageSize || !current) return this.__noparam();
    delete query[this.__opt.page.sizeField];
    delete query[this.__opt.page.currentField];
    if(typeof pageSize === 'string') pageSize = parseInt(pageSize);
    if(typeof current === 'string') current = parseInt(current);
    let dts = this.__datas;

    if(query)
      this.__filter(query, item => item.length ? (dts = item) : 
        (this.__datas.length ? (dts = this.__datas) : item), FilterType.some);

    const total = dts.length;
    const pageCount = Math.ceil(total/pageSize);
    const pageIndex = current > pageCount ? pageCount : (current < 1 ? 1 :current);
    const lastSize = total - (pageCount - 1)* pageSize + (pageCount-1)*pageSize;
    const list = this.__datas.slice((current-1)*pageSize, 
      current < pageCount ? current*pageSize : lastSize );

    return this.success({ 
      [this.__opt.page.totalField]: total, 
      [this.__opt.page.currentField]: pageIndex, 
      [this.__opt.page.sizeField]: pageSize, 
      [this.__opt.page.countField]: pageCount,
      [this.__opt.page.resultsField]: list
    }, successMsg);
  }
  
  // 异步返回
  async(method:'create', params: PlainObject, successMsg?: string, failMsg?: string, timeout?: number): Promise<PlainObject>;
  async(method:'update', params: PlainObject, successMsg?: string, failMsg?: string, timeout?: number): Promise<PlainObject>;
  async(method:'read', query: PlainObject, successMsg?: string, failMsg?: string, mergeObj?: object, timeout?: number): Promise<PlainObject>;
  async(method:'delete', query: PlainObject, successMsg?: string, failMsg?: string, timeout?: number): Promise<PlainObject>;
  async(method:'exist', query: PlainObject, successMsg?: string, failMsg?: string, mergeObj?: object, timeout?: number): Promise<PlainObject>;
  async(method:'list', query?: PlainObject, successMsg?: string, timeout?: number): Promise<PlainObject>;
  async(method:'pageList', query: PlainObject,  successMsg?: string, timeout?: number): Promise<PlainObject>;
  async(method: ('create'|'read'|'update'|'delete'|'exist'|'list'|'pageList'), arg0:PlainObject, ...args: any[]) {
    if(!Promise) throw new Error('运行环境不支持异步！');
    if(!haskey(this, method)) throw new Error('没有找到对应方法！');
    const lastArg = args[args.length -1 ];
    const timeout = typeof lastArg === 'number'? lastArg : 500;

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([ 200, (this[method])(arg0, ...args) ]);
      }, timeout);
    });
  }

  constructor() {
    this.exist =  this.exist.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.read = this.read.bind(this);
    this.delete = this.delete.bind(this);  
    this.list = this.list.bind(this);
    this.pageList = this.pageList.bind(this);
    this.async = this.async.bind(this);
  }

}
