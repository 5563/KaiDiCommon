# 接口请求

```js
import { getAction, deleteAction, postAction, putAction } from '@common/api/index.js'


export const getRoomList = (params) => {
    return getAction('/api/sso/Role/list', params)
}
export const deleteRoom = (params) => {
    return deleteAction('/api/sso/Role/delete', params)
}
export const addRoom = (params) => {
    return postAction('/api/sso/Role/add', params)
}
export const updateRoom = (params) => {
    return postAction('/api/sso/Role/update', params)
}

```