import Division from './division';
import regions from './regions.json';
import { MakeFunction, rules } from './rules';
import { util } from './util';

type RulesMap = typeof rules;
export { MakeFunction };

export interface MakerSetting {
    divisionCode?: string | number;
    beginTime?: Date;
    endTime?: Date;
    incrementBase?: number;
}

export const config = {
    divisionCode: '',
    beginTime: new Date('1970/01/01'),
    endTime: new Date(),
    incrementBase: 0,
};

export const customRule: { [key: string]: MakeFunction } = {};

/**
 * @class 特定范围设置的方法集合
 */
class SpecificRules {
    private get getRndTime() {
        const bt = config.beginTime
                ? config.beginTime
                : new Date('1970/01/01'),
            et = config.endTime ? config.endTime : new Date();
        return new Date(util.getInt(bt.getTime(), et.getTime()));
    }

    get rules() {
        if (!this.__rules) { this.reload(); }
        return this.__rules;
    }
    private history: string[] = new Array(2); // 缓存部分数据引用记录一次
    private __rules: RulesMap & typeof SpecificRules.prototype.maps;
    private division: Division;

    private maps = {
        increment: (arg1: boolean = true, arg2: number = 1): number =>
            arg1 ? (config.incrementBase += arg2) : config.incrementBase,
        datetime: (arg?: string) =>
            util.formatDate(this.getRndTime, arg ? arg : 'yyyy-MM-dd hh:mm:ss'),
        date: () => util.formatDate(this.getRndTime, 'yyyy-MM-dd'),
        time: () => util.formatDate(this.getRndTime, 'hh:mm:ss'),
        year: () => util.formatDate(this.getRndTime, 'yyyy'),
        citycode: () => this.division.code.county,
        province: () => this.division.getData().province,
        prefecture: () => this.division.getData().prefecture,
        county: () => this.division.getData().county,
        phone: () => {
            // 电话号码 8位
            const is8b = [
                '010', '021', '022', '023', '024', '025', '027',
                '028', '029', '020', '0311', '0371', '0377', '0379',
                '0411', '0431', '0451', '0512', '0513', '0516',
                '0510', '0531', '0532', '0571', '0574', '0577',
                '0591', '0595', '0755', '0757', '0769', '0898',
            ];
            const cd = this.division.getData(1).county;
            let ps;

            if (is8b.indexOf(cd) > -1) { ps = cd + '-' + rules.regexp(/[268]\d{7}/); }
            else { ps = cd + '-' + rules.regexp(/[268]\d{6}/); }
            return ps;
        },
        zipcode: () => this.division.getData(2).county,
        bodycard: () => {
            const sn =
            this.division.code.county +
            util.formatDate(this.getRndTime, 'yyyyMMdd') + rules.regexp(/\d{3}/),
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
        },
        autocard: () => {
            const card = this.division.getData(5).prefecture,
                ps: any = { 京: '[ACE-J]', 沪: '[A-E]', 津: '[A-DFG]' },
                pf = card.length === 1
                    ? rules.regexp(ps.hasOwnProperty(card) ? ps[card] : '[A-C]')
                    : card;

            return pf + rules.regexp(/\d{3}[A-HJ-NP-UW-Z]{2}|[A-HJ-NP-UW-Z]\d{4}/);
        },
        road: (): string => {
            if (this.history[0]) { return this.history[0] as string; }
            else { return (this.history[0] = rules.road()); }
        // return rules.road();
        },
        build: () => {
            if (this.history[1]) { return this.history[1] as string; }
            else { return (this.history[1] = rules.build()); }
        // return rules.build();
        },
        address: () =>
            this.division.getData().county.replace('县', '县城') +
            this.maps.road() +
            this.maps.build() +
            rules.regexp(/[A-F](栋((一|二|三|四|五)单元)|座)?[1-8]0[1-6]室/),
        company: () => this.division.getData().prefecture + rules.company(),
        lon: () => this.division.getData(3).county + rules.regexp(/\d{8}/),
        lat: () => this.division.getData(4).county + rules.regexp(/\d{8}/),
        custom: (key: string | MakeFunction, ...args: any[]) => {
            if (typeof key === 'string' && customRule[key]) {
                return customRule[key](...args);
            }
            else if (typeof key === 'function') { return key(...args); }
        },
    };

    public reload() {
        this.division = new Division(config.divisionCode, regions);
        this.__rules = (Object as any).assign(Object.create(null), rules, this.maps);
    }
}

export type rulesName = keyof RulesMap | keyof typeof SpecificRules.prototype.rules;
export default SpecificRules;
