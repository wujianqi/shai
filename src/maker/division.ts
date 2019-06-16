import { util } from "./util";

export interface RegionInterface {
  province: string;
  prefecture: string;
  county: string;
}

interface RegionData {
  [key: string]: (string | number | null)[];
}

// 历史取值索引
var prOld: string;
var pfOld: string;
var prMap: string[] = [];
var pfMap: string[];
var ctMap: string[];

/**
 * 随机取区域、并格式化数据
 */
export default class Division {
  private divisionCode: string;
  private regions: RegionData;
  private nocode: boolean = false;
  private level: number = 0;
  private prefectures: string[];
  private countys: string[];
  code: RegionInterface;

  constructor(code: string | number, datas: RegionData) {
    let cc = typeof code === "number" ? code + "" : code;

    this.regions = datas;
    if (cc === "" || /\d{6}/.test(cc) === false) this.nocode = true;
    else this.divisionCode = cc;
    this.prefectures = [];
    this.countys = [];
    this.findRegion();
    this.code = this.rndCode();
  }

  // 取不重复省份
  private getCode(): void {
    const prc = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37,
      41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65];
    let c = util.getItem(prc)+ "0000",
      index = prMap.indexOf(c);
    if (index === -1) {
      this.divisionCode = c;
      prMap.push(c);
    } else {
      if (prMap.length >= 31) prMap = [];
      this.getCode();
    }
  }

  // 取不重复市
  private getPfCode(): string {
    if (this.prefectures.length === 0) return null;
    let c = util.getItem(this.prefectures),
      index = pfMap.indexOf(c);

    if (!c) {
      pfMap = [];
      return this.getPfCode();
    } else if (index === -1) {
      pfMap.push(c);
      return c;
    } else {
      if (pfMap.length >= this.prefectures.length) pfMap = [];
      return this.getPfCode();
    }
  }

  // 取不重复县区
  private getCtCode(): string {
    if (this.countys.length === 0) return null;
    let c = util.getItem(this.countys),
      index = ctMap.indexOf(c);

    if (!c) {
      ctMap = [];
      return this.getCtCode();
    } else if (index === -1) {
      ctMap.push(c);
      return c;
    } else {
      if (ctMap.length >= this.countys.length) ctMap = [];
      return this.getCtCode();
    }
  }

  //取市、县数据集
  private findRegion(): void {
    if (this.nocode) this.getCode();
    let hasFinded = false,
      cd2 = this.divisionCode.slice(0, 2),
      cd4 = this.divisionCode.slice(0, 4);
    
    if (!this.regions[this.divisionCode])
      throw RangeError(`区划编码“${this.divisionCode}”不在有效支持范围内！`);

    if (/0{4}$/.test(this.divisionCode)) {
      // 当前为省级
      this.level = 0;
      // 查找市、县区集合
      for (const key in this.regions) {
        if (this.regions.hasOwnProperty(key)) {
          if (
            new RegExp("^" + cd2 + "\\d{2}0{2}").test(key) &&
            !/0{4}$/.test(key)
          ) {
            hasFinded = true;
            this.prefectures.push(key);
          } else if (
            new RegExp("^" + cd2 + "\\d{4}").test(key) &&
            !/0{2}$/.test(key)
          ) {
            hasFinded = true;
            this.countys.push(key);
          } else if (hasFinded) break;
        }
      }
    } else if (/0{2}$/.test(this.divisionCode)) {
      // 当前为市级
      this.level = 1;
      this.prefectures.push(this.divisionCode);

      for (const key in this.regions) {
        if (this.regions.hasOwnProperty(key)) {
          if (
            new RegExp("^" + cd4 + "\\d{2}").test(key) &&
            !/0{2}$/.test(key)
          ) {
            hasFinded = true;
            this.countys.push(key);
          } else if (hasFinded) break;
        }
      }
    } else {
      // 当前为县区级
      this.level = 2;
      this.prefectures.push(cd4 + "00");
      this.countys.push(this.divisionCode);
    }
  }

  // 取省、市、县区划代码
  private rndCode(): RegionInterface {
    let province: string,
      prefecture: string,
      county: string,
      cd2 = this.divisionCode.slice(0, 2),
      cd4 = this.divisionCode.slice(0, 4),
      getCt = () => {
        if (prefecture)
          this.countys = this.countys.filter(
            m => m.slice(0, 4) === prefecture.slice(0, 4)
          );
        // 没有区县的市
        if (this.countys.length === 0) return prefecture;        
        else return this.getCtCode();
      };

    // 不同的省、市,则重置历史索引
    if (cd2 !== prOld) {
      pfMap = [];
      ctMap = [];
      prOld = cd2;
    } else if (cd4 !== pfOld) {
      ctMap = [];
      pfOld = cd4;
    }
    switch (this.level) {
      case 0:
        province = this.divisionCode;        
        prefecture = this.getPfCode();
        county = getCt()
        break;
      case 1:
        province = cd2 + "0000";
        prefecture = this.divisionCode;
        county = getCt()
        break;
      case 2:
        province = cd2 + "0000";
        prefecture = cd4 + "00";
        county = this.divisionCode;
        break;
    }
    return {
      province,
      prefecture,
      county
    } as RegionInterface;
  }

  /**
   * 按区划代码及序号，取对应区域数据
   * @param index 按序号取数据，0区划名，1电话号码，2邮编，3经度，4纬度，5区划简称
   */
  getData(index: number = 0): RegionInterface {
    const d = this.code;

    if (!d.prefecture) d.prefecture = d.county;
    return {
      province: this.regions[d.province][index] as string,
      prefecture: this.regions[d.prefecture][index] as string,
      county: this.regions[d.county][index] as string
    };
  }
}
