# 路由模块

## 简介

路由模块提供了路由权限控制功能，包括自动处理登录验证、token传递、重定向等功能，简化了路由权限管理。

## 路由权限控制

### 导入方式

```js
import routerPermission from '@common/router/permission'
```

### 使用方法

在创建Vue Router实例后，调用`routerPermission`函数并传入router实例：

```js
import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './routes'
import routerPermission from '@common/router/permission'

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 应用路由权限控制
routerPermission(router)

export default router
```

## 功能说明

路由权限控制模块主要实现以下功能：

### 1. Token 自动提取

当路由中包含 token 查询参数时，自动提取并保存到本地存储：

```js
if (to.query && to.query.token) {
  global.token = to.query.token
  next(to.path)
}
```

### 2. 登录验证

在每次路由跳转前，检查是否有有效的 token：

```js
const token = global.token
if (token) {
  next() // 有token，允许访问
} else {
  // 无token，重定向到登录页
  const redirectUrl = encodeURIComponent(
    window.location.origin + window.location.pathname + to.href
  )
  window.location.href = `https://sso.hzcando.com/#/?redirectUrl=${redirectUrl}&appId=${global.appId}`
}
```

## 微前端环境

在微前端环境中，路由权限控制会自动从父应用获取 token、appId 等信息，实现无缝集成。

## 自定义路由权限控制

如果需要自定义路由权限控制逻辑，可以创建自己的路由权限控制文件，参考以下示例：

```js
import router from './router'
import global from '@common/utils/global'

router.beforeEach((to, from, next) => {
  // 处理token
  if (to.query && to.query.token) {
    global.token = to.query.token
    next(to.path)
    return
  }
  
  // 白名单路由，无需登录验证
  const whiteList = ['/login', '/404', '/403']
  if (whiteList.includes(to.path)) {
    next()
    return
  }
  
  // 登录验证
  const token = global.token
  if (token) {
    // 已登录
    if (to.path === '/login') {
      next('/') // 已登录时访问登录页，重定向到首页
    } else {
      // 这里可以添加角色和权限验证逻辑
      next()
    }
  } else {
    // 未登录，重定向到登录页
    const redirectUrl = encodeURIComponent(
      window.location.origin + window.location.pathname + to.href
    )
    window.location.href = `https://sso.hzcando.com/#/?redirectUrl=${redirectUrl}&appId=${global.appId}`
  }
})
``` 