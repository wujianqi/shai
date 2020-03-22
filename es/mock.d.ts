import rand from './random';
import { Increment } from './util';
export { rand };
export declare const util: {
    incre: (a?: number | undefined, b?: number | undefined) => Increment;
    range: (min: number, max: number, step?: number) => any[];
    uuid: (arg?: string) => string;
};
export declare const text: {
    repeat: (n?: number, arg?: string) => string;
    chinese: (num?: number | undefined) => string;
};
export declare const date: {
    time(bt?: string | number | Date | undefined, et?: string | number | Date | undefined, fmt?: string | undefined): string | Date;
    now: (fmt?: string | undefined) => string | Date;
    year: () => number;
    month: () => number;
    day: () => number;
    hour: () => number;
    minute: () => number;
};
export declare const cn: {
    firstName: () => string;
    maleName: () => string;
    femaleName: () => string;
    fullName: () => string;
    mobile: () => string;
    idcard: () => string;
    autocard: () => string;
    company: () => string;
    country: () => string;
    road: () => string;
    build: () => string;
    phone: () => string;
    zipcode: () => string;
    province: () => string;
};
export declare const en: {
    firstName: () => string;
    maleName: () => string;
    femaleName: () => string;
    fullName: () => string;
    country: () => string;
};
export declare const web: {
    account: () => string;
    password: () => string;
    qq: () => string;
    domain: () => string;
    url: () => string;
    email: () => string;
    ip: (local?: boolean) => string;
    color: () => string;
};
//# sourceMappingURL=mock.d.ts.map