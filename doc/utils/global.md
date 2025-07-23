# 全局变量
## 全局工具

全局工具提供了应用级别的状态管理和工具函数。

### 导入方式

```js
import global from '@common/utils/global'
```

### 属性和方法

| 名称 | 类型 | 说明 |
| --- | --- | --- |
| token | Getter/Setter | 获取或设置token |
| clearToken | Function | 清除token |
| appId | Getter | 获取应用ID |
| systemId | Getter | 获取系统ID |

### 使用示例

```js
// 获取token
const token = global.token

// 设置token
global.token = 'new-token-value'

// 清除token
global.clearToken()

// 获取应用ID
const appId = global.appId

// 获取系统ID
const systemId = global.systemId
```

### Token获取逻辑

Token的获取逻辑按以下优先级：

1. 如果在微前端环境中，优先从`window.microApp?.getData().token`获取
2. 否则从localStorage中获取，键名由环境变量`VITE_TOKENKEY`指定，默认为`'token'`

### AppId获取逻辑

AppId的获取逻辑按以下优先级：

1. 如果在微前端环境中，优先从`window.microApp?.getData().appId`获取
2. 否则从环境变量`VITE_APPID`获取

### SystemId获取逻辑

SystemId的获取逻辑按以下优先级：

1. 如果在微前端环境中，优先从`window.microApp?.getData().systemId`获取
2. 否则从环境变量`VITE_SYSTEM_ID`获取
