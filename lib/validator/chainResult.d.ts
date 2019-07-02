import Chain, { ChainBase } from './chainNode';
import { AsyncValidatorRule } from './asyncValidatorRule';
export interface ChainConstructor extends ChainBase {
    readonly result: boolean;
    readonly asyncResult: Promise<boolean>;
    readonly isAsync: boolean;
    readonly rule: any[];
    trigger(type: string): this;
}
export default class ChainResult extends Chain implements ChainConstructor {
    readonly result: boolean;
    readonly asyncResult: Promise<boolean>;
    readonly rule: AsyncValidatorRule[];
    readonly isAsync: boolean;
    private asyncFns;
    private asyncParams;
    private sync;
    private eventType;
    trigger(type: string): this;
    private together;
    private eachValid;
}
