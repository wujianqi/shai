declare namespace RandExp {}
export = RandExp;

declare class RandExp {
    static sugar(): void;
    constructor(pattern: string | RegExp, flags?: string);
    new(pattern: string | RegExp, flags?: string): RandExp;
 
    randInt: (from: number, to: number) => number;
    gen(): string;
}
