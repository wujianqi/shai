export interface RegionInterface {
    'province': string;
    'prefecture': string;
    'county': string;
}
interface RegionData {
    [key: string]: (string | number | null)[];
}
export default class Division {
    private divisionCode;
    private regions;
    private level;
    private prefectures;
    private countys;
    private prefectureHistoryMap;
    private countyHistoryMap;
    division: RegionInterface;
    constructor(code: string, datas: RegionData);
    private extract;
    private getRnddivision;
    region(index?: number): RegionInterface;
}
export {};
