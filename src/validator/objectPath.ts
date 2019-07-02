interface DataType {
    [key: string]: any;
    [key: number]: any;
}

/**
* 按对象属性路径查询值
* @param { object | array } object 要查找的目标对象
* @param { Array<number | string> | number | string } path 路径，属性名有特殊字符使用[]形式查询
*/
export function objectPath(
    obj: DataType,
    path: (number | string)[] | number | string,
): any {
    try {
        if (typeof path === 'number') path = [path];
        if (!path || path.length === 0) return obj;
        if (typeof path === 'string') return objectPath(obj, path.split('.'));
  
        const p = path[0];
        const currentPath: string | number = (+p).toString() === p ? +p : p;
        let nextObj: DataType;
  
        if ((typeof currentPath === 'number' && Array.isArray(obj)) ||
          obj.hasOwnProperty(currentPath)) {
            nextObj = obj[currentPath];
            if (path.length === 1) return nextObj;
        }
        return objectPath(obj[currentPath], path.slice(1)); 
    } catch (error) {
        return void 0;
    }    
}
