export default class {
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
//# sourceMappingURL=region.d.ts.map