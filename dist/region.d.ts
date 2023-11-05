declare class export_default{
    private division;
    private __prefecture;
    private __county;
    private useInit;
    constructor(code?: string | number);
    citycode: () => string;
    province: () => string;
    prefecture: (isUpdate?: boolean) => string;
    county: (isUpdate?: boolean) => string;
    phone: () => string;
    zipcode: () => string;
    idcard: () => string;
    autocard: () => string;
    longitude: () => string;
    latitude: () => string;
}

export { export_default as default };
