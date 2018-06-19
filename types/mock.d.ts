import Maker, { MakerInterface } from './maker';
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
    readonly region: (string | number)[];
}
export default class Mock extends Maker implements MockInterface {
    private config;
    private is8bit;
    private level;
    private prefectures;
    private countys;
    private prefectureHistoryMap;
    private countyHistoryMap;
    private division;
    private extract;
    private getNewDivision;
    readonly region: (string | number)[];
    constructor(option?: MockConfig);
}
