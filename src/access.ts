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

export interface AccessConfig {
  uniqueKey?: string;
  uniqueType?: UniqueType;
  asyncResult?: (result: object) => PlainObject;
  success?: (vo: any, msg?: string) => object;
  failure?: (err: number, msg?: string) => object;
}

export interface PageParam {
  pageSize: number | string;
  pageIndex: number | string;
  [key: string]: any;
}

export function extObj(target: any, source: PlainObject): any { 
  if(Object['assign']) return Object.assign(target, source);
  for (const key in source) { 
    if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
  }
  return target; 
}

const msgs = ['操作失败！', '查询参数错误！', '没有请求参数', '操作成功！'];

export default class {
  private __datas: PlainObject = [];
  private __opt: Required<AccessConfig> = {
    uniqueKey: 'id',
    uniqueType: UniqueType.increment,
    asyncResult: (result: object) => {
      return [ 200, result];
    },
    success: (vo: any, msg?: string) => {
      return {
        code: 0,
        message: typeof msg !== 'string' ? msgs[3]: msg,
        data: vo
      };
    },
    failure: (err: number, msg?: string) => {
      return { 
        code: 500,
        message: typeof msg !== 'string' ? msgs[0] : msg,
      };
    },
  } 

  // 数据过滤
  private __filter(params: PlainObject, cb: (val: PlainObject) => PlainObject, type: FilterType) {
    if(type=== FilterType.unique && params && !params[this.__opt.uniqueKey]) 
      return this.__opt.failure(1, msgs[1]);
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

  // 异步返回
  private __async(todo: () => PlainObject, timeout = 200) {
    if(!Promise) throw new Error('运行环境不支持异步！');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.__opt.asyncResult(todo()))
      }, timeout);
    });
  }

  // 必要参数检测
  private __noparam(): object {
    return this.__opt.failure(2, msgs[2]);
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
        if(!isok)  return this.__opt.failure(0, failMsg);
        else {
          if(isnum) lastindex++;
          p[this.__opt.uniqueKey] = isnum ? lastindex : uuid();
        }
      }      
    } else if(item !== params && !Object.keys(params).every(k => ~keys.indexOf(k))) 
      return this.__opt.failure(0, failMsg);
    else {
      if(isnum) lastindex++;
      params[this.__opt.uniqueKey] = isnum ? lastindex : uuid();
    }
    this.__datas = this.__datas.concat(params);
    return this.__opt.success(params, successMsg);
  }

  asyncCreate(params: PlainObject, successMsg?: string, failMsg?: string, timeout?: number) {    
    return this.__async(() => this.create(params, successMsg, failMsg), timeout) 
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
          if (params.hasOwnProperty(key)) {
            if(item[0][key]) item[0][key] = params[key];
          }
        }
        return this.__opt.success(item[0], successMsg)
      } else return this.__opt.failure(0, failMsg);
    }, FilterType.unique);
  }
  asyncUpdate(params: PlainObject, successMsg?: string, failMsg?: string, timeout?: number) {
    return this.__async(() => this.update(params, successMsg, failMsg), timeout);
  }

  /**
   * 读取数据
   * @param params  请求参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   * @param plus 返回值拼合更多属性项，可选
   */
  read(query: PlainObject, successMsg?: string, failMsg?: string, plus?: object) {
    if(!query) return this.__noparam();
    return this.__filter(query, (item: PlainObject) => {
      if(item.length === 1) {
        let obj = {};
        
        if(typeof plus === 'object'){
          obj = extObj(obj, item[0])
          obj = extObj(obj, plus)
        }
        return this.__opt.success(typeof plus === 'object' ? obj : item[0], successMsg);
      } else return this.__opt.failure(0, failMsg);
    }, FilterType.every);
  }
  asyncRead(query: PlainObject, successMsg?: string, failMsg?: string, plus?: object, timeout?: number) {
    return this.__async(() => this.read(query, successMsg, failMsg, plus), timeout) 
  }

  /**
   * 删除数据
   * @param params  请求参数，对象、值的集合均可
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
    if(j > 0) return this.__opt.success(0, successMsg);
    else return this.__opt.failure(0, failMsg);
  }
  asyncDelete(query: PlainObject, successMsg?: string, failMsg?: string, timeout?: number) {
    return this.__async(() => this.delete(query, successMsg, failMsg), timeout) 
  }
  
  /**
   * 数据是否存在
   * @param params  请求参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   * @param plus  返回值拼合更多属性项，可选
   */
  exist(query: PlainObject, successMsg?: string, failMsg?: string, plus?: object) {
    if(!query) return this.__noparam();
    return this.__filter(query, (item: PlainObject) => {      
      if(item.length === 1) {
        let obj = {};
        
        if(typeof plus === 'object'){
          obj = extObj(obj, item[0])
          obj = extObj(obj, plus)
        }
        return this.__opt.success(typeof plus === 'object' ? obj : item[0], successMsg);
      } else return this.__opt.failure(0, failMsg);
    }, FilterType.every);
  }  
  asyncExist(query: PlainObject, successMsg?: string, failMsg?: string, plus?: object, timeout?: number) {
    return this.__async(() => this.exist(query, successMsg, failMsg, plus), timeout) 
  }

  /**
   * 数据列表
   * @param params  请求参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */
  list(query?: PlainObject, successMsg?: string) {
    if(query && Object.keys(query).length) {
      return this.__filter(query, (item: PlainObject) => {
        if(item.length) return this.__opt.success(item, successMsg);
        else return this.__opt.success(this.__datas, successMsg);
      }, FilterType.some);
    } else {
      return this.__opt.success(this.__datas, successMsg);
    }
  }
  asyncList(query?: PlainObject, successMsg?: string, timeout?: number) {
    return this.__async(() => this.list(query, successMsg), timeout) 
  }

  pageList(page: PageParam, query?: PlainObject,  successMsg?: string) {
    let pageSize = page.pageSize;
    let current = page.pageIndex;
    if(!pageSize || !current) return this.__noparam();
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

    return this.__opt.success({ total, pageIndex, pageSize, pageCount, list}, successMsg);
  }
  asyncPageList(page: PageParam, query?: PlainObject,  successMsg?: string, timeout?: number) {
    return this.__async(() => this.pageList(page, query, successMsg), timeout) 
  }

  constructor() {
    this.exist =  this.exist.bind(this);
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.read = this.read.bind(this);
    this.delete = this.delete.bind(this);  
    this.list = this.list.bind(this);
    this.pageList = this.pageList.bind(this);
    
    this.asyncExist =  this.asyncExist.bind(this);
    this.asyncCreate = this.asyncCreate.bind(this);
    this.asyncUpdate = this.asyncUpdate.bind(this);
    this.asyncRead = this.asyncRead.bind(this);
    this.asyncDelete = this.asyncDelete.bind(this);  
    this.asyncList = this.asyncList.bind(this);
    this.asyncPageList = this.asyncPageList.bind(this);
  }

}
