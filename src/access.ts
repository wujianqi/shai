import { uuid } from './util';

export enum UniqueType {
  'increment',
  'uuid'
}

enum FilterType {
  'some',
  'every',
  'unique'
}

type PlainObject =  { [key: string]: unknown; }

/**
 * @property uniqueKey 索引字段名
 * @property uniqueType 索引类型
 * @property pagePropNames 分页对象自定义属性名
 */
export interface AccessConfig {
  uniqueKey?: string;
  uniqueType?: UniqueType;
}

function haskey(obj: object, k: string){
  return Object.prototype.hasOwnProperty.call(obj, k)
}

export interface PageQueryKeys{
  size?: string;
  index?: string;
}
export interface PageReturnKeys extends PageQueryKeys{
  total?: string;  
  count?: string;
  list?:string; 
}

/**
 * 类数据（JSON数组）访问器
 */
export default class {
  private __datas: PlainObject[] = [];
  private __opt: Required<AccessConfig> = {
    uniqueKey: 'id',
    uniqueType: UniqueType.increment    
  }
  
  // 数据过滤
  private __filter(params: PlainObject, cb: (val: PlainObject[]) => PlainObject[] | PlainObject | undefined, type: FilterType) {
    if(type=== FilterType.unique && params && !params[this.__opt.uniqueKey]) 
      return void 0;
    else {
      const key = params[this.__opt.uniqueKey];
      let item:PlainObject[] = [];

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
  
  // 值内容
  set data(dt: PlainObject[] | undefined) {
    if (dt && dt.length) this.__datas = dt;
  }
  get data() {
    return this.__datas;
  }
  set config(cfg: AccessConfig) {
    this.__opt = Object.assign(this.__opt, cfg);
  }

  /**
   * 新增数据
   * @param params  请求参数
   * @returns 返回新增数据行，没有成功则为未定义
   */  
  create(params: PlainObject[] | PlainObject) {
    if(!params) return void 0;
    const isarr = Array.isArray(params),
      item = Array.isArray(this.__datas) && this.__datas.length > 0 ? this.__datas[0]: ( isarr ? params[0] : params ),    
      isnum = this.__opt.uniqueType === UniqueType.increment,
      keys = Object.keys(item);
    let lastindex = Array.isArray(this.__datas) && this.__datas.length > 0 ? 
      (this.__datas[this.__datas.length-1][this.__opt.uniqueKey] as number) : 0;

    if(isarr) {  // 检测新增内容属性一致，并格式化索引值
      for (let index = 0; index < params.length; index++) {
        const p = params[index];
        const isok = Object.keys(p).every(k => ~keys.indexOf(k))
        if(!isok)  return void 0;
        else {
          if(isnum) lastindex++;
          p[this.__opt.uniqueKey] = isnum ? lastindex : uuid();
        }
      }
    } else if(item !== params && !Object.keys(params).every(k => ~keys.indexOf(k))) 
      return void 0;
    else {
      if(isnum) lastindex++;
      params[this.__opt.uniqueKey] = isnum ? lastindex : uuid();
    }
    this.__datas = this.__datas.concat(params);
    return params;
  }
  
  /**
   * 读取数据
   * @param query  查询参数
   * @param mergeObj 返回值拼合更多属性项，可选
   * @returns 返回查询到的数据行，没有成功则为未定义
   */
  read(query: PlainObject, mergeObj?: PlainObject) {
    if(!query) return void 0;
    return this.__filter(query, (item: PlainObject[]) => {
      if(item.length === 1) {
        let obj = {};
        
        if(typeof mergeObj === 'object'){
          obj = Object.assign(obj, item[0])
          obj = Object.assign(obj, mergeObj)
        }
        return typeof mergeObj === 'object' ? obj : item[0];
      } else return void 0;
    }, FilterType.every);
  }

  /**
   * 修改数据
   * @param params  请求参数
   * @returns 返回修改数据行，没有成功则为未定义
   */  
  update(params: PlainObject) {
    if(!params) return void 0;
    return this.__filter(params, (item: PlainObject[]) =>  {      
      if(item.length) {
        for (const key in params) {
          if (haskey(params, key)) {
            if(item[0][key]) item[0][key] = params[key];
          }
        }
        return item[0]
      } else return void 0;
    }, FilterType.unique);
  }

  
  /**
   * 删除数据
   * @param query  查询参数，对象、值的集合均可
   * @returns 返回成功删除数据的索引值数组，没有成功则为未定义
   */
  delete(query: string | number | (string | number)[] | PlainObject ) {
    if(!query) return void 0;
    let  j = 0;
    const query2 = Array.isArray(query)? query : [ <string | number | PlainObject>query ],
      arr:(string | number | PlainObject)[] = [];
    
    query2.forEach((d: string | number | PlainObject) => {
      for (let i = 0; i < this.__datas.length; i++) { // 查询关联项，并删除
        const item = this.__datas[i];
        const qi = typeof d === 'object' ? d[this.__opt.uniqueKey] : d;
        const isnum = this.__opt.uniqueType === UniqueType.increment;
        const index = isnum && /\d+/.test(<string>qi) ? parseInt(<string>qi) : qi;

        if(index === item[this.__opt.uniqueKey]){
          this.__datas.splice(i, 1);
          arr.push(<number>index)
          j++;
          break;
        }
      }
    })
    if(j > 0) return arr;
    else return void 0;
  }


  /**
   * 数据列表
   * @param query  查询参数
   */
  list(query?: PlainObject) {
    if(query && Object.keys(query).length) {
      return this.__filter(query, (item: PlainObject[]) => {
        if(item.length) return item;
        else return this.__datas;
      }, FilterType.some);
    } else {
      return this.__datas;
    }
  }

  /**
   * 分页数据列表
   * @param query  查询参数, 需含分页参数pageSize、pageCurrent
   */
  pageList(query: PlainObject, queryKeys?: PageQueryKeys, returnKeys?: PageReturnKeys) {
    const qk = {
      size: 'pageSize',
      index: 'pageIndex'
    };
    const ckf = {
      total: 'pageTotal',
      count: 'pageCount',
      list: 'list'
    };

    if(queryKeys) Object.assign(queryKeys, qk);
    if(returnKeys) Object.assign(returnKeys, qk, ckf);

    let pageSize = query[qk.size];
    let pageCurrent = query[qk.index];

    if(!pageSize || !pageCurrent) return void 0;
    delete query.pageSize;
    delete query.pageCurrent;
    if(typeof pageSize === 'string') pageSize = parseInt(pageSize);
    if(typeof pageCurrent === 'string') pageCurrent = parseInt(pageCurrent);
    let dts = this.__datas;

    if(query)
      this.__filter(query, item => item.length ? (dts = item) : 
        (this.__datas.length ? (dts = this.__datas) : item), FilterType.some);

    const result:{[key: string]: unknown;} =  {};
    const t = result[ckf.total] = dts.length;
    const c = result[ckf.count] = Math.ceil(t/<number>pageSize);
    const lastSize = t - (c - 1)* <number>pageSize + (c-1)*<number>pageSize;

    result[(ckf as Required<PageReturnKeys>).index] = <number>pageCurrent > c ? c : (<number>pageCurrent < 1 ? 1 :pageCurrent);    
    result[ckf.list]  = this.__datas.slice((<number>pageCurrent-1)*<number>pageSize, 
    <number>pageCurrent < c ? <number>pageCurrent*<number>pageSize : lastSize );

    return result;
  }

  constructor(dts?: PlainObject[]) {
    if(dts) this.__datas = dts;
    this.create = this.create.bind(this);
    this.update = this.update.bind(this);
    this.read = this.read.bind(this);
    this.delete = this.delete.bind(this);  
    this.list = this.list.bind(this);
    this.pageList = this.pageList.bind(this);
  }

}
