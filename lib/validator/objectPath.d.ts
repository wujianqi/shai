declare type objType = {
    [key: string]: any;
    [key: number]: any;
};
export declare function objectPath(obj: objType, path: Array<number | string> | number | string): any;
export {};
