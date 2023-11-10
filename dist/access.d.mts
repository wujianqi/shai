declare enum UniqueType {
    'increment' = 0,
    'uuid' = 1
}
type PlainObject = {
    [key: string]: unknown;
};
interface AccessConfig {
    uniqueKey?: string;
    uniqueType?: UniqueType;
}
interface PageQueryKeys {
    size?: string;
    index?: string;
}
interface PageReturnKeys extends PageQueryKeys {
    total?: string;
    count?: string;
    list?: string;
}
declare class export_default{
    private __datas;
    private __opt;
    private __filter;
    set data(dt: PlainObject[] | undefined);
    get data(): PlainObject[] | undefined;
    set config(cfg: AccessConfig);
    create(params: PlainObject[] | PlainObject): PlainObject | PlainObject[] | undefined;
    read(query: PlainObject, mergeObj?: PlainObject): PlainObject | PlainObject[] | undefined;
    update(params: PlainObject): PlainObject | PlainObject[] | undefined;
    delete(query: string | number | (string | number)[] | PlainObject): (string | number | PlainObject)[] | undefined;
    list(query?: PlainObject): PlainObject | PlainObject[] | undefined;
    pageList(query: PlainObject, queryKeys?: PageQueryKeys, returnKeys?: PageReturnKeys): {
        [key: string]: unknown;
    } | undefined;
    constructor(dts?: PlainObject[]);
}

export { type AccessConfig, type PageQueryKeys, type PageReturnKeys, UniqueType, export_default as default };
