# API 模块

## 简介

API 模块提供了与后端服务交互的统一接口，封装了 HTTP 请求方法，并处理了请求拦截、响应拦截、错误处理等通用逻辑。

## 基础 HTTP 方法

### 导入方式

```js
import { getAction, postAction, putAction, deleteAction, upload, download } from '@common/api'
// 或使用别名
import { get, post, put, del } from '@common/api'
```

### 方法说明

| 方法名 | 别名 | 说明 | 参数 |
| --- | --- | --- | --- |
| getAction | get | 发送 GET 请求 | (url, params) |
| postAction | post | 发送 POST 请求 | (url, data, config) |
| putAction | put | 发送 PUT 请求 | (url, data, config) |
| deleteAction | del | 发送 DELETE 请求 | (url, params) |
| upload | - | 上传文件 | (url, file, onUploadProgress) |
| download | - | 下载文件 | (url, params, fileName) |

### 使用示例

```js
// GET 请求示例
const getUsers = (params) => {
  return getAction('/api/users', params)
}

// POST 请求示例
const createUser = (data) => {
  return postAction('/api/users', data)
}

// PUT 请求示例
const updateUser = (data) => {
  return putAction(`/api/users/${data.id}`, data)
}

// DELETE 请求示例
const deleteUser = (id) => {
  return deleteAction(`/api/users/${id}`)
}

// 上传文件示例
const uploadAvatar = (file, onProgress) => {
  return upload('/api/upload/avatar', file, onProgress)
}

// 下载文件示例
const downloadReport = (params) => {
  return download('/api/reports/download', params, '报表.xlsx')
}
```

## 预定义 API

系统预定义了一些常用的 API 方法，可直接导入使用。

### 导入方式

```js
import { 
  getEnterpriseList, 
  getEnterpriseChildren, 
  getEmployeeList,
  getAccountList,
  getICCardList,
  getDictTreeList,
  getDictList
} from '@common/api/baseApi'
```

### 方法说明

| 方法名 | 说明 | 参数 |
| --- | --- | --- |
| getEnterpriseList | 获取企业列表 | (params) |
| getEnterpriseChildren | 获取企业子级列表 | (params) |
| getEmployeeList | 获取员工列表 | (params) |
| getAccountList | 获取账户列表 | (params) |
| getICCardList | 获取IC卡列表 | (params) |
| getDictTreeList | 获取字典树形列表 | (code) |
| getDictList | 获取字典列表 | (code) |

### 使用示例

```js
import { getDictList } from '@common/api/baseApi'

// 获取字典数据
const loadDictData = async () => {
  try {
    const result = await getDictList('user_status')
    console.log(result)
  } catch (error) {
    console.error(error)
  }
}
```

## 请求/响应拦截器

API 模块内部实现了请求和响应拦截器，自动处理以下功能：

### 请求拦截器

- 自动添加 token 到请求头
- 自动添加 appId 到请求参数
- 自动添加 systemId 到请求参数

### 响应拦截器

- 自动处理 401 未授权情况，跳转到登录页
- 自动处理业务错误码，显示错误提示
- 自动处理二进制数据响应（如文件下载）
- 自动提取响应数据中的 resultData 字段

## 自定义配置

API 模块基于 axios 实现，可以通过导入 service 实例进行自定义配置：

```js
import service from '@common/api'

// 自定义配置
service.defaults.timeout = 30000
```
