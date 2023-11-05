export { default as rand } from './random.mjs';

declare class Increment {
    private __base;
    private __step;
    constructor(step?: number, base?: number);
    val: () => number;
}

declare const util: {
    incre: (a?: number, b?: number) => Increment;
    range: (min: number, max: number, step?: number) => number[];
    uuid: (arg?: string) => string;
};
declare const text: {
    repeat: (n?: number, arg?: string) => string;
    chinese: (num?: number) => string;
};
declare const date: {
    time(begin?: string | number | Date, end?: string | number | Date, fmt?: string): string;
    now: (fmt?: string) => string;
    year: (begin?: number) => number;
    month: () => number;
    day: () => number;
    hour: () => number;
    minute: () => number;
};
declare const cn: {
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
declare const en: {
    firstName: () => string;
    maleName: () => string;
    femaleName: () => string;
    fullName: () => string;
    country: () => string;
};
declare const web: {
    account: () => string;
    password: () => string;
    qq: () => number;
    domain: () => string;
    url: (prefix?: string) => string;
    email: () => string;
    ip: (local?: boolean) => string;
    color: () => string;
};

export { cn, date, en, text, util, web };
