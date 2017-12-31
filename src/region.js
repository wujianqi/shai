import { config } from './config';
import { data } from './resource';
import { util } from './util';

var divisionCode, tmp1, tmp2,
  filterWord = ['市辖区', '县', '省直辖县级行政区划', '自治区直辖县级行政区划'],
  getNRItem = (arr, tmpSet) => {
    let item = util.getItem(arr);

    if (item && tmpSet.has(item)) item = getNRItem(arr, tmpSet);
    else {
      tmpSet.add(item);
      if (tmpSet.size === arr.length) tmpSet.clear();
    }
    return item;
  };

export default class Region {
  constructor() {
    tmp1 = new Set([]);
    tmp2 = new Set([]);
    divisionCode = config.divisionCode + '';
    this.extract = this.extract.bind(this);
  }

  /**
   * 随机取省、市、县名称、简称、区划代码、位置
   */
  extract() {
    let division = data.division.get(divisionCode),
      city, province, prefecture, county, cityCode;

    if (/0{4}$/.test(divisionCode)) {
      province = division.name;
      city = getNRItem(data.division.prefectures(division.code), tmp1);
      prefecture = city.name;
      city = getNRItem(data.division.counties(city.code), tmp2);
      county = city.name;
      cityCode = city.code;
      this.level = 1;

    } else if (/0{2}$/.test(divisionCode)) {
      province = division.province.name;
      prefecture = division.name;
      city = getNRItem(data.division.counties(division.code), tmp2);
      county = city.name;
      cityCode = city.code;
      this.level = 2;

    } else {
      province = division.province.name;
      prefecture = division.prefecture.name;
      county = division.name;
      cityCode = division.code;
      this.level = 3;
    }
    this.province = province;
    this.prefecture = filterWord.indexOf(prefecture) === -1 ? prefecture : province;
    this.county = filterWord.indexOf(county) === -1 ? county : prefecture;
    this.cityCode = cityCode;
    let pt = data.geo.find(elem => elem.county === this.county);

    this.point = pt ? pt : data.geo.find(elem => elem.county === this.prefecture);
    this.shorter = (function (obj) {
      let name = '';

      for (const p in obj) {
        if (p === divisionCode.slice(0, 2)) {
          name = obj[p];
          break;
        }
      }
      return name;
    })(data.shorter);
  }

}
