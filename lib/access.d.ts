interface PlainObject {
    [key: string]: any;
    [key: number]: any;
}
export declare enum UniqueType {
    'increment' = 0,
    'uuid' = 1
}
export interface AccessConfig {
    uniqueKey?: string;
    uniqueType?: UniqueType;
    asyncResult?: (result: object) => PlainObject;
    success?: (vo: any, msg?: string) => object;
    failure?: (err: number, msg?: string) => object;
}
export interface PageParam {
    pageSize: number | string;
    pageIndex: number | string;
    [key: string]: any;
}
export declare function extObj(target: any, source: PlainObject): any;
export default class {
    private __datas;
    private __opt;
    private __filter;
    private __async;
    private __noparam;
    set data(dt: PlainObject);
    get data(): PlainObject;
    set config(cfg: AccessConfig);
    create(params: PlainObject, successMsg?: string, failMsg?: string): object;
    asyncCreate(params: PlainObject, successMsg?: string, failMsg?: string, timeout?: number): Promise<unknown>;
    update(params: PlainObject, successMsg?: string, failMsg?: string): object;
    asyncUpdate(params: PlainObject, successMsg?: string, failMsg?: string, timeout?: number): Promise<unknown>;
    read(query: PlainObject, successMsg?: string, failMsg?: string, plus?: object): object;
    asyncRead(query: PlainObject, successMsg?: string, failMsg?: string, plus?: object, timeout?: number): Promise<unknown>;
    delete(query: PlainObject, successMsg?: string, failMsg?: string): object;
    asyncDelete(query: PlainObject, successMsg?: string, failMsg?: string, timeout?: number): Promise<unknown>;
    exist(query: PlainObject, successMsg?: string, failMsg?: string, plus?: object): object;
    asyncExist(query: PlainObject, successMsg?: string, failMsg?: string, plus?: object, timeout?: number): Promise<unknown>;
    list(query?: PlainObject, successMsg?: string): object;
    asyncList(query?: PlainObject, successMsg?: string, timeout?: number): Promise<unknown>;
    pageList(page: PageParam, query?: PlainObject, successMsg?: string): object;
    asyncPageList(page: PageParam, query?: PlainObject, successMsg?: string, timeout?: number): Promise<unknown>;
    constructor();
}
export {};
//# sourceMappingURL=access.d.ts.map