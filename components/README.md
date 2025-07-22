# 组件库使用文档

## 目录
- [LBWTable 表格组件](#lbwtable-表格组件)
- [LBWFormItem 表单项组件](#lbwformitem-表单项组件)

## LBWTable 表格组件

### 简介
`LBWTable` 是一个基于 Element Plus 的表格组件封装，集成了搜索、分页、树形表格等功能，大幅简化表格相关开发工作。

### 基本用法

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

### 属性

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

### 列配置项

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

### 事件

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| current-change | 当前页改变时触发 | 当前页 |
| size-change | 每页条数改变时触发 | 每页条数 |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| buttonBox | 表格上方按钮区域 |
| searchButtonRight | 搜索按钮右侧区域 |
| [prop] | 根据列的prop名称定义的列内容插槽 |
| search_[prop] | 根据列的prop名称定义的搜索表单插槽 |

### 方法

可以通过ref获取组件实例，调用以下方法：

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| loadData | 加载数据 | page: 页码（可选） |
| search | 搜索 | - |
| reset | 重置搜索条件 | - |
| deleteRow | 删除行 | delAction: 删除API, row: 行数据 |

## LBWFormItem 表单项组件

### 简介
`LBWFormItem` 是一个基于 Element Plus 的表单项组件封装，支持多种输入类型，简化表单开发。

### 基本用法

```vue
<template>
  <el-form :model="form" label-width="100px">
    <FormItem
      v-model="form.name"
      label="姓名"
      prop="name"
      formType="input"
    />
    
    <FormItem
      v-model="form.gender"
      label="性别"
      prop="gender"
      formType="radio"
      :options="genderOptions"
    />
    
    <FormItem
      v-model="form.department"
      label="部门"
      prop="department"
      formType="select"
      :options="departmentOptions"
    />
    
    <FormItem
      v-model="form.birthday"
      label="生日"
      prop="birthday"
      formType="datePicker"
      nativeType="date"
    />
    
    <FormItem
      v-model="form.avatar"
      label="头像"
      prop="avatar"
      formType="uploadOneImg"
    />
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import FormItem from '@common/components/LBWFormItem/index.vue'

const form = ref({
  name: '',
  gender: '',
  department: '',
  birthday: '',
  avatar: ''
})

const genderOptions = [
  { label: '男', value: 'male' },
  { label: '女', value: 'female' }
]

const departmentOptions = [
  { label: '技术部', value: 'tech' },
  { label: '市场部', value: 'marketing' },
  { label: '财务部', value: 'finance' }
]
</script>
```

### 属性

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| modelValue/v-model | 绑定值 | Any | - |
| label | 标签文本 | String | '' |
| prop | 表单域字段 | String | - |
| formType | 表单项类型 | String | 'input' |
| span | 栅格占据的列数 | Number | 24 |
| labelWidth | 标签宽度 | String/Number | 'auto' |
| useCol | 是否使用栅格布局 | Boolean | true |
| mb0 | 是否移除底部外边距 | Boolean | false |
| options | 选项数据（用于select、radio等） | Array | - |
| nativeType | 原生类型（如datePicker的类型） | String | 'text' |

### 支持的表单项类型

| formType | 说明 | 额外属性 |
| --- | --- | --- |
| input | 输入框 | nativeType: 输入框类型 |
| select | 下拉选择框 | options: 选项数组 |
| radio | 单选框 | options: 选项数组 |
| datePicker | 日期选择器 | nativeType: 日期类型(date/datetime等) |
| treeSelect | 树形选择器 | options/data: 树形数据 |
| uploadOneImg | 单图片上传 | - |
| dictSelect | 字典选择器 | dictCode: 字典编码 |
| dictTreeSelect | 字典树形选择器 | dictCode: 字典编码 |

### 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义表单项内容 |

## 组件组合使用示例

### 带搜索和CRUD功能的表格页面

```vue
<template>
  <div class="page-container">
    <LBWTable
      ref="tableRef"
      :columns="columns"
      :loadApi="loadTableData"
      v-model:queryParams="queryParams"
    >
      <template #buttonBox>
        <el-button type="primary" @click="handleAdd">新增</el-button>
      </template>
      
      <template #operation="scope">
        <el-button type="primary" size="small" @click="handleEdit(scope.row)">编辑</el-button>
        <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
      </template>
    </LBWTable>
    
    <!-- 表单弹窗 -->
    <el-dialog v-model="dialogVisible" :title="formTitle">
      <el-form :model="form" ref="formRef" label-width="100px">
        <FormItem
          v-model="form.name"
          label="姓名"
          prop="name"
          formType="input"
        />
        
        <FormItem
          v-model="form.department"
          label="部门"
          prop="department"
          formType="select"
          :options="departmentOptions"
        />
        
        <FormItem
          v-model="form.status"
          label="状态"
          prop="status"
          formType="radio"
          :options="statusOptions"
        />
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import LBWTable from '@common/components/LBWTable/LBWTable.vue'
import FormItem from '@common/components/LBWFormItem/index.vue'
import { getList, saveData, updateData, deleteData } from '@/api/example'
import { ElMessage } from 'element-plus'

const tableRef = ref(null)
const queryParams = ref({})
const dialogVisible = ref(false)
const formTitle = ref('新增')
const form = ref({})
const formRef = ref(null)
const isEdit = ref(false)

const columns = [
  {
    prop: 'name',
    label: '姓名',
    search: true,
    formType: 'input'
  },
  {
    prop: 'department',
    label: '部门',
    search: true,
    formType: 'select',
    options: [
      { label: '技术部', value: 'tech' },
      { label: '市场部', value: 'marketing' },
      { label: '财务部', value: 'finance' }
    ]
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

const departmentOptions = [
  { label: '技术部', value: 'tech' },
  { label: '市场部', value: 'marketing' },
  { label: '财务部', value: 'finance' }
]

const statusOptions = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 0 }
]

const loadTableData = (params) => {
  return getList(params)
}

const handleAdd = () => {
  formTitle.value = '新增'
  form.value = {}
  isEdit.value = false
  dialogVisible.value = true
}

const handleEdit = (row) => {
  formTitle.value = '编辑'
  form.value = JSON.parse(JSON.stringify(row))
  isEdit.value = true
  dialogVisible.value = true
}

const handleDelete = (row) => {
  tableRef.value.deleteRow(deleteData, row)
}

const submitForm = async () => {
  try {
    const api = isEdit.value ? updateData : saveData
    await api(form.value)
    ElMessage.success(isEdit.value ? '编辑成功' : '新增成功')
    dialogVisible.value = false
    tableRef.value.loadData()
  } catch (error) {
    console.error(error)
  }
}
</script>
```

## 最佳实践

1. **组件组合使用**：将 LBWTable 和 LBWFormItem 组合使用，可以快速构建完整的CRUD页面。

2. **统一配置**：表格列配置可以单独抽离成文件，便于维护和复用。

3. **自定义插槽**：对于特殊的展示需求，可以使用插槽自定义内容。

4. **表单校验**：在使用 LBWFormItem 时，可以配合 Element Plus 的表单校验功能使用。

5. **按需引入**：根据实际需求按需引入组件，避免不必要的性能开销。

## 注意事项

1. 确保项目中已正确安装和配置 Element Plus。

2. 使用树形表格时，确保数据中包含正确的 id 和 parentId 字段。

3. 上传组件需要配置正确的上传接口和权限。

4. 字典组件需要配置正确的字典接口。

5. 如遇到样式问题，可能需要引入相关的 SCSS 文件。 