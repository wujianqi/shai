interface PlainObject {
    [key: string]: any;
    [key: number]: any;
}
export interface AccessConfig {
    uniqueKey?: string;
    httpStatus?: number;
    failureCode?: number;
    successCode?: number;
    codeField?: string;
    msgField?: string;
    dataField?: string;
}
export interface PageParam {
    pageSize: number;
    pageIndex: number;
    [key: string]: any;
}
export declare function extObj(target: any, source: PlainObject): any;
export default class {
    private __datas;
    private __opt;
    private __f;
    private __s;
    private __filter;
    private __async;
    set data(dt: PlainObject);
    get data(): PlainObject;
    set config(cfg: AccessConfig);
    create(params: PlainObject, successMsg?: string, failMsg?: string | string[]): {
        [x: string]: string | number | object;
    };
    asyncCreate(params: PlainObject, successMsg?: string, failMsg?: string | string[], timeout?: number): Promise<unknown>;
    update(params: PlainObject, successMsg?: string, failMsg?: string | string[]): PlainObject;
    asyncUpdate(params: PlainObject, successMsg?: string, failMsg?: string | string[], timeout?: number): Promise<unknown>;
    read(params: PlainObject, plus?: object, successMsg?: string, failMsg?: string | string[]): PlainObject;
    asyncRead(params: PlainObject, plus?: object, successMsg?: string, failMsg?: string | string[], timeout?: number): Promise<unknown>;
    delete(params: PlainObject, successMsg?: string, failMsg?: string | string[]): {
        [x: string]: string | number | object;
    };
    asyncDelete(params: PlainObject, successMsg?: string, failMsg?: string | string[], timeout?: number): Promise<unknown>;
    exist(params: PlainObject, plus?: object, successMsg?: string, failMsg?: string | string[]): PlainObject;
    asyncExist(params: PlainObject, plus?: object, successMsg?: string, failMsg?: string | string[], timeout?: number): Promise<unknown>;
    list(params?: PlainObject, successMsg?: string, failMsg?: string | string[]): PlainObject;
    asyncList(params?: PlainObject, successMsg?: string, failMsg?: string | string[], timeout?: number): Promise<unknown>;
    pageList(params: PageParam, successMsg?: string, failMsg?: string | string[]): {
        [x: string]: string | number | object;
    };
    asyncPageList(params: PageParam, successMsg?: string, failMsg?: string | string[], timeout?: number): Promise<unknown>;
    constructor();
}
export {};
//# sourceMappingURL=access.d.ts.map