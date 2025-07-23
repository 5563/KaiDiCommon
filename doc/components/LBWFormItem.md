# LBWFormItem 表单项组件

## 简介

`LBWFormItem` 是一个基于 Element Plus 的表单项组件封装，支持多种输入类型，简化表单开发。

## 基本用法

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
## 属性

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
| nativeType | elementui原生类型（如datePicker的类型） | String | 'text' |

## 支持的表单项类型

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

## 插槽

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义表单项内容 |

## 实际示例

### 表单校验

```vue
<template>
  <el-form
    :model="form"
    :rules="rules"
    ref="formRef"
    label-width="100px"
  >
    <FormItem
      v-model="form.name"
      label="姓名"
      prop="name"
      formType="input"
    />
    
    <FormItem
      v-model="form.email"
      label="邮箱"
      prop="email"
      formType="input"
    />
    
    <el-button type="primary" @click="submitForm">提交</el-button>
  </el-form>
</template>

<script setup>
import { ref } from 'vue'
import FormItem from '@common/components/LBWFormItem/index.vue'

const formRef = ref(null)
const form = ref({
  name: '',
  email: ''
})

const rules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 10, message: '长度在2到10个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ]
}

const submitForm = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      console.log('表单验证通过')
    } else {
      console.log('表单验证失败')
    }
  })
}
</script>
```
