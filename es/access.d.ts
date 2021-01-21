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
    api?: {
        statusField: string;
        messageField: string;
        resultsField: string;
        successCode: number;
        failureCode: number;
    };
    page?: {
        sizeField: string;
        currentField: string;
        countField: string;
        totalField: string;
        resultsField: string;
    };
}
export declare function haskey(obj: PlainObject, k: string): boolean;
export default class {
    private __datas;
    private __opt;
    private success;
    private failure;
    private __filter;
    private __noparam;
    set data(dt: PlainObject);
    get data(): PlainObject;
    set config(cfg: AccessConfig);
    create(params: PlainObject, successMsg?: string, failMsg?: string): object;
    update(params: PlainObject, successMsg?: string, failMsg?: string): object;
    read(query: PlainObject, successMsg?: string, failMsg?: string, mergeObj?: object): object;
    delete(query: PlainObject, successMsg?: string, failMsg?: string): object;
    exist(query: PlainObject, successMsg?: string, failMsg?: string, mergeObj?: object): object;
    list(query?: PlainObject, successMsg?: string): PlainObject;
    pageList(query: PlainObject, successMsg?: string): object;
    async(method: 'create', params: PlainObject, successMsg?: string, failMsg?: string, timeout?: number): Promise<PlainObject>;
    async(method: 'update', params: PlainObject, successMsg?: string, failMsg?: string, timeout?: number): Promise<PlainObject>;
    async(method: 'read', query: PlainObject, successMsg?: string, failMsg?: string, mergeObj?: object, timeout?: number): Promise<PlainObject>;
    async(method: 'delete', query: PlainObject, successMsg?: string, failMsg?: string, timeout?: number): Promise<PlainObject>;
    async(method: 'exist', query: PlainObject, successMsg?: string, failMsg?: string, mergeObj?: object, timeout?: number): Promise<PlainObject>;
    async(method: 'list', query?: PlainObject, successMsg?: string, timeout?: number): Promise<PlainObject>;
    async(method: 'pageList', query: PlainObject, successMsg?: string, timeout?: number): Promise<PlainObject>;
    constructor();
}
export {};
//# sourceMappingURL=access.d.ts.map