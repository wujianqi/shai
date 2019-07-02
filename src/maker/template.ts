import { rulesName } from './specificRules';
import { util } from './util';

/**
 * 批量数据--模版生成
 * @param content
 * @param n1
 * @param n2
 */
function bulk(content: string, n1?: number, n2?: number): string {
    let num = 0;

    if (typeof n1 === 'number' && typeof n2 === 'number') {
        num = util.getInt(n1, n2);
    }
    else if (typeof n1 === 'number') { num = n1; }

    if (num > 0) {
        const list = [];
        let i;

        for (i = 0; i < num; i++) { list.push(content); }
        return '[' + list.join(',') + ']';
    } else { return content; }
}

/**
 * 递归嵌套数据--模版生成
 * @param content
 * @param level
 * @param keyName
 * @param num
 */
function nested(
    content: string,
    level: number,
    keyName: string,
    num?: number,
): string {
    let newstr = content;
    const makedata = (): void => {
        level--;
        if (level < 0) { return void 0; }
        newstr = newstr.replace(
            /(?<=@@).*(?=##)/,
            ($0): any => {
                return `${$0},${keyName}:${bulk(`@@${$0}##`, num)}`;
            },
        );
        makedata();
    };

    makedata();
    return newstr;
}

/**
 * 批量、嵌套数据模板，选项转换
 * @param content
 */
function convertOption(content: string, propKey: string): string {
    let objbody: string, n1: number, n2: number, itemsKey: string;
    const reg = new RegExp(`"${propKey}":\\[([^\\]]+)\\],?`);

    objbody = content.replace(
        reg,
        (n, m): any => {
            const args = m.split(',');

            n1 = +args[0];
            n2 = args.length > 1 ? +args[1] : void 0;
            itemsKey = args.length > 2 ? args[2] : void 0;
            return '';
        },
    );
    if (typeof itemsKey === 'string') { objbody = nested(objbody, n1, itemsKey, n2); }
    else { objbody = bulk(objbody, n1, n2); }

    return objbody;
}

/**
 * 含循环输出配置的模板内容转换
 * @param content
 */
export function findBlock(content: string, propKey: string): string {
    let s1 = content;
    const rpb = (str: string) => str.replace(/\{/g, '@@').replace(/\}/g, '##'); // 转换子对象标识，便于获取父对象
    const unrpb = (str: string) => str.replace(/@@/g, '{').replace(/##/g, '}'); // 子对象标识转换回来

    const callfn = (): void => {
    // 递归获取子对象块
        if (s1.indexOf(propKey) === -1) { return void 0; }

        s1 = s1.replace(
            /\{(?=(?:(?!\{)[\s\S])*$)[\s\S]*?\}/,
            ($0): any => {
                if (new RegExp(propKey).test($0)) {
                    return convertOption(rpb($0), propKey);
                }
                else { return rpb($0); }
            },
        );
        callfn();
    };
    callfn();
    return unrpb(s1);
}

/**
 * 模版输出项解析
 * @param content
 */
export function parseTPL(
    content: string,
    method: (key: rulesName, ...args: any[]) => string | number | boolean,
    update: Function,
): string {
    return content.replace(/<%([^(%>)\n\r]+)%>/g,
        ($0, $1): any => {
            const key = $1.replace(/\s+/g, '');
            let text: any;

            if (key.indexOf(',') > -1) {
                const args = key.split(',');

                args.forEach((item: any, i: number) => {
                    if (/^true$/.test(item)) { args[i] = true; }
                    else if (/^false$/.test(item)) { args[i] = false; }
                    else if (/^(\-|\+)?\d+(\.\d+)?$/.test(item)) { args[i] = +item; }
                });
                text = method(args.shift(), ...args);
            } else {
                text = method(key);
            }
            // 块结束更新取值范围
            if (new RegExp($0 + '[^(%>)]*}[^{]+{').test(content)) { update(); }
            return text;
        },
    );
}
