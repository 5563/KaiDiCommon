# 公共组件模块使用指南

## 安装子模块

```bash
# 不指定分支
git submodule add http://lbw@sso.hzcando.com:8080/r/newsystem/components.git common

# 指定分支
git submodule add -b dev http://lbw@sso.hzcando.com:8080/r/newsystem/components.git common
```

## 必要配置

### 1. vite.config.js 配置

```js
resolve: {
    alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
        '@common': fileURLToPath(new URL('./common', import.meta.url)), // 引入子模块
    },
},
```

### 2. .env 文件配置

```js
# 后端接口地址（必填）
VITE_APP_BASE_API = '/api'  

# 应用ID（必填）
VITE_APPID = 123124124  

# 系统ID（用于获取菜单）
VITE_SYSTEM_ID = 12 

# 保存在localStorage中的token的key
VITE_TOKENKEY = 'token' 
```

## 子模块功能使用

### 1. API模块

```js
// 导入HTTP请求方法
import { getAction, postAction, putAction, deleteAction } from '@common/api'
```

### 2. 工具模块

```js
// 全局工具
import global from "@common/utils/global";

// token操作
global.token              // 获取token
global.token = 'xxx'      // 设置token
global.clearToken()       // 清空token

// 其他全局属性
global.appId              // 获取应用ID
global.systemId           // 获取系统ID

// 数组转树结构工具
import { array2Tree } from '@common/utils/index'
```

### 3. 路由模块

```js
// 路由拦截器（支持自动跳转登录页）
import routerPermission from '@common/router/permission'
routerPermission(router)
```