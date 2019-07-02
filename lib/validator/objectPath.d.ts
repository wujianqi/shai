interface DataType {
    [key: string]: any;
    [key: number]: any;
}
export declare function objectPath(obj: DataType, path: (number | string)[] | number | string): any;
export {};
