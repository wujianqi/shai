import { util } from "./util";
import RandExp from "randexp";

export interface RegionInterface {
  province: string;
  prefecture: string;
  county: string;
}

interface RegionData {
  [key: string]: (string | number | null)[];
}

var prMap: string[] = [];
var pfMap: string[] = [];
var ctMap: string[] = [];

/**
 * 取随机或特定区域、并格式化数据
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

    this.divisionCode = cc;
    this.regions = datas;
    if (cc === "") this.nocode = true;
    this.prefectures = [];
    this.countys = [];
    this.findRegion();
    this.code = this.rndCode();
  }

  // 取不重复省份
  private getCode(): void {
    let c =
      new RandExp(/1[1-5]|2[1-3]|3[3-7]|4[1-6]|5[1-4]|6[1-5]/).gen() + "0000";

    if (prMap.indexOf(c) === -1) {
      this.divisionCode = c;
      prMap.push(c);
    } else {
      if (prMap.length === 34) prMap = [];
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
      pfMap.splice(index, 1);
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
      ctMap.splice(index, 1);
      return this.getCtCode();
    }
  }

  //取市、县
  private findRegion(): void {
    // 随机省份
    if (this.nocode) this.getCode();
    let hasFinded = false,
      cd = this.divisionCode;

    if (!this.regions[cd])
      throw RangeError(`区划编码“${cd}”不在有效支持范围内！`);

    if (/0{4}$/.test(cd)) {
      // 当前为省级
      this.level = 0;
      // 查找市、县区集合
      for (const key in this.regions) {
        if (this.regions.hasOwnProperty(key)) {
          if (
            new RegExp("^" + cd.slice(0, 2) + "\\d{2}0{2}").test(key) &&
            !/0{4}$/.test(key)
          ) {
            hasFinded = true;
            this.prefectures.push(key);
          } else if (
            new RegExp("^" + cd.slice(0, 2) + "\\d{4}").test(key) &&
            !/0{2}$/.test(key)
          ) {
            hasFinded = true;
            this.countys.push(key);
          } else if (hasFinded) break;
        }
      }
    } else if (/0{2}$/.test(cd)) {
      // 当前为市级
      this.level = 1;
      this.prefectures.push(cd);

      for (const key in this.regions) {
        if (this.regions.hasOwnProperty(key)) {
          if (
            new RegExp("^" + cd.slice(0, 4) + "\\d{2}").test(key) &&
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
      this.prefectures.push(cd.slice(0, 4) + "00");
      this.countys.push(cd);
    }
  }

  private rndCode(): RegionInterface {
    // 取当前省、市、县
    let province: string,
      prefecture: string,
      county: string,
      cd = this.divisionCode;

    switch (this.level) {
      case 0:
        province = cd;
        prefecture = this.getPfCode();
        if (prefecture)
          this.countys = this.countys.filter(
            m => m.slice(0, 4) == prefecture.slice(0, 4)
          );
        if (this.countys.length === 0) county = prefecture;
        // 没有区县的市
        else county = this.getCtCode();
        break;
      case 1:
        province = cd.slice(0, 2) + "0000";
        prefecture = this.divisionCode;
        if (prefecture)
          this.countys = this.countys.filter(
            m => m.slice(0, 4) == prefecture.slice(0, 4)
          );
        if (this.countys.length === 0) county = prefecture;
        // 没有区县的市
        else county = this.getCtCode();
        break;
      case 2:
        province = cd.slice(0, 2) + "0000";
        prefecture = cd.slice(0, 4) + "00";
        county = cd;
        break;
    }
    return {
      province,
      prefecture,
      county
    } as RegionInterface;
  }

  /**
   * 获取随机轮询后的区域名称
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
