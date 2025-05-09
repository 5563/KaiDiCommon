
# 加载子模块
```cmd
    <!-- 不指定分支 -->
    git submodule add http://lbw@sso.hzcando.com:8080/r/newsystem/components.git common
    <-- 指定分支 -->
    git submodule add -b dev http://lbw@sso.hzcando.com:8080/r/newsystem/components.git common
```
 

# 项目必须含有的配置

1. 配置 vite.config.js
    ```js
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url)),
            '@common': fileURLToPath(new URL('./common', import.meta.url)), // 引入子模块
        },
    },
    ```
2. .env 文件中必须有以下配置
    ```js
    VITE_APP_BASE_API = '/api'  // 后端接口地址 必填
    VITE_APPID = 123124124  // 应用ID 必填
    VITE_SYSTEM_ID = 12 // 系统id 用于获取菜单
    VITE_TOKENKEY= 'token' // 保存在localStorage中的token的key
    ```


# 使用子模块
1. api模块
```js
import { getAction, postAction, putAction, deleteAction } from '@common/api'

```
2. utils模块
```js
import global from "@common/utils/global";
global.token //  获取token
global.token = '123123123123' // 设置token
global.clearToken() // 清空token
global.appId //  获取应用id
global.systemId //  获取系统id
global.cesium //  获取cesium对象

import { array2Tree } from '@common/utils/index' //用来把数组转成树结构

```
3. router模块
```js
import routerPermission from '@common/router/permission'

routerPermission(router) //路由拦截器，直接能跳转登录
```