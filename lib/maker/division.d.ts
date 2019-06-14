export interface RegionInterface {
    province: string;
    prefecture: string;
    county: string;
}
interface RegionData {
    [key: string]: (string | number | null)[];
}
export default class Division {
    private divisionCode;
    private regions;
    private nocode;
    private level;
    private prefectures;
    private countys;
    code: RegionInterface;
    constructor(code: string | number, datas: RegionData);
    private getCode;
    private getPfCode;
    private getCtCode;
    private findRegion;
    private rndCode;
    getData(index?: number): RegionInterface;
}
export {};
