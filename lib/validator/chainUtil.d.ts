import { MessageInfo } from './message';
declare type pathType = (string | number)[];
export declare const parentPath: {
    path: pathType;
};
export declare function msgPrint(path: pathType): (faults: MessageInfo) => void;
export declare function findChain(chainConstructor: Function, types: any, path: pathType, cb: Function): void;
export declare function group(chains: any[]): boolean | Promise<boolean>;
export {};
