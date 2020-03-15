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
    arr = new Array(num);

  for (let i = 0; i <= num; i++) arr[i] = min + step*i;
  return arr;
}

/**
 * UUID/GUID
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
 * @param fmt 
 */
export function formatDate(d: Date, fmt: string): string {
  const o: { [key: string]: number } = {
    'M+': d.getMonth() + 1,
    'd+': d.getDate(),
    'h+': d.getHours(),
    'm+': d.getMinutes(),
    's+': d.getSeconds(),
    'q+': parseInt(((d.getMonth() + 3) / 3).toString()),
    'S': d.getMilliseconds(),
  }, 
    week: string[] = [
      '/u65e5', '/u4e00', '/u4e8c', '/u4e09', '/u56db', '/u4e94', '/u516d',
    ]
  let t;

  if (/(y+)/.test(fmt)) {
    t = RegExp.$1;
    fmt = fmt.replace(t, String(d.getFullYear()).substr(4 - t.length));
  }
  if (/(E+)/.test(fmt)) {
    t = RegExp.$1;
    fmt = fmt.replace(t, (t.length > 1 ? (t.length > 2 ? '/u661f/u671f' : '/u5468') : '') + 
            week[d.getDay()]);
  }
  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      t = RegExp.$1;
      const num = String(o[k]);
      fmt = fmt.replace(t, ((t.length === 1) ? num : ('00' + num).slice(-t.length)));
    }
  }
  return fmt;
}
