import Access, { extObj, AccessConfig, PageParam} from './access';

export { AccessConfig, PageParam };

interface MethodFunc {
  (...args: any[]): any;
}

const KEY = '\u2592';
interface Labels {
  0: typeof KEY;
  1: number;
}

export interface PlainObject {
  [key: string]: any;
  [key: number]: any;
}

export interface SettingOption {
  key?: string;
  length?: number | [number, number];  
  level?: number | [number, number];
  renew?: object;
  remove?: (string| number)[];
  at?: number;
}

function clone (obj: PlainObject): PlainObject {
  const isArr = Array.isArray(obj),
    newObj: PlainObject = isArr ? [] : {};

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

export default class {
  private __funcs: [MethodFunc, any[]][] = [];
  private __data: PlainObject = [];
  private __propKey = 'setting';
  private __access: Access = new Access();

  /**
   * 设值
   */
  private setv(path: (string|number) [], value: PlainObject){
    const len = path.length -1;
 
    path.reduce((obj, key, index) => { // 设值
      if (index === len) obj[key] = value;
      return obj[key];
    }, this.__data);
  }

  /**
   * 添加嵌套子属性
   */
  private addChild(items: PlainObject[], key: string, level: number, opt: SettingOption) {
    const index = opt.at || 0;

    level--;
    for (let i = 0, len = items.length; i < len; i++) {
      let item = items[i];

      if (opt.renew && index === level) 
        item = Object.assign ? Object.assign(item, opt.renew): extObj(item, opt.renew); // 变更属性
      if (opt.remove && index === level) opt.remove.forEach(d => { // 移除属性
        if (item.hasOwnProperty(d)) delete item[d];
      });
      
      if(level > 0 && !item.hasOwnProperty(key)) {          
        item[key] = clone(items);
        this.addChild(item[key], key, level, opt);
      }
    }
    return items;
  }

  /**
   * 按选项配置生成数组
   * @param data
   * @param opt
   */
  private transform (data: PlainObject, opt: SettingOption | number | [number, number]): PlainObject {
    if (opt) {
      const getN = (val: number | [number, number]) => {
          let nl = 1;

          if(typeof val === 'number') nl = val;
          else if(Array.isArray(val) && typeof val[0] === 'number' && typeof val[1] === 'number') 
            nl = ~~(Math.random() * (val[1] - val[0]) + val[0]);
          return nl;
        },
        len = (typeof opt === 'number' || 
        (Array.isArray(opt) && typeof opt[0] === 'number' && typeof opt[1] === 'number') ?
          getN(opt): (typeof opt === 'object' && opt.length) ? getN(opt.length) : 1),
        ds = new Array(len);

      delete data[this.__propKey];
      for(let i = 0; i < len; i++) // 生成列表
        ds[i] = clone(data);
        
      if(typeof opt === 'object' && typeof opt !== 'number' && !Array.isArray(opt)) {
        const lev = (typeof opt.level === 'number') ? opt.level : 1,
          k = opt.key || 'children';

        if (opt.at && opt.at >= lev) throw new Error('setting "at" out of range!');
        if (k) data[k] = this.addChild(ds, k, lev, opt); // 生成子对象
      } else data = ds;
    }
    return data;
  }

  /**
   * 转换批量设置的块
   */
  private parseBlock (): void {
    const getArr = (d: PlainObject) => {
      const opt = d[this.__propKey];
  
      d = this.transform(d, opt);
      return d;
    };
    const find = (dt: PlainObject, path?: (string | number)[]) => {      
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
  private setValues (data: PlainObject, path?: (string | number)[]): void { 
    if (Array.isArray(data)) {
      if (data[0] === KEY) {
        const p = path ? path : [],
          fnc: any[] = this.__funcs[data[1]].concat();

        try {
          this.setv(p, fnc.length > 0 ? fnc[0](...fnc[1]) : data);          
        } catch (err) {
          throw new Error(`${p.length > 0  ? p.join('.') : data}: error, ${err}`);
        }          
      } else data.forEach((d, i) => this.setValues(d, path ? path.concat([i]) : [i]));
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
    this.parseBlock();
    this.setValues(this.__data);
    this.__access.data = this.__data;
    return this.__data;
  }

  /**
   * 仿数据CRUDE操作
   */
  get access() {
    return this.__access;
  }

  constructor() {
    this.use =  this.use.bind(this);
    this.gen = this.gen.bind(this);
  }
  
}
