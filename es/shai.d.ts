interface MethodFunc {
    (...args: any[]): any;
}
declare const KEY = "\u2592";
interface Labels {
    0: typeof KEY;
    1: number;
}
interface TypeValue {
    [key: string]: any;
    [key: number]: any;
}
export interface SettingOption {
    key?: string;
    length?: number | [number, number];
    level?: number | [number, number];
    renew?: object;
    remove?: (string | number)[];
    at?: number;
}
export default class {
    private __funcs;
    private __data;
    private __propKey;
    private setv;
    private addChild;
    private transform;
    private parseBlock;
    private setValues;
    use(fnc: MethodFunc, ...args: any[]): Labels;
    gen(data: object, propKey?: string): TypeValue | undefined;
    constructor();
}
export {};
//# sourceMappingURL=shai.d.ts.map