import { data } from './data';

export interface RegionInfo {
  code: string;
  name: string;
  phone: string;
  zipcode: string;
  longitude: string;
  latitude: string;
  short: string;
}

/**
* 随机区划、并格式化数据
*/
export default class {
  code: string;
  private __province = '';
  private level: number;
  private prefectures: string [] = [];
  private countys: string[] = [];
  private history: [string[], string[]] = [[], []];

  constructor(code: string | number) {
    this.code = typeof code === 'number' ? String(code) : code;
    if (!Object.prototype.hasOwnProperty.call(data, this.code)) throw new Error('行政区划代码不在支持范围内!');
    const pr2 = this.code.slice(0, 2);  
   
    if (/0{4}$/.test(this.code)) this.level = 0; // 省级
    else if (/0{2}$/.test(this.code)) this.level = 1; // 市级
    else this.level = 2; // 县级
    switch (this.level) {
      case 0:
        this.__province = this.code;  
        for (const key in data) {          
          if (!/0{4}$/.test(key) && new RegExp('^' + pr2 + '\\d{2}0{2}').test(key)) 
            this.prefectures.push(key);
          else if (!/0{2}$/.test(key) && new RegExp('^' + pr2 + '\\d{4}').test(key))
            this.countys.push(key);
          else if (this.countys.length > 0 && key.slice(0, 2) !==  pr2) break;
        }
        break;
      case 1:
        this.__province = pr2 + '0000';
        this.prefectures.push(this.code);
        for (const key in data) {
          if (!/0{2}$/.test(key) && new RegExp('^' + this.code.slice(0, 4) + '\\d{2}').test(key)) 
            this.countys.push(key);
          else if (this.countys.length > 0 && key.slice(0, 2) !==  pr2) break;
        }
        break;
      case 2:
        this.__province = pr2 + '0000';
        this.countys.push(this.code);
        this.prefectures.push(this.code.slice(0, 4) + '00');        
        break;
    }
    this.get = this.get.bind(this);
  }

  private get(code: string): RegionInfo {
    const division: [string, string|number, string|number, string, string, string] = data[code];
  
    return {
      code,
      name: division[0],
      phone: (typeof division[1] === 'number' ? this.county.phone : division[1]) as string,
      zipcode: (typeof division[2] === 'number' ? this.county.zipcode : division[2]) as string,
      longitude: division[3],
      latitude: division[4],
      short: division[5]
    }
  }

  get province() {
    return this.get(this.__province);
  }
  get prefecture() {
    if (this.history[0].length === 0 ) 
      this.history[0] = (this.prefectures.length > 0 ? this.prefectures: this.countys).concat(); 
    const item = this.history[0].splice(0, 1)[0];

    if(this.prefectures.length > 0) 
      this.history[1] = this.countys.filter(k => k.slice(0, 4) === item.slice(0, 4) );
    return this.get(item);
  }
  get county() {
    if (this.history[1].length === 0 ) this.history[1] = this.countys.concat();
    return this.get(this.history[1].splice(0, 1)[0]);
  }  
}
