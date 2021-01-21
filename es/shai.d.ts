import Access, { AccessConfig, UniqueType } from './access';
export declare type TUnique = typeof UniqueType;
export { AccessConfig };
interface MethodFunc {
    (...args: any[]): any;
}
declare const KEY: symbol | string;
interface Labels {
    0: typeof KEY;
    1: number;
}
export interface PlainObject {
    [key: string]: any;
    [key: number]: any;
}
export interface SettingOption {
    key?: string;
    length?: number | [number, number];
    level?: number | [number, number];
}
export default class {
    private __funcs;
    private __data;
    private __propKey;
    private __access;
    private setv;
    private addChild;
    private getList;
    private parseBlock;
    private setValues;
    use(fnc: MethodFunc, ...args: any[]): Labels;
    gen(data: object, propKey?: string): PlainObject | undefined;
    get access(): Access;
    constructor();
}
//# sourceMappingURL=shai.d.ts.map