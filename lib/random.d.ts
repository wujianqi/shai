declare function getInt(a?: number, b?: number): number;
declare function bool(): boolean;
declare function getNumber(a?: number, b?: number, c?: number): number;
declare function pick<T>(arr: T[]): T;
declare function pick<T>(arr: T[], num: number): T[];
declare function getStr(num?: number, strs?: string): string;
declare const _default: {
    int: typeof getInt;
    number: typeof getNumber;
    pick: typeof pick;
    str: typeof getStr;
    shuffle: (ct: string | any[]) => string | any[] | undefined;
    bool: typeof bool;
    once: (ct: string | number) => string;
    letter: (num?: number, isUpper?: boolean, isBlend?: boolean) => string;
    numstr: (num?: number) => string;
    alphanum: (num?: number, isUpper?: boolean) => string;
    plus: (num: number, str: string) => string;
    hex: (num?: number) => string;
};
export default _default;
//# sourceMappingURL=random.d.ts.map