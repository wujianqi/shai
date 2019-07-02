import { rulesName } from './specificRules';
export declare function findBlock(content: string, propKey: string): string;
export declare function parseTPL(content: string, method: (key: rulesName, ...args: any[]) => string | number | boolean, update: Function): string;
