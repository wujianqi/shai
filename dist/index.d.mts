interface MethodFunc<T extends unknown[]> {
    (...args: T): string | number | boolean | null;
}
type PlainObject = {
    [key: string]: any;
};
type JsonArrayOrObject = PlainObject[] | PlainObject;
interface SettingOption {
    key?: string;
    length?: number | [number, number];
    level?: number | [number, number];
}
declare class export_default{
    private __funcs;
    private __data;
    private __propKey;
    private __SB;
    private setVal;
    private addChild;
    private mapping;
    private parseBlock;
    private setValues;
    use<T extends unknown[]>(fnc: MethodFunc<T>, ...args: T): [symbol, number];
    gen(data: JsonArrayOrObject, propKey?: string): PlainObject[] | undefined;
    constructor();
}

export { type SettingOption, export_default as default };
