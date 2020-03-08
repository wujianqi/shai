export interface RegionInfo {
    code: string;
    name: string;
    phone: string;
    zipcode: string;
    longitude: string;
    latitude: string;
    short: string;
}
export default class {
    code: string;
    private __province;
    private level;
    private prefectures;
    private countys;
    private history;
    constructor(code: string | number);
    private get;
    get province(): RegionInfo;
    get prefecture(): RegionInfo;
    get county(): RegionInfo;
}
//# sourceMappingURL=division.d.ts.map