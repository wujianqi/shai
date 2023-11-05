/**
 * 自增数
 */
export class Increment {
  private __base = 0;
  private __step = 1;
  constructor(step?: number, base?: number) {
    if(step) this.__step = step;
    if(base) this.__base = base;
  }
  val = () => this.__base += this.__step;
}

/**
 * 区间数
 */
export const range = (min: number, max: number, step = 1) => {
  const num = ~~((max-min)/step) + 1,
    arr:number[] = new Array(num);

  for (let i = 0; i <= num; i++) arr[i] = min + step*i;
  return arr;
}

/**
 * UUID
 * @param arg 
 */
export const uuid = (arg = '-'): string => {
  let d = new Date().getTime();
  const str = ['xxxxxxxx', 'xxxx', '4xxx', 'yxxx', 'xxxxxxxxxxxx'].join(arg),
    uuid = str.replace(/[xy]/g, function(c) {
      const r = (d + Math.random() * 16) % 16 | 0;

      d = Math.floor(d / 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  return uuid;
}

/**
 * 日期格式化
 * @param d 
 * @param fmt YYYY/MM/DD HH:mm:ss ,部分对齐Day.js格式化方式
 */
export function formatDate(d: Date, fmt: string) {
  const opt:{ [key:string]: number } = {
    'Y+': d.getFullYear(),
    'M+': d.getMonth() + 1,
    'D+': d.getDate(),
    'd+': d.getDay(),
    'H+': d.getHours(),
    'h+': d.getHours() % 12,
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'S+': d.getMilliseconds(),
    //'a+': (d.getHours() >= 12 
    //'q+': Math.floor((d.getMonth() + 3) / 3)    
  };
  
  for (const k in opt) {
    const n = new RegExp('(' + k + ')').exec(fmt);
    if(n){
      const t = (n || []) [1] || '', l = t.length;
      let v = opt[k], str;

      if(k === 'h+' && v === 0 ) v = 12;
      if(k === 'd+'){
        str = (l > 1 ? (l > 2 ? '星期' : '周') : '') + '日一二三四五六'.charAt(v);
      } else {
        str = ((l === 1 ? '': '00') + v).slice(-l);
      }        
      fmt = fmt.replace(t, str);
    }
  }
  return fmt;
}