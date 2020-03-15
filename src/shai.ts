interface MethodFunc {
  (...args: any[]): any;
}

const KEY = '\u2592';
interface Labels {
  0: typeof KEY;
  1: number;
}

interface TypeValue {
  [key: string]: any;
  [key: number]: any;
}

export interface SettingOption {
  length?: number | [number, number];
  child?: string;
  level?: number | [number, number];
  renew?: object;
  remove?: (string| number)[];
}

function clone (obj: TypeValue): TypeValue {
  const isArr = Array.isArray(obj),
    newObj: TypeValue = isArr ? [] : {};

  for (const k in obj) {
    if(obj.hasOwnProperty(k)) {
      const item = obj[k];
      if (typeof item == 'object') 
        newObj[k] = clone(item);
      else newObj[k] = item;
    }
  }
  return newObj;
}

function extObj(target: TypeValue, source: TypeValue): TypeValue { 
  for (const key in source) { 
    if (Object.prototype.hasOwnProperty.call(source, key)) target[key] = source[key];
  }
  return target; 
}

export default class {
  private __funcs: [MethodFunc, any[]][] = [];
  private __data: TypeValue = [];
  private __propKey = 'setting';

  /**
   * 设值
   */
  private setv(path: (string|number) [], value: TypeValue){
    const len = path.length -1;
 
    path.reduce((obj, key, index) => { // 设值
      if (index === len) obj[key] = value;
      return obj[key];
    }, this.__data);
  }

  /**
   * 多层嵌套
   */
  private nested(items: TypeValue[], key: string, num: number) {
    if(num > 1) {
      const na = clone(items);

      num--;
      items.forEach(d => {
        if(!d.hasOwnProperty(key)) {
          d[key] = na;
          this.nested(d[key], key, num);
        }
      });
    }
    return items;
  }

  /**
   * 按选项配置生成数组
   * @param data
   * @param opt
   */
  private settingToArr (data: TypeValue, opt: SettingOption): TypeValue {
    if (opt) {
      const init = (prop: 'length'|'level'): number => {
          const p = opt[prop], 
            num = typeof p === 'number' ? p : 
            (Array.isArray(p) && p.length === 2 ? 
              Math.floor(Math.random() * (p[1] - p[0]) + p[0]) : 1);

          return (!num || num < 1) ? 1 : num;
        }, 
        len = init('length'), 
        ds = new Array(len);

      delete data[this.__propKey];
      if (opt.remove) opt.remove.forEach(n => {
        if (data.hasOwnProperty(n)) delete data[n];
      });
      if (opt.renew) data = Object.assign ? 
        Object.assign(data, opt.renew): extObj(data, opt.renew) ;

      for(let i = 0; i < len; i++) // 生成列表
        ds[i] = clone(data);

      if (typeof opt.child === 'string' && opt.child ) {
        const nk = opt.child;

        data[nk] = this.nested(ds, nk, init('level'));
      } else data = ds;
    }
    return data;
  }

  /**
   * 转换批量设置的块
   */
  private bulk (): void {
    const getArr = (d: TypeValue) => {
      let opt = d[this.__propKey];
  
      if (typeof opt === 'number' || (Array.isArray(opt) && opt.length === 2 // 简写配置转换
        && typeof opt[0] === 'number' && typeof opt[1] === 'number'))
        opt = {length : opt};
      else if (Array.isArray(opt) && opt.length >= 2 && typeof opt[0] === 'number' && opt[1] === true)
        opt = {length : opt[0], child: 'children', level: typeof opt[2] === 'number' ? opt[2]: 1};
      d = this.settingToArr(d, opt);
      return d;
    };
    const find = (dt: TypeValue, path?: (string | number)[]) => {      
      if (!Array.isArray(dt) && dt.hasOwnProperty(this.__propKey)){
        dt = getArr(dt);
        if (path) this.setv(path, dt);
        else this.setv([], this.__data = dt);
      }
      for (const k in dt) {
        if(dt.hasOwnProperty(k)) {
          const v = dt[k];

          if (Array.isArray(v) && v[0] !== KEY) 
            v.forEach((d, i) => 
              find(d, path ? path.concat([k, i]) : [k, i]));
          else if(!Array.isArray(v) && typeof v === 'object' )
            find(v, path ? path.concat([k]) : [k]);
        }
      }
    };
    find(this.__data);
  }

  /**
   * 转换生成的值
   * @param data
   * @param path
   */
  private setValues (data: TypeValue, path?: (string | number)[]): void { 
    if (Array.isArray(data)) {
      if (data[0] === KEY) {
        const p = path ? path : [],
          fnc: any[] = this.__funcs[data[1]].concat();

        try {
          this.setv(p, fnc.length > 0 ? fnc[0](...fnc[1]) : data);
        } catch (err) {
          throw new Error(`${p.length > 0  ? p.join('.') : data}: error, ${err}`);
        }          
      } else data.forEach((d,i) => 
        this.setValues(d, path ? path.concat([i]) : [i]));
    } else if(typeof data === 'object')
      Object.keys(data).forEach(k => 
        this.setValues(data[k], path ? path.concat([k]) : [k]));
  }

  /**
   * 索引数据生成方法
   * @param fnc 生成数据的方法函数
   * @param args 函数的参数赋值
   */
  use(fnc: MethodFunc, ...args: any[]): Labels {
    return [KEY, this.__funcs.push([fnc, args])-1 ];
  }

  /**
   * 数据生成
   * @param data 包含生成数据方法的对象
   * @param propKey 指定选项的属性键名
   */
  gen(data: object, propKey?: string) {
    if(typeof data !== 'object') return void 0;
    if(propKey) this.__propKey = propKey;
    this.__data = data;
    this.bulk();
    this.setValues(this.__data);
    return this.__data;
  }

  constructor() {
    this.setv = this.setv.bind(this);
    this.nested = this.nested.bind(this);
    this.settingToArr = this.settingToArr.bind(this);
    this.bulk = this.bulk.bind(this);
    this.setValues = this.setValues.bind(this);
    this.use =  this.use.bind(this);
    this.gen = this.gen.bind(this);
  }
  
}
