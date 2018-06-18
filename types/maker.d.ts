import Base from './base';
export interface MakerInterface {
    get(methodName: string, ...args: (string | number | boolean)[]): string | number | boolean;
    make(content: string, n1?: number, n2?: number): string;
    increment: number;
}
export default class Maker extends Base implements MakerInterface {
    protected baseIncrement: number;
    get(methodName: string, ...args: (string | number | boolean)[]): string | number | boolean;
    private parseTPL;
    make(content: string, n1?: number, n2?: number): string;
    increment: number;
    constructor();
}
