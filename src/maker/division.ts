import { util } from "./util";

export interface RegionInterface {
  province: string;
  prefecture: string;
  county: string;
}

interface RegionData {
  [key: string]: (string | number | null)[];
}

/**
 * 取随机或特定区域、并格式化数据
 */
export default class Division {
  private divisionCode: string;
  private regions: RegionData;
  private level: number = 0;
  private prefectures: string[] = [];
  private countys: string[] = [];
  private prefectureHistoryMap: string[] = [];
  private countyHistoryMap: string[] = [];
  division: RegionInterface;

  constructor(code: string | number, datas: RegionData) {
    let cc = typeof code === "number" ? code + "" : code;

    if (/^\d{6}$/.test(cc)) {
      this.divisionCode = cc;
      this.regions = datas;
      this.extract();
      this.division = this.getRnddivision();
    } else throw TypeError(`区划编码“${code}”不是6位整数数字！`);
  }

  private extract(): void {
    let hasFinded = false,
      code = this.divisionCode;
    if (!this.regions[code])
      throw RangeError(`区划编码“${code}”不在有效支持范围内！`);

    if (/0{4}$/.test(code)) {
      // 当前为省级
      this.level = 0;
      // 查找市、县区集合
      for (const key in this.regions) {
        if (this.regions.hasOwnProperty(key)) {
          if (
            new RegExp("^" + code.slice(0, 2) + "\\d{2}0{2}").test(key) &&
            !/0{4}$/.test(key)
          ) {
            hasFinded = true;
            this.prefectures.push(key);
          } else if (
            new RegExp("^" + code.slice(0, 2) + "\\d{4}").test(key) &&
            !/0{2}$/.test(key)
          ) {
            hasFinded = true;
            this.countys.push(key);
          } else if (hasFinded) break;
        }
      }
    } else if (/0{2}$/.test(code)) {
      // 当前为市级
      this.level = 1;
      this.prefectures.push(code);

      for (const key in this.regions) {
        if (this.regions.hasOwnProperty(key)) {
          if (
            new RegExp("^" + code.slice(0, 4) + "\\d{2}").test(key) &&
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
      this.prefectures.push(code.slice(0, 4) + "00");
      this.countys.push(code);
    }
  }

  private getRnddivision(): RegionInterface {
    // 取当前省、市、县
    let province,
      prefecture,
      county,
      code = this.divisionCode,
      phm = this.prefectureHistoryMap, //轮询同级别区域
      chm = this.countyHistoryMap,
      pi: string[] = [],
      ci: string[] = [];

    if (phm.length === 0) phm = pi.concat(this.prefectures);
    if (chm.length === 0) chm = ci.concat(this.countys);
    switch (this.level) {
      case 0:
        province = code;
        prefecture = util.getItem(phm);
        county = util.getItem(chm);
        phm.splice(phm.indexOf(prefecture), 1);
        chm.splice(chm.indexOf(county), 1);
        break;
      case 1:
        province = code.slice(0, 2) + "0000";
        prefecture = this.divisionCode;
        county = util.getItem(chm);
        chm.splice(chm.indexOf(county), 1);
        break;
      case 2:
        province = code.slice(0, 2) + "0000";
        prefecture = code.slice(0, 4) + "00";
        county = code;
        break;
    }
    return { province, prefecture, county } as RegionInterface;
  }

  /**
   * 获取随机轮询后的区域名称
   * @param index 按序号取数据，0区划名，1电话号码，2邮编，3经度，4纬度，5区划简称
   */
  region(index: number = 0): RegionInterface {
    const d = this.division;

    if (!d.prefecture && d.province) d.prefecture = d.province;
    if (!d.county && d.prefecture) d.county = d.prefecture;
    return {
      province: this.regions[d.province][index] as string,
      prefecture: this.regions[d.prefecture][index] as string,
      county: this.regions[d.county][index] as string
    };
  }
}
