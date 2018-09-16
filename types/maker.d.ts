import Base, { BaseInterface } from './base';
export interface MakerInterface extends BaseInterface {
    increment: number;
    get(methodName: string, ...args: any[]): string | number | boolean;
    make(content: string, n1?: number, n2?: number): string;
}
export default class Maker extends Base implements MakerInterface {
    protected baseIncrement: number;
    get(methodName: string, ...args: any[]): string | number | boolean;
    private parseTPL(content);
    make(content: string, n1?: number, n2?: number): string;
    increment: number;
    constructor();
}
