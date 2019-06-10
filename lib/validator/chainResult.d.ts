import { Chain, ChainBase } from "./chain";
import { RulesMap } from "./rules";
export declare type ruleNames = keyof RulesMap;
export interface IChain extends ChainBase {
    readonly result: boolean;
    trigger(type: string): this;
    readonly rule: any[];
}
export default class ChainResult extends Chain implements IChain {
    private faults;
    private eventType;
    private __chk;
    private format;
    private __chkItem;
    readonly result: boolean;
    trigger(type: string): this;
    readonly rule: any[];
}
