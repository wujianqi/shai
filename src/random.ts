const LETS = 'abcdefghijklmnopqrstuvwxyz', 
  NUMS = '0123456789';

function getInt(a = 1, b = 10): number {
  return Math.floor(Math.random() * (1 + b - a)) + a;
}

function bool(): boolean {
  return Math.random() < 0.5;
}

function getNumber(a = 1, b = 100, c?: number): number {  
  return c && c >=1 ? +(Math.random() * (1 + b - a) + a).toFixed(c) : getInt(a, b);
}

function pick<T>(arr: T[]): T;
function pick<T>(arr: T[], num: number): T[];
function pick<T>(arr: T[], num?: number): T | T[] { 
  const getItem = () => (arr.length > 0 ? 
    arr[~~(Math.random()*arr.length)] : void 0) as T;
  
  if (typeof num === 'number') {
    const na = new Array(num);

    for (let i = 0; i < num; i++) na[i] = getItem();
    return na;
  } else {
    return getItem();
  }
}

/**
 * 按进制提取大段文本，减少随机次数
 * @param num 
 * @param fix 
 * @returns 
 */
function extract(num: number, fix: number){
  let s = '';
  const n = Math.ceil(num/11);

  for (let i = 0; i < n; i++)
    s += Math.random().toString(fix).slice(2);
  return s.slice(0, num);
}

function getStr(num = 10, strs?: string) { 
  if (num > 55 && !strs) return extract(num, 36);
  strs = strs || LETS + NUMS;
  const s: string[] = new Array(num);

  for (let i = 0; i < num; i++)
    s[i] = strs.charAt(~~(Math.random()*strs.length));    
  return s.join('');
}

function shuffle(ct: string) : string;
function shuffle<T>(ct: T[]) : T[];
function shuffle<T> (ct: string | T[]) {
  const f = () => bool() ? -1 : 1;

  if (Array.isArray(ct)) return ct.sort(f);
  else if(typeof ct === 'string') return Array.from(ct).sort(f).join('');
  else return ct;
}

export default {
  /**
   * 随机整数、数字
   */
  int: getInt,

  /**
   * 取随机数字，包含浮点
   * @param a
   * @param b
   * @param c
   */
  number: getNumber,
  
  /**
   * 随机取数组元素，默认单项，第二个参数未获取多项的个数
   * @param arr
   */
  pick,

  /**
   * 取随机字符串
   * @param strs 
   * @param num
   */
  str: getStr,

  /**
   * 字符或数组位置打乱
   */
  shuffle, 

  /**
   * 随机是否
   */
  bool,

  /**
   * 随机取一次字符，有或无（空）
   */
  once: (ct: string|number): string => bool() ? 
    (typeof ct === 'string' ? ct :(typeof ct === 'number' ? String(ct): '')) :'',

  /**
   * 随机字母
   */ 
  letter: (num = 10, isUpper = false, isBlend = true) =>
    getStr(num, isUpper? (isBlend ? LETS + LETS.toUpperCase(): LETS.toUpperCase()) : LETS),

  /**
   * 数字（字符类型）
   */
  numstr: (num = 10) => extract(num, 10),

  /**
   * 随机字母数字
   */
  alphanum: (num = 10, hasUpper = false) => 
    hasUpper ? getStr(num, LETS + LETS.toUpperCase() + NUMS) : getStr(num),
  
  /**
   * 随机字母数字 + 扩展指定字符（默认特殊字符）
   */
  plus: (num: number, str: string) => 
    getStr(num, LETS + LETS.toUpperCase() + NUMS + str),

  /**
   * 16进制字符
   */
  hex: (num = 6) => extract(num, 16),
}