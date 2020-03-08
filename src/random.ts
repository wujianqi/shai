const LETS = 'abcdefghijklmnopqrstuvwxyz',
  NUMS = '0123456789';  

function getInt(a = 1, b = 10): number {
  //return Math.round(Math.random()*(b- a + 1 ) + a);
  return parseInt((Math.random()*(b- a + 1 ) + a).toString());
}

function bool(): boolean {
  return Math.random() < 0.5;
}

function getNumber(a = 1, b = 100, c?: number): number {  
  return c && c >=1 ? +(Math.random()*(b - a + 1) + a).toFixed(c) : getInt(a, b);
}

function pick<T>(arr: T[]): T;
function pick<T>(arr: T[], num: number): T[];
function pick<T>(arr: T[], num?: number): T | T[] { 
  const getItem = () => (arr.length > 0 ? 
    arr[parseInt(((Math.random()*arr.length)).toString())] : void 0) as T;
  
  if (typeof num === 'number') {
    const na = new Array(num);

    for (let i = num; i > 0; i--) na[i] = getItem();
    return na;
  } else {
    return getItem();
  }  
}

function getStr(num = 10, strs?: string) {
  strs = strs || LETS + LETS.toUpperCase() + NUMS;
  const s: string[] = new Array(num);

  for (let i = num; i > 0; i--)
    s[i] = strs.charAt(parseInt((Math.random()*strs.length).toString()));    
  return s.join('');
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
   * 字符位置打乱
   */
  shuffle: (str: string) => {
    const arr = Array.from ? Array.from(str) : Array.prototype.slice.call(str);
  
    return arr.sort(() => bool() ? -1 : 1 ).join('');
  }, 

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
  letter: (num = 10, isLower = false) =>
    getStr(num, isLower? LETS : LETS + LETS.toUpperCase()),

  /**
   * 数字（字符类型）
   */
  numstr: (num = 10) => getStr(num, NUMS),

  /**
   * 随机字母数字
   */
  alphanum: (num = 10, isLower = false) => 
    getStr(num, isLower? LETS : LETS + LETS.toUpperCase() + NUMS),
  
  /**
   * 随机字母数字 + 指定字符
   */
  ext: (num: number, str: string) => 
    getStr(num, LETS + LETS.toUpperCase() + NUMS + str),

  /**
   * 16进制字符
   */
  hex: (num = 6) => getStr(num, 'abcdef' + NUMS),
}