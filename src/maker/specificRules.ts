import { util } from './util';
import Division from './division';
import { rules, RuleFunction, RulesMap, RulesInterface } from './rules';
import regions from './regions.json';

type rulesName = keyof RulesMap | keyof SpecificRulesMap;

export { RuleFunction, rulesName };

export interface SettingOption {
    'divisionCode'?: string;
    'beginTime'?: Date;
    'endTime'?: Date;
}

export interface SpecificRulesMap {
    [key: string]: RegExp | RuleFunction;
    increment(arg1?: boolean, arg2?: number): number;
    datetime(arg?: string): string;
    date(): string;
    time(): string;
    year(): string;
    citycode(): string;
    province(): string;
    prefecture(): string;
    county(): string;
    phone(): string;
    zipcode(): string;
    bodycard(): string;
    autocard(): string;
    address(): string;
    company(): string;
    lon(): string;
    lat(): string;
    custom(key:string|RuleFunction, ...args:Array<any>): string | number | boolean;
}

/**
 * @class 特定范围设置的方法集合
 */
export default class SpecificRules {
    private config = {
        'divisionCode': rules.regexp(/1[1-5]|2[1-3]|3[3-7]|4[1-6]|5[1-4]|6[1-5]/) + '0000',
        'beginTime': new Date('1970/01/01'),
        'endTime': new Date()
    };
    private baseinc: number = 0;
    private is8b: string[] = [ // 电话号码 8位
        '010', '021', '022', '023', '024', '025', '027', '028', '029', '020', '0311', '0371', '0377',
        '0379', '0411', '0451', '0512', '0513', '0516', '0510', '0531', '0532', '0571', '0574', '0577',
        '0591', '0595', '0755', '0757', '0769', '0898', '0431'
    ];
    private getRndTime = () => {
        let bt = this.config.beginTime ? this.config.beginTime : new Date('1970/01/01'),
            et = this.config.endTime ? this.config.endTime : new Date();
        return new Date(util.getInt(bt.getTime(), et.getTime()));
    };    
    private division: Division;
    protected __methods: { [key:string]:  RuleFunction } = {};
    protected __rules: RulesInterface & SpecificRulesMap;

    /**
     * 添加函数引用，在custom规则中作为参数调用
     * @param makeFunc
     */
    add(key:string, makeFunc:RuleFunction): void {
        this.__methods[key] =  makeFunc;
    }
    
    /**
     * 重置自增长基数
     */
    set increment(num: number) {
        this.baseinc = num;
    }

    private maps: SpecificRulesMap = {
        increment: (arg1: boolean = true, arg2: number = 1): number => arg1 ? this.baseinc += arg2 : this.baseinc,
        datetime: (arg?: string) => util.formatDate(this.getRndTime(), (arg ? arg : 'yyyy-MM-dd hh:mm:ss')),
        date: () => util.formatDate(this.getRndTime(), 'yyyy-MM-dd'),
        time: () => util.formatDate(this.getRndTime(), 'hh:mm:ss'),
        year: () => util.formatDate(this.getRndTime(), 'yyyy'),
        citycode: () => this.division.division.county,
        province: () => this.division.region().province,
        prefecture: () => this.division.region().prefecture,
        county: () => this.division.region().county,
        phone: () => {
            let cd = this.division.region(1).county, ps;

            if (this.is8b.indexOf(cd) > -1) ps = cd + '-' + rules.regexp(/[268]\d{7}/);
            else ps = cd + '-' + rules.regexp(/[268]\\d{6}/);
            return ps;
        },
        zipcode: () => this.division.region(2).county,
        bodycard: () => {
            const sn = this.division.division.county + util.formatDate(this.getRndTime(), 'yyyyMMdd') + rules.regexp(/\d{3}/),
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
        },
        autocard: () => {
            let card = this.division.region(5).prefecture,
                ps: any = { '京': '[ACE-J]', '沪': '[A-E]', '津': '[A-DFG]' },
                pf = card.length === 1 ? rules.regexp(ps.hasOwnProperty(card) ? ps[card] : '[A-C]') : card;

            return pf + rules.regexp(/\d{3}[A-HJ-NP-UW-Z]{2}|[A-HJ-NP-UW-Z]\d{4}/);
        },
        address: () => this.division.region().county.replace('县', '县城') + rules.address(),
        company: () => this.division.region().prefecture + rules.company(),
        lon: () => this.division.region(3).county + rules.regexp(/\d{8}/),
        lat: () => this.division.region(4).county + rules.regexp(/\d{8}/),
        custom: (key:string|RuleFunction, ...args:Array<any>) => {
            if (typeof key === 'string' && this.__methods[key]) return this.__methods[key](...args);
            else if (typeof key === "function") return key(...args);
        }
    }

    constructor(option?: SettingOption) {
        (<any>Object).assign(this.config, option);
        
        this.division = new Division(this.config.divisionCode, regions);
        this.__rules = (<any>Object).assign(Object.create(null), rules, this.maps);
    }

}
