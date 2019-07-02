import Chain, { ChainBase } from './chain';
import { MessageInfo } from './message';
export { ChainBase };
export default class ChainNode extends Chain {
    protected faults: MessageInfo;
    protected format(info: string): string;
    private padding;
    private chk;
    protected bindCustom(args: any[], passed: boolean): void;
    protected validNode(node: string | (string | any[])[]): boolean | Promise<boolean>;
}
