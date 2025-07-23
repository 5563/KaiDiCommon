# LBWTable 表格组件

## 简介

`LBWTable` 是一个基于 Element Plus 的表格组件封装，集成了搜索、分页、树形表格等功能，大幅简化表格相关开发工作。

## 基本用法

```vue
<template>
  <LBWTable
    :columns="columns"
    :loadApi="loadData"
    v-model:queryParams="queryParams"
  >
    <!-- 自定义按钮区域 -->
    <template #buttonBox>
      <el-button type="primary" @click="handleAdd">新增</el-button>
    </template>
    
    <!-- 自定义列内容 -->
    <template #operation="scope">
      <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
      <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
    </template>
  </LBWTable>
</template>

<script setup>
import { ref } from 'vue'
import LBWTable from '@common/components/LBWTable/LBWTable.vue'
import { getList } from '@/api/example'

const queryParams = ref({})

const columns = [
  {
    prop: 'name',
    label: '姓名',
    search: true,
    formType: 'input'
  },
  {
    prop: 'age',
    label: '年龄'
  },
  {
    prop: 'status',
    label: '状态',
    search: true,
    formType: 'select',
    options: [
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ]
  },
  {
    prop: 'operation',
    label: '操作',
    width: 200,
    slot: true
  }
]

const loadData = (params) => {
  return getList(params)
}

const handleAdd = () => {
  // 新增逻辑
}

const handleEdit = (row) => {
  // 编辑逻辑
}

const handleDelete = (row) => {
  // 删除逻辑
}
</script>
```
## 属性


| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| columns | 表格列配置 | Array | [] |
| loadApi | 加载数据的API函数 | Function | () => {} |
| hidePagination | 是否隐藏分页 | Boolean | false |
| hideIndex | 是否隐藏序号列 | Boolean | false |
| pagesize | 每页条数 | Number | 10 |
| pageSizes | 每页条数选项 | Array | [10, 20, 50, 100] |
| layout | 分页组件布局 | String | 'total, sizes, prev, pager, next, jumper' |
| isTreeTable | 是否为树形表格 | Boolean | false |
| autoLoad | 是否自动加载数据 | Boolean | true |

## 列配置项

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| prop | 字段名 | String | - |
| label | 列标题 | String | - |
| width | 列宽度 | String/Number | - |
| align | 对齐方式 | String | 'center' |
| search | 是否作为搜索条件 | Boolean | false |
| showSearch | 是否显示搜索框 | Boolean | false |
| formType | 搜索表单类型 | String | 'input' |
| options | 选项数据（用于select等） | Array | - |
| slot | 是否使用插槽 | Boolean | false |
| hideTable | 是否在表格中隐藏 | Boolean | false |

## 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| current-change | 当前页改变时触发 | 当前页 |
| size-change | 每页条数改变时触发 | 每页条数 |

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| buttonBox | 表格上方按钮区域 |
| searchButtonRight | 搜索按钮右侧区域 |
| [prop] | 根据列的prop名称定义的列内容插槽 |
| search_[prop] | 根据列的prop名称定义的搜索表单插槽 |

## 方法

可以通过ref获取组件实例，调用以下方法：

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| loadData | 加载数据 | page: 页码（可选） |
| search | 搜索 | - |
| reset | 重置搜索条件 | - |
| deleteRow | 删除行 | delAction: 删除API, row: 行数据 |
