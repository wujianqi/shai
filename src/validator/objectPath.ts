type objType = {
    [key: string]: any; 
    [key: number]: any;
};

/**
   * 按路径查询对象属性值
   * @param { object | array } object 要查找的目标对象
   * @param { Array<number | string> | number | string } path 路径，"a.b"，["a", "b"]，目标对象为数组，或属性名有特殊字符使用[]形式查询
   */
export function objectPath(obj: objType, path: Array<number | string> | number | string): any {
    if (typeof path === 'number') {
        path = [path];
    }
    if (!path || path.length === 0) {
        return obj;
    }
    if (typeof path === 'string') {
        return objectPath(obj, path.split('.'));
    }

    let p = path[0], currentPath: string | number, nextObj: objType;

    currentPath =  (+p).toString() === p ? +p : p;
    if (typeof currentPath === 'number' && Array.isArray(obj) || obj.hasOwnProperty(currentPath)) {
        nextObj = obj[currentPath]; 
        if (path.length === 1) {
            return nextObj;
        } 
    }    
    return objectPath(obj[currentPath], path.slice(1));
}

