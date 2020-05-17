import { uuid } from './util';

interface PlainObject {
  [key: string]: any;
  [key: number]: any;
}

export interface AccessConfig {
  uniqueKey?: string;
  httpStatus?: number;  
  failureCode?: number;
  successCode?: number;
  codeField?: string;
  msgField?: string;
  dataField?: string;
}

export interface PageParam {
  pageSize: number;
  pageIndex: number;
  [key: string]: any;
}

export function extObj(target: any, source: PlainObject): any { 
  if(Object['assign']) return Object.assign(target, source);
  for (const key in source) { 
    if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
  }
  return target; 
}

export default class {
  private __datas: PlainObject = [];
  private __opt: Required<AccessConfig> = {
    uniqueKey: 'id',
    httpStatus: 200,
    failureCode: 0,
    successCode: 100,
    codeField: 'code',
    msgField: 'message',
    dataField: 'data'
  }
  
  // 操作数据失败处理
  private __f(err: number, msg?: string | string[]) {
    const msgs = ['操作数据失败！', '没有找到记录！', '查询条件错误！'];

    if(Array.isArray(msg) && msg.length) msgs.map((m, i) =>  msg[i] ? msg[i] : m);
    else if(typeof msg === 'string') msgs[0] = msg;
    return {
      [this.__opt.codeField]: this.__opt.failureCode,
      [this.__opt.msgField]: msgs[err]
    };
  }
  // 操作成功处理
  private __s(vo: object, msg?: string) {
    return { 
      [this.__opt.codeField]: this.__opt.failureCode,
      [this.__opt.msgField]: msg !== undefined  ? msg : '操作成功！',
      [this.__opt.dataField]: vo
    };
  }

  // 数据过滤
  private __filter(params: PlainObject, cb: (val: PlainObject) => PlainObject,
    type: 'some' | 'every' | 'unique', failMsg?: string | string[]) {
    if(type=== 'unique' && params && !params[this.__opt.uniqueKey]) 
      return this.__f(2, failMsg);
    else {
      const key = params[this.__opt.uniqueKey];
      let item = [];

      if(key) { // 索引值格式化
        const first = this.__datas[0][this.__opt.uniqueKey];

        if(!first) return this.__f(2, failMsg);
        if(typeof key === 'string' &&  typeof first === 'number' && /\d+/.test(key)) 
          params[this.__opt.uniqueKey] = parseInt(key);
      }
      if(type === 'unique' && key) {  // 按不重复索引值查询
        item = this.__datas.filter((t: PlainObject) =>
          t[this.__opt.uniqueKey] === params[this.__opt.uniqueKey])

      } else if (type === 'some' || type === 'every') { // 按匹配1项或多项查询
        item = this.__datas.filter((item: PlainObject) => 
          Object.keys(params)[type](f => item[f] === params[f]));
      }
      return cb(item);
    }
  }

  // 异步返回
  private __async(cb: (arg: any[]) => PlainObject, timeout = 200) {
    if(!Promise) throw new Error('运行环境不支持异步！请升级为ES6，或使用Promise垫片。');

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(cb([this.__opt.httpStatus]))
      }, timeout);
    });
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
  create(params: PlainObject, successMsg?: string, failMsg?: string | string[]) {
    let lastindex = this.__datas[this.__datas.length-1][this.__opt.uniqueKey];
    if(!lastindex) return this.__f(2, failMsg);
    else {
      const isnum = typeof lastindex === 'number';

      if(Array.isArray(params)) {
        const np = params.map(item => {
          if(isnum) lastindex++;
          item[this.__opt.uniqueKey] = isnum ? lastindex : uuid();            
          return item;
        })

        this.__datas.concat(np);
      } else {
        if(isnum) lastindex++;
        params[this.__opt.uniqueKey] = isnum ? lastindex : uuid();
        this.__datas.push(params);
      }
      if (this.__datas) return this.__s(params, successMsg);
      else return this.__f(0, failMsg);
    }
  }
  asyncCreate(params: PlainObject, successMsg?: string, failMsg?: string | string[], timeout?: number) {
    return this.__async(items => items.concat(this.create(params, successMsg, failMsg)), timeout) 
  }

  /**
   * 修改数据
   * @param params  请求参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */  
  update(params: PlainObject, successMsg?: string, failMsg?: string | string[]) {
    return this.__filter(params, (item: PlainObject) => {      
      if(item.length) {
        for (const key in params) {
          if (params.hasOwnProperty(key)) {
            if(item[0][key]) item[0][key] = params[key];
          }
        }
        return this.__s(item[0], successMsg);
      } else return this.__f(0, failMsg);
    }, 'unique', failMsg);
  }
  asyncUpdate(params: PlainObject, successMsg?: string, failMsg?: string | string[], timeout?: number) {
    return this.__async(items => items.concat(this.update(params, successMsg, failMsg)), timeout) 
  }

  /**
   * 读取数据
   * @param params  请求参数
   * @param plus 返回值拼合更多属性项，可选
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */  
  read(params: PlainObject, plus?: object, successMsg?: string, failMsg?: string | string[]) {
    return this.__filter(params, (item: PlainObject) => {
      console.log(item)
      if(item.length) return this.__s(plus ? extObj(item[0], plus) : item[0], successMsg);
      else return this.__f(1, failMsg)
    }, 'every', failMsg);
  }
  asyncRead(params: PlainObject, plus?: object, successMsg?: string, failMsg?: string | string[], timeout?: number) {
    return this.__async(items => items.concat(this.read(params, plus, successMsg, failMsg)), timeout) 
  }

  /**
   * 删除数据
   * @param params  请求参数，对象、值的集合均可
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */  
  delete(params: PlainObject, successMsg?: string, failMsg?: string | string[]) {
    if(!Array.isArray(params)) params = [ params ];
    let j = 0;
    params.forEach((d: any) => {
      for (let i = 0; i < this.__datas.length; i++) { // 查询关联项，并删除
        const item = this.__datas[i]
        const qi = typeof d === 'object' ? d[this.__opt.uniqueKey] : d;
        const index = /\d+/.test(qi) ? parseInt(qi) : qi;

        if(index === item[this.__opt.uniqueKey]){
          this.__datas.splice(i, 1);
          j++;
          break;
        }
      }
    })
    if(j > 0) return this.__s(this.__datas, successMsg);
    else return this.__f(0, failMsg);
  }
  asyncDelete(params: PlainObject, successMsg?: string, failMsg?: string | string[], timeout?: number) {
    return this.__async(items => items.concat(this.delete(params, successMsg, failMsg)), timeout) 
  }
  
  /**
   * 数据是否存在
   * @param params  请求参数
   * @param plus  返回值拼合更多属性项，可选
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */
  exist(params: PlainObject, plus?: object, successMsg?: string, failMsg?: string | string[]) {
    return this.__filter(params, (item: PlainObject) => {      
      if(item.length === 1) return this.__s(plus ? extObj(item[0], plus) : item[0], successMsg);
      else return this.__f(1, failMsg);
    }, 'every', failMsg);
  }  
  asyncExist(params: PlainObject, plus?: object, successMsg?: string, failMsg?: string | string[], timeout?: number) {
    return this.__async(items => items.concat(this.exist(params, plus, successMsg, failMsg)), timeout) 
  }

  /**
   * 数据列表
   * @param params  请求参数
   * @param successMsg 执行成功的消息
   * @param failMsg 执行失败的回调
   */
  list(params?: PlainObject, successMsg?: string, failMsg?: string | string[]) {
    if(params && Object.keys(params).length) {
      return this.__filter(params, (item: PlainObject) => {
        if(item.length) return this.__s(item, successMsg);
        else if(this.__datas.length) return this.__s(this.__datas, successMsg);
        else return this.__f(1, failMsg);
      }, 'some', failMsg);
    } else {
      if(this.__datas.length) return this.__s(this.__datas, successMsg);
      else return this.__f(1, failMsg);
    }
  }
  asyncList(params?: PlainObject, successMsg?: string, failMsg?: string | string[], timeout?: number) {
    return this.__async(items => items.concat(this.list(params, successMsg, failMsg)), timeout) 
  }

  pageList(params: PageParam, successMsg?: string, failMsg?: string | string[]) {    
    const pageSize = params.pageSize;
    const current = params.pageIndex;
    delete params.pageIndex;
    delete params.pageSize;
    let dts = this.__datas;

    if(Object.keys(params).length)
      this.__filter(params, item => item.length ? (dts = item) : 
        (this.__datas.length ? (dts = this.__datas) : item), 'some', failMsg);

    if(dts.length) {
      const total = dts.length;
      const pageCount = Math.ceil(total/pageSize);
      const pageIndex = current > pageCount ? pageCount : (current < 1 ? 1 :current);
      const lastSize = total - (pageCount - 1)* pageSize + (pageCount-1)*pageSize;
      const list = this.__datas.slice((current-1)*pageSize, 
        current < pageCount ? current*pageSize : lastSize );

      return this.__s({ total, pageIndex, pageSize, pageCount, list}, successMsg);
    } else return this.__f(1, failMsg);
  }
  asyncPageList(params: PageParam, successMsg?: string, failMsg?: string | string[], timeout?: number) {
    return this.__async(items => items.concat(this.pageList(params, successMsg, failMsg)), timeout) 
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
