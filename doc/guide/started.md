# 快速开始

## 介绍

`common` 模块是一个基于 Vue 3 的公共组件和工具库，旨在简化微前端项目的开发流程，提供统一的组件、API、工具和路由权限管理。

## 安装

### 作为子模块安装

```bash
# 不指定分支
git submodule add http://lbw@sso.hzcando.com:8080/r/newsystem/components.git common

# 指定分支
git submodule add -b dev http://lbw@sso.hzcando.com:8080/r/newsystem/components.git common
```

## 配置

### 1. vite.config.js 配置

在项目的 `vite.config.js` 文件中添加别名配置：

```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

export default defineConfig({
  // ...其他配置
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@common': fileURLToPath(new URL('./common', import.meta.url)), // 引入子模块
    },
  },
})
```

### 2. .env 文件配置

在项目根目录创建 `.env` 文件，添加必要的环境变量：

```
# 后端接口地址（必填）
VITE_BASE_URL = '/api'  

# 应用ID（必填）
VITE_APPID = 123124124  

# 系统ID（用于获取菜单）
VITE_SYSTEM_ID = 12 

# 保存在localStorage中的token的key
VITE_TOKENKEY = 'token' 
```