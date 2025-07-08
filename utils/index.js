export function array2Tree(
  array,
  { field = "id", pFiled = "parentId", parentValue = 0 } = {}
) {
  const result = [];
  array.forEach((item) => {
    if (item[pFiled] === parentValue) {
      const children = array2Tree(array, {
        field,
        pFiled,
        parentValue: item[field],
      });
      if (children.length > 0) {
        item.children = children;
      }
      result.push(item);
    }
  });
  return result;
}
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // 处理日期对象
  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }
  
  // 处理数组
  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item));
  }
  
  // 处理普通对象
  const cloneObj = {};
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      cloneObj[key] = deepClone(obj[key]);
    }
  }
  return cloneObj;
}