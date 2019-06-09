import { Chain, ChainBase } from "./chain";
export interface IChain extends ChainBase {
    readonly result: boolean;
    get(trigger?: string): any[];
}
export default class ChainResult extends Chain implements IChain {
    private faults;
    private __chk;
    private format;
    readonly result: boolean;
    get(trigger?: string): any[];
}
