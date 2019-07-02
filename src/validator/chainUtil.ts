import { MessageInfo } from './message';

type pathType = (string | number)[];
export const parentPath: {
    path: pathType;
} = {
    path: []
};

/**
 * 获取对象验证的失败警告信息
 * @param path 
 * @param hasParent
 */
export function msgPrint (path: pathType) {
    let p = path;

    if (parentPath.path.length > 0) { // 是否在父级调用
        p = parentPath.path.concat(path);
    }
    return (faults: MessageInfo) => {
        if(Object.keys(faults).length > 0) console.warn('未通过验证的位置：',  p.join(' > '))
    };
}

/**
 * 递归找验证链
 */
export function findChain(chainConstructor: Function, types: any, path: pathType, cb: Function): void {
    if (Array.isArray(types) && types.length > 0) {
        types.forEach((t, i) => {
            const p = path.concat();

            p.push(i);
            if (t instanceof chainConstructor) { cb(p, t); }
            else if (typeof t === 'object') { findChain(chainConstructor, t, p, cb); }
        });
    } else {
        for (const key in types) {
            if (types.hasOwnProperty(key)) {
                const type = types[key];
                const p = path.concat();

                p.push(key);
                if (type instanceof chainConstructor) { cb(p, type); }
                else if (typeof type === 'object') { findChain(chainConstructor, type, p, cb); }
            }
        }
    }
}
/**
 * 
 * @param chains 组合验证
 */
export function group (chains: any[]): boolean | Promise<boolean> {
    const results: boolean[] = [];
    const asyncFns: Promise<boolean>[] = [];

    chains.forEach((o) => { 
        const res = o.result;

        if (typeof res === 'boolean') results.push(res);
        if (o.isAsync) { asyncFns.push(o.asyncResult); }
    });

    if (asyncFns.length > 0) {
        return new Promise(resolve => {
            Promise.all(asyncFns).then((res) => {
                resolve(res.concat(results).indexOf(false) === -1);
            });
        });
    } else { return results.indexOf(false) === -1; }
}