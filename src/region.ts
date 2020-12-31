import rand from './random';
import Division, { RegionInfo } from './division';

const DI_CODE = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65],
  EIGHT_DIGITS = [ // 电话号码 8位
    '010', '021', '022', '023', '024', '025', '027','028', '029', '020', '0311', '0371', '0377', '0379',
    '0411', '0431', '0451', '0512', '0513', '0516','0510', '0531', '0532', '0571', '0574', '0577','0591', '0595',
    '0755', '0757', '0769', '0898'];

export default class {
  private division: Division;
  private __prefecture: RegionInfo;
  private __county: RegionInfo;
  private useInit: [boolean, boolean] = [false, false];

  constructor(code?: string|number) {
    code = code || String(rand.pick(DI_CODE))+ '0000';
    this.division = new Division(code);
    this.__prefecture = this.division.prefecture;
    this.__county = this.division.county;
  }
  
  citycode = () => this.__county.code;
  province = () => this.division.province.name;
  prefecture = (isUpdate = false) => {
    if(isUpdate) {
      if(this.useInit[0]) {
        this.__prefecture = this.division.prefecture;
        this.__county = this.division.county;
        //console.log(this.__county);
      } else  this.useInit[0] = true;
    }    
    return this.__prefecture.name;
  };
  county = (isUpdate = false) => {
    if(isUpdate) {
      if(this.useInit[1]) this.__county = this.division.county;
      else this.useInit[1] = true;
    }
    return this.__county.name;
  };
  phone = () => {
    const cd = this.__county.phone as string;
    let ps;

    if (EIGHT_DIGITS.indexOf(cd) > -1) { ps = cd + '-' + rand.str(1, '826') + rand.numstr(7); }
    else { ps = cd + '-' + rand.str(1, '826') + rand.numstr(rand.int(6)) }
    return ps;
  }
  zipcode = () => this.__county.zipcode as string;
  idcard = () => {
    const pad = (num: number) => num < 10 ? '0' + String(num) : String(num),
      sn = [this.__county.code, rand.int(1949, 2020), 
        pad(rand.int(1, 12)), pad(rand.int(1, 28)), rand.numstr(3)].join(''),
      arr = sn.split(''),
      factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
      parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
    let sum = 0,
      ai = 0,
      wi = 0;

    for (let i = 0; i < 17; i++) {
      ai = +arr[i];
      wi = factor[i];
      sum += ai * wi;
    }
    return sn + String(parity[sum % 11]);
  }
  autocard = () => {
    const card = this.__county.short,
      ps: any = { 京: 'ACEFGHJ', 沪: 'ABCDE', 津: 'ABCDFG' },
      pf = card.length === 1 ? rand.str(Object.prototype.hasOwnProperty.call(ps, card)? ps[card] : 'ABC'): card;

    return pf + (rand.shuffle(rand.str(1, 'ABCDEFGHJKLMNPQRSTUWYZ') + rand.numstr(4)) as string);
  }
  longitude = () => this.__county.longitude + rand.numstr(8);
  latitude = () => this.__county.latitude + rand.numstr(8);
}
