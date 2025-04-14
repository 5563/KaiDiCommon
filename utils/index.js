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
