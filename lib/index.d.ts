import { MakerSetting, MakeFunction, MethodNames } from './maker';
import { ChainConstructor, ValidFunction, ValidSetting, Struct } from './validator';
export { ValidSetting, ValidFunction, ChainConstructor, Struct, MakerSetting, MakeFunction, MethodNames, };
declare const _default: {
    validator: {
        setting: ValidSetting;
        add(key: string, func: ValidFunction, msg?: string): void;
        readonly string: ChainConstructor;
        readonly number: ChainConstructor;
        readonly object: ChainConstructor;
        readonly array: ChainConstructor;
        readonly boolean: ChainConstructor;
        readonly null: ChainConstructor;
        check: {
            (value: any): ChainConstructor;
            (value: object, path: string | number | (string | number)[]): ChainConstructor;
        };
        group: typeof import("./validator/chainUtil").group;
    };
    maker: {
        setting: MakerSetting;
        add(key: string, makeFunc: MakeFunction): void;
        get: {
            (methodName: "number" | "md5" | "uuid" | "now" | "regexp" | "enum" | "range" | "int" | "bool" | "month" | "day" | "hour" | "minute" | "mid" | "account" | "password" | "color" | "url" | "mail" | "mobile" | "port" | "bizcode" | "bankcard" | "qq" | "alphanum" | "rgb" | "hsl" | "english" | "upper" | "lower" | "chinese" | "ip" | "text" | "price" | "esurname" | "enName" | "enMaleName" | "enFemaleName" | "surname" | "cnName" | "cnMaleName" | "cnFemaleName" | "enState" | "cnState" | "company" | "road" | "build" | "job" | "file" | "fieldType" | "increment" | "datetime" | "date" | "time" | "year" | "citycode" | "province" | "prefecture" | "county" | "phone" | "zipcode" | "bodycard" | "autocard" | "address" | "lon" | "lat" | "custom", ...args: any[]): string | number | boolean;
            (methodName: "custom", arg2: MakeFunction): string | number | boolean;
            (methodName: "custom", arg2: string, ...args: any[]): string | number | boolean;
        };
        toJSON(content: string | object, parseValueType?: string | boolean, optionKey?: string): string;
        make(content: string | object, parseValueType?: string | boolean, optionKey?: string): object;
    };
};
export default _default;
