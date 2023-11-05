declare function getInt(a?: number, b?: number): number;
declare function bool(): boolean;
declare function getNumber(a?: number, b?: number, c?: number): number;
declare function pick<T>(arr: T[]): T;
declare function pick<T>(arr: T[], num: number): T[];
declare function getStr(num?: number, strs?: string): string;
declare function shuffle(ct: string): string;
declare function shuffle<T>(ct: T[]): T[];
declare const _default: {
    int: typeof getInt;
    number: typeof getNumber;
    pick: typeof pick;
    str: typeof getStr;
    shuffle: typeof shuffle;
    bool: typeof bool;
    once: (ct: string | number) => string;
    letter: (num?: number, isUpper?: boolean, isBlend?: boolean) => string;
    numstr: (num?: number) => string;
    alphanum: (num?: number, hasUpper?: boolean) => string;
    plus: (num: number, str: string) => string;
    hex: (num?: number) => string;
};

export { _default as default };
