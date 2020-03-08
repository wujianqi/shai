interface MethodFunc {
    (...args: any[]): any;
}
declare const KEY = "~~~";
interface Labels {
    0: typeof KEY;
    1: number;
}
interface TypeValue {
    [key: string]: any;
    [key: number]: any;
}
export interface SettingOption {
    length?: number | [number, number];
    child?: string;
    level?: number | [number, number];
}
export default class {
    private __funcs;
    private __data;
    private __propKey;
    private setv;
    private nested;
    private settingToArr;
    private bulk;
    private setValues;
    use(fnc: MethodFunc, ...args: any[]): Labels;
    gen(data: object, propKey?: string): TypeValue | undefined;
    constructor();
}
export {};
//# sourceMappingURL=shai.d.ts.map