declare namespace RandExp {}
export = RandExp;

declare class RandExp {
    static sugar(): void;
    constructor(pattern: string | RegExp, flags?: string);
 
    randInt: (from: number, to: number) => number;
    gen(): string;
}
