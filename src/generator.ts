interface MethodFunc<T extends unknown[]> {
  (...args: T): string | number | boolean | null ;
}

type PlainObject =  { [key: string]: any; }
type JsonArrayOrObject = PlainObject[] | PlainObject

export interface SettingOption {
  key?: string;
  length?: number | [number, number];  
  level?: number | [number, number];
}

type SettingType = SettingOption | number | [number, number];

function haskey(obj: PlainObject, k: string){
  return Object.prototype.hasOwnProperty.call(obj, k)
}

// 深度拷贝
function clone<T extends JsonArrayOrObject>(obj: T): T {
  /* if(typeof globalThis !== 'undefined' && globalThis['structuredClone'])  
    return structuredClone(obj); */

  const newObj = Array.isArray(obj) ? [] : {};
  for (const k in obj) {
    if(haskey(obj, k)) {
      const item = obj[k];

      if (typeof item == 'object') 
        (<PlainObject>newObj)[k] = clone(<JsonArrayOrObject>item);
      else (<PlainObject>newObj)[k] = item;
    }
  }
  return <T>newObj;
}

export default class {
  private __funcs: [MethodFunc<any>, unknown[]][] = [];
  private __data: JsonArrayOrObject = [];
  private __propKey = 'setting';
  private __SB: symbol = Symbol();

  /**
   * 设值
   */
  private setVal(path: (string|number) [], value: JsonArrayOrObject){
    const len = path.length -1;

    path.reduce((obj, key, index) => { // 设值
      if (index === len) (<PlainObject>obj)[key] = value;
      return (<PlainObject>obj)[key];
    }, this.__data);
  }

  /**
   * 添加嵌套子属性
   */
  private addChild(data: JsonArrayOrObject, level: number, opt: SettingOption) {
    const key = opt.key || 'children',
      tempArr = this.mapping(data, opt);

    if(level < 1) return tempArr
    else {
      const newArr = clone(tempArr);

      level--;
      for (let i = 0, len = newArr.length; i < len; i++) {
        if(level === 1) newArr[i][key] = clone(tempArr)
        else newArr[i][key] = this.addChild(tempArr[i], level, opt)
      }
      return newArr;
    }
  }

  /**
   * 按选项配置生成数组
   * @param data
   * @param opt
   */
  private mapping(data: JsonArrayOrObject, opt: SettingType): PlainObject[] {
    if (typeof data === 'object' && opt) {
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
        ds = new Array(len); // 指定长度或随机长度

      delete (<PlainObject>data)[this.__propKey];
      for(let i = 0; i < len; i++) // 生成列表
        ds[i] = clone(data);
      return ds;
      
    } else return data as PlainObject[];
  }

  /**
   * 转换批量设置的块
   */
  private parseBlock (): void {
    const getArr = (d: PlainObject) => {
      const opt = d[this.__propKey];

      // 判断配置项是否为嵌套
      if(!Array.isArray(opt) && typeof opt === 'object') {        
        const lev = (typeof opt.level === 'number') ? opt.level : 1;

        d = this.addChild(d, lev, opt); // 生成子对象
      } else {
        d = this.mapping(d, opt); // 生成数组
      }
      return d;
    };
    // 递归找带有配置的对象
    const find = (dt: JsonArrayOrObject, path?: (string | number)[]) => {
      if (!Array.isArray(dt) && haskey(dt, this.__propKey)){
        dt = getArr(dt);

        if (path) this.setVal(path, dt);
        else this.setVal([], this.__data = dt);
      }

      for (const k in dt) {
        if(haskey(dt, k)) {
          const v = (<PlainObject>dt)[k];         

          if (Array.isArray(v) && v[0] !== this.__SB) 
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
  private setValues (data: JsonArrayOrObject, path?: (string | number)[]): void {
    if (Array.isArray(data)) {
      if (data[0] === this.__SB) {
        const p = path ? path : [],
          fnc: any[] = this.__funcs[data[1]].concat();

        try {
          //console.log(fnc.length, fnc[0](...fnc[1]),4444)
          this.setVal(p, fnc.length > 0 ? fnc[0](...fnc[1]) : data);          
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
  use<T extends unknown[]>(fnc: MethodFunc<T>, ...args: T): [symbol, number]{
    return [this.__SB, this.__funcs.push([fnc, args]) - 1];
  }

  /**
   * 数据生成
   * @param data 包含生成数据方法的对象
   * @param propKey 指定选项的属性键名
   */
  gen(data: JsonArrayOrObject, propKey?: string) {
    if(typeof data !== 'object') return void 0;
    if(propKey) this.__propKey = propKey;
    this.__data = data;
    this.parseBlock();
    this.setValues(this.__data);
    return this.__data as PlainObject[];
  }

  constructor() {
    this.use =  this.use.bind(this);
    this.gen = this.gen.bind(this);
  }
  
}
