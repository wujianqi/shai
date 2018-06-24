import Maker, { MakerInterface } from './maker';
import { util } from './util';
import { names } from './resource/names';
import { feature } from './resource/feature';
import { RuleFunc } from './base'
import { regions } from './resource/regions';
import RandExp  = require('randexp');

export interface MockConfig {
    'divisionCode'?: string;
    'beginTime'?: Date;
    'endTime'?: Date;
}

export interface Division {
    'province': string;
    'prefecture': string;
    'county': string;
}

export interface MockInterface extends MakerInterface {
    readonly region: (string | number | null)[];
}

const randCode = /(1[1-5]|2[1-3]|3[3-7]|4[1-6]|5[1-4]|6[1-5])/;

/**
 * 数据模拟
 */
export default class Mock extends Maker implements MockInterface {
    private config: MockConfig = {
        'divisionCode': new RandExp(randCode).gen() + '0000',
        'beginTime': new Date('1970/01/01'),
        'endTime': new Date()
    };
    private is8bit: string[] = [ // 电话号码 8位
        '010','021','022','023','024','025','027','028','029','020','0311','0371','0377',
        '0379','0411','0451','0512','0513','0516','0510','0531','0532','0571','0574','0577',
        '0591','0595','0755','0757','0769','0898','0431'       
    ];

    private level: number = 0;
    private prefectures: string[] = [];
    private countys: string[] = [];
    private prefectureHistoryMap: string[] = [];
    private countyHistoryMap: string[] = [];
    private division: Division;

    private extract(): void {
        let conf = this.config, hasFinded = false,
            code = conf.divisionCode ? conf.divisionCode : new RandExp(randCode).gen() + '0000';

        if (!regions[code]) throw Error(`区划编码“${conf.divisionCode}”不在有效支持范围内！`);

        if (/0{4}$/.test(code)) { // 当前为省级
            this.level = 0;
            // 查找市、县区集合
            for (const key in regions) {
                if (regions.hasOwnProperty(key)) {
                    if (new RegExp('^' + code.slice(0, 2) + "\\d{2}0{2}").test(key) && !/0{4}$/.test(key)) {
                        hasFinded = true;
                        this.prefectures.push(key);
                    } else if (new RegExp('^' + code.slice(0, 2) + "\\d{4}").test(key) && !/0{2}$/.test(key)) {
                        hasFinded = true;
                        this.countys.push(key);
                    } else if (hasFinded) break;
                }
            }

        } else if (/0{2}$/.test(code)) { // 当前为市级
            this.level = 1;
            this.prefectures.push(code);

            for (const key in regions) {
                if (regions.hasOwnProperty(key)) {
                    if (new RegExp('^' + code.slice(0, 4) + "\\d{2}").test(key) && !/0{2}$/.test(key)) {
                        hasFinded = true;
                        this.countys.push(key);
                    } else if (hasFinded) break;
                }
            }

        } else { // 当前为县区级
            this.level = 2;
            this.prefectures.push(code.slice(0, 4) + '00');
            this.countys.push(code);
        }
    }

    private getRndDivision(): Division { // 取当前省、市、县
        let province, prefecture, county,
            code = this.config.divisionCode;

        if(code){
            let phm = this.prefectureHistoryMap,
                chm = this.countyHistoryMap,
                pi:string[] = [],
                ci:string[] = []; 

            if (phm.length === 0 ) phm = pi.concat(this.prefectures);
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
                    province = code.slice(0, 2) + '0000';
                    prefecture = this.config.divisionCode;
                    county = util.getItem(chm);
                    chm.splice(chm.indexOf(county), 1);
                    break;
                case 2:
                    province = code.slice(0, 2) + '0000';
                    prefecture = code.slice(0, 4) + '00';
                    county = code;
                    break;
            }            
        }
        return { province, prefecture, county } as Division;        
    }

    // 获取设定的区域对象
    get region(): (string | number | null)[] {
        return this.config.divisionCode ? regions[this.config.divisionCode] : [] ;
    }

    constructor(option?: MockConfig) {
        super();
        (<any>Object).assign(this.config, option);

        let rd = () => {
            let bt = this.config.beginTime ? this.config.beginTime: new Date('1970/01/01'), 
                et = this.config.endTime ? this.config.endTime : new Date();
            return new Date(util.getInt(bt.getTime(), et.getTime()));
        }

        this.extract();
        this.division = this.getRndDivision();
        this.addRule({
            'enum': <RuleFunc>(<T>(...args: T[]): T => util.getItem(args)),
            'int': <RuleFunc>((arg1: number = 0, arg2: number = 100) => util.getInt(arg1, arg2)),
            'number': <RuleFunc>((arg1: number = 0, arg2: number = 10000, arg3: number = 2) => util.getNumber(arg1, arg2, arg3)),
            'bool': <RuleFunc>(() => util.getItem([true, false])),
            'datetime': <RuleFunc>((arg: string) => util.formatDate(rd(), (arg ? arg : 'yyyy-MM-dd hh:mm:ss'))),
            'date': <RuleFunc>(() => util.formatDate(rd(), 'yyyy-MM-dd')),
            'time': <RuleFunc>(() => util.formatDate(rd(), 'hh:mm:ss')),
            'year': <RuleFunc>(() => +util.formatDate(rd(), 'yyyy')),
            'month': <RuleFunc>(() => util.getInt(1, 12)),
            'day': <RuleFunc>(() => util.getInt(1, 31)),
            'hour': <RuleFunc>(() => util.getInt(0, 23)),
            'minute': <RuleFunc>(() => util.getInt(1, 59)),
            'mid': /[0-9A-Z]{1,8}(\-[0-9A-Z]{2,6}){0,2}/,
            'validcode': (arg = 4) => new RandExp(new RegExp('[A-Z0-9]{' + arg + '}')).gen(),
            'account': /[a-zA-Z]{1,3}[a-zA-Z0-9]{3,6}/,
            'password': /[a-zA-Z0-9][a-zA-Z0-9\W_]{7}/,
            'color': /#[A-F0-9]{6}/,
            'url': /http(s?):\/\/www\.[a-z]{3,8}\.(com|cn|net|org|com\.cn)(\/[a-z]{3,5})?/,
            'mail': /([a-z0-9]{3,6}[-_]?[a-z0-9]{3,6})@[a-z]{3,8}\.(com|cn|net|org)/,
            'mobile': /(13\d|(14[5-7])|(15([0-3]|[5-9]))|17(0|1|8])|18\d)\d{8}/,
            'ip': /((192\.168)|(172\.0)|(10\.0))\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])/,
            'port': /[1-9]\d{3}/,
            'bizcode': /91[1-4]\d{5}[0-9A-HJ-NPQRTUWXY]{10}/,
            'bankcard': /62(([0-3]\d)(4[0-5])|5([0-3]|5|8|9)|70|8[2-3])\d{12,15}/,
            'qq': /[1-9]\d{4,10}/,
            'enName': <RuleFunc>(() => util.getItem(names.eMaleName.concat(names.eFemaleName)) + ' ' + util.getItem(names.eSurname)),
            'enMaleName': <RuleFunc>(() => util.getItem(names.eMaleName) + ' ' + util.getItem(names.eSurname)),
            'enFemaleName': <RuleFunc>(() => util.getItem(names.eFemaleName) + ' ' + util.getItem(names.eSurname)),
            'cnName': <RuleFunc>(() => util.getItem(names.cSurname) + util.getItem(names.cMaleName.concat(names.cFemaleName))),
            'cnMaleName': <RuleFunc>(() => util.getItem(names.cSurname) + util.getItem(names.cMaleName)),
            'cnFemaleName': <RuleFunc>(() => util.getItem(names.cSurname) + util.getItem(names.cFemaleName)),
            'enState': <RuleFunc>(() => util.getItem(names.eStates)),
            'cnState': <RuleFunc>(() => util.getItem(names.cStates)),
            'sex': <RuleFunc>(() => util.getItem(feature.sex)),
            'nation': <RuleFunc>(() => util.getItem(feature.nation)),
            'affiliate': <RuleFunc>(() => util.getItem(feature.affiliate)),
            'edu': <RuleFunc>(() => util.getItem(feature.edu)),
            'mary': <RuleFunc>(() => util.getItem(feature.mary)),
            'health': <RuleFunc>(() => util.getItem(feature.health)),
            'english': <RuleFunc>((arg: string, num: number = 1): string => {
                const d = arg ? arg : 'abcdefghijklmnopqrstuvwxyz';

                return util.getItems(d.split(''), num).join('');
            }),
            'chinese': <RuleFunc>((arg: string, num: number = 1): string => {
                const d = arg ? arg : String.fromCharCode(util.getInt(19968, 40869));

                return util.getItems(d.split(''), num).join('');
            }),
            'text': <RuleFunc>((arg: string = '填充文本样式', n1?: number, n2?: number): string => {
                let d = 40;

                if (typeof n1 === 'number' && typeof n2 === 'number') d = util.getInt(n1, n2);
                else if (typeof n1 === 'number') d = n1;
                return Array(d + 1).join(arg);
            }),
            'price': <RuleFunc>((arg1: number = 0, arg2: number = 10000, arg3: boolean = true): string => {
                let n, d = util.getNumber(arg1, arg2, 2);
                const r1 = /\d{1,3}(?=(\d{3})+$)/g, r2 = /^(-?)(\d+)((\.\d+)?)$/;

                if (arg3) n = (d + '').replace(r2, ((s, s1, s2, s3) => s1 + s2.replace(r1, '$&,') + s3));
                else n = d + '';
                return n;
            }),
            'citycode': <RuleFunc>(() => this.division.county),
            'province': <RuleFunc>(() => regions[this.getRndDivision().province][0]),
            'prefecture': <RuleFunc>(() => regions[this.getRndDivision().prefecture][0]),
            'county': <RuleFunc>(() => regions[this.getRndDivision().county][0]),
            'telphone': <RuleFunc>(() => {
                let cd = regions[this.division.county][1] as string, ps;

                if (this.is8bit.indexOf(cd) > -1) ps = cd + '-' + new RandExp(/[268]\d{7}/).gen();
                else  ps = cd + '-' + new RandExp(/[268]\d{6}/).gen();
                return ps;
            }),
            'zipcode': <RuleFunc>(() => regions[this.division.county][2]),
            'bodycard': <RuleFunc>(() => {
                const sn = this.division.county + util.formatDate(rd(), 'yyyyMMdd') + new RandExp(/\d{3}/).gen(),
                    arr = sn.split(''),
                    factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2],
                    parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
                let sum = 0, ai = 0, wi = 0;

                for (let i = 0; i < 17; i++) {
                    ai = + arr[i];
                    wi = factor[i];
                    sum += ai * wi;
                }
                return sn + parity[sum % 11];
            }),
            'autocard': <RuleFunc>(() => {
                let card = regions[this.division.prefecture][5] as string,
                    pf = card.length === 1 ? card + util.getItem(['A', 'B', 'C']) : card;
                return pf + new RandExp(/\d{3}[A-HJ-NP-UW-Z]{2}|[A-HJ-NP-UW-Z]\d{4}/).gen();
            }),
            'address': <RuleFunc>(() => {
                return (regions[this.division.county][0] as string).replace('县', '县城')
                    + util.getItem(names.road) + new RandExp(/(路|街)(1\d{3}|[1-9]\d{2})号/).gen()
                    + util.getItems(names.commonWord, 2).join('')
                    + util.getItem(names.buildNature)
                    + new RandExp(/[A-F]栋((一|二|三)单元)?[1-9]0[1-5]室/).gen();
            }),
            'company': <RuleFunc>(() => {
                return (regions[this.division.prefecture][0] as string)
                    + util.getItems(names.commonWord, 2).join('')
                    + util.getItem(names.companyNature) + '有限公司';
            }),
            'lon': <RuleFunc>(() => (regions[this.division.county][3] as string) + new RandExp(/\d{8}/).gen()),
            'lat': <RuleFunc>(() => (regions[this.division.county][4] as string) + new RandExp(/\d{8}/).gen())
        });

    }
}