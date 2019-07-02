export interface RegionInterface {
    province: string;
    prefecture: string;
    county: string;
}
interface RegionData {
    [key: string]: (string | number | null)[];
}
export default class Division {
    code: RegionInterface;
    private divisionCode;
    private regions;
    private nocode;
    private level;
    private prefectures;
    private countys;
    constructor(code: string | number, datas: RegionData);
    getData(index?: number): RegionInterface;
    private getCode;
    private getPfCode;
    private getCtCode;
    private findRegion;
    private rndCode;
}
export {};
