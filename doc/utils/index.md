# 工具模块

## 简介

工具模块提供了一系列实用的辅助函数，用于简化开发过程中的常见操作，包括数据转换、全局状态管理等功能。

## 数组与对象工具

### 导入方式

```js
import { array2Tree, deepClone, processVariable } from '@common/utils/index'
```

### 方法说明

#### array2Tree

将扁平数组转换为树形结构。

**参数**

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| array | 要转换的数组 | Array | - |
| options | 配置选项 | Object | `{ field: 'id', pFiled: 'parentId', parentValue: 0 }` |

**选项说明**

- `field`: 节点唯一标识字段名
- `pFiled`: 父节点标识字段名
- `parentValue`: 根节点的父节点值

**返回值**

转换后的树形结构数组。

**使用示例**

```js
const flatArray = [
  { id: 1, name: '部门1', parentId: 0 },
  { id: 2, name: '部门2', parentId: 0 },
  { id: 3, name: '部门1-1', parentId: 1 },
  { id: 4, name: '部门1-2', parentId: 1 },
  { id: 5, name: '部门2-1', parentId: 2 }
]

const treeData = array2Tree(flatArray)
console.log(treeData)
/*
[
  {
    id: 1,
    name: '部门1',
    parentId: 0,
    children: [
      { id: 3, name: '部门1-1', parentId: 1 },
      { id: 4, name: '部门1-2', parentId: 1 }
    ]
  },
  {
    id: 2,
    name: '部门2',
    parentId: 0,
    children: [
      { id: 5, name: '部门2-1', parentId: 2 }
    ]
  }
]
*/
```

#### deepClone

深度克隆对象或数组，创建一个完全独立的副本。

**参数**

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| obj | 要克隆的对象或数组 | Object/Array | - |

**返回值**

克隆后的对象或数组。

**使用示例**

```js
const original = {
  name: '张三',
  age: 30,
  address: {
    city: '上海',
    district: '浦东新区'
  },
  hobbies: ['读书', '游泳']
}

const cloned = deepClone(original)
cloned.address.city = '北京'
cloned.hobbies.push('旅游')

console.log(original.address.city) // 上海 (原对象不受影响)
console.log(original.hobbies) // ['读书', '游泳'] (原数组不受影响)
```

#### processVariable

处理变量，统一转换为字符串或保持原样。

**参数**

| 参数名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| input | 输入值 | Any | - |

**返回值**

- 如果输入是对象且不为null，则返回原对象
- 如果输入有值(包括数字、字符串、0等)，则转换为字符串
- 否则返回undefined

**使用示例**

```js
console.log(processVariable(123)) // '123'
console.log(processVariable('abc')) // 'abc'
console.log(processVariable(0)) // '0'
console.log(processVariable({ id: 1 })) // { id: 1 }
console.log(processVariable(null)) // undefined
console.log(processVariable('')) // undefined
```

