export const util = {
  /**
   * 随机整数、数字
   */
  getInt(a: number, b: number): number {
    return a + Math.floor(Math.random() * (1 + b - a));
  },

  /**
   * 取随机数字
   * @param a 
   * @param b 
   * @param c 
   */
  getNumber(a: number, b: number, c: number = 1): number {
    let p = c < 1 ? 1 : Math.pow(10, c);

    return this.getInt(Math.floor(a * p), Math.floor(b * p)) / p;
  },

  /**
   * 随机取数组元素，单项
   * @param arr 
   */
  getItem<T>(arr: T[]): T {
    return <T>(arr.length > 0 ? arr[this.getInt(0, arr.length - 1)] : null);
  },

  /**
   * 随机取数组元素，多项
   * @param arr 
   * @param num 
   */
  getItems<T>(arr: T[], num: number): T[] {
    let na = [];

    for (let i = 0; i < num; i++) na.push(this.getItem(arr));
    return na;
  },

  /**
   * 格式化时间
   * @param d 
   * @param fmt 
   */
  formatDate(d: Date, fmt: string): string {
    let o: any = {
      'M+': d.getMonth() + 1,
      'd+': d.getDate(),
      'h+': d.getHours(),
      'm+': d.getMinutes(),
      's+': d.getSeconds(),
      'q+': Math.floor((d.getMonth() + 3) / 3),
      'S': d.getMilliseconds()
    }, week: any = {
      '0': '/u65e5',
      '1': '/u4e00',
      '2': '/u4e8c',
      '3': '/u4e09',
      '4': '/u56db',
      '5': '/u4e94',
      '6': '/u516d'
    }, t;

    if (/(y+)/.test(fmt)) {
      t = RegExp.$1;
      fmt = fmt.replace(t, (d.getFullYear() + '').substr(4 - t.length));
    }
    if (/(E+)/.test(fmt)) {
      t = RegExp.$1;
      fmt = fmt.replace(t, (t.length > 1 ? (t.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[d.getDay() + '']);
    }
    for (let k in o) {
      if (new RegExp('(' + k + ')').test(fmt)) {
        t = RegExp.$1;
        fmt = fmt.replace(t, ((t.length === 1) ? o[k] : ('00' + o[k]).slice(-t.length)));
      }
    }
    return fmt;
  }

};
