import axios from 'axios'
import { ElMessage } from 'element-plus'
import global from '../utils/global'
// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'https://api.hzcando.com', // 从环境变量获取API基础URL
  timeout: 15000, // 请求超时时间
})

// 统一处理401未授权情况
const handleUnauthorized = () => {
  global.clearToken() // 清除所有本地存储
  ElMessage.error('登录已过期，请重新登录')
  // 使用延时确保消息显示后再刷新页面
  setTimeout(() => {
    window.location.reload()
  }, 1500)
}

// 请求拦截器
service.interceptors.request.use(
  (config) => {
    // 从localStorage获取token并添加到请求头
    const token = global.token
    console.log('glbal-====', global)
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
      config.headers['appId'] = global.appId
    }
    config.params = config.params || {}
    config.params.systemId = config.params.systemId || global.systemId
    // 添加appId到请求参数
    const params = config.params || {}
    params.appId = global.appId
    config.params = params

    return config
  },
  (error) => {
    console.error('请求错误:', error)
    return Promise.reject(error)
  },
)

// 响应拦截器
service.interceptors.response.use(
  (response) => {
    // 处理二进制数据响应
    if (response.config.responseType === 'blob' || response.config.responseType === 'arraybuffer') {
      return response
    }

    // 处理HTTP状态码401
    if (response.status === 401) {
      handleUnauthorized()
      return Promise.reject(new Error('登录已过期'))
    }

    const { errorCode, resultData, errMsg } = response.data

    // 根据后端API的响应格式进行调整
    if (errorCode === 0) {
      return resultData
    }

    // 处理业务错误码401
    if (errorCode === 401) {
      handleUnauthorized()
      return Promise.reject(new Error(errMsg || '登录已过期'))
    }

    // 处理其他业务错误
    ElMessage.error(errMsg || '系统出错')
    return Promise.reject(new Error(errMsg || 'Error'))
  },
  (error) => {
    // 处理HTTP错误
    if (error.response) {
      const { status } = error.response
      const { errorCode, errMsg } = error.response.data || {}

      // 处理401未授权
      if (status === 401 || errorCode === 401) {
        handleUnauthorized()
      } else {
        // 处理其他HTTP错误
        ElMessage.error(errMsg || `请求失败(${status})`)
      }
    } else if (error.request) {
      // 请求已发送但没有收到响应
      ElMessage.error('服务器无响应，请检查网络连接')
    } else {
      // 请求配置出错
      ElMessage.error('请求配置错误: ' + error.message)
    }

    return Promise.reject(error)
  },
)

// 封装GET请求
export function getAction(url, params) {
  return service({
    url,
    method: 'get',
    params,
  })
}
export const get = getAction
// 封装POST请求
export function postAction(url, data, config) {
  return service({
    url,
    method: 'post',
    data,
    config,
  })
}
export const post = postAction
// 封装PUT请求
export function putAction(url, data, config) {
  return service({
    url,
    method: 'put',
    data,
    config,
  })
}
export const put = putAction
// 封装DELETE请求
export function deleteAction(url, params) {
  return service({
    url,
    method: 'delete',
    params,
  })
}
export const del = deleteAction
// 封装上传文件请求
export function upload(url, file, onUploadProgress) {
  const formData = new FormData()
  formData.append('file', file)

  return service({
    url,
    method: 'post',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    onUploadProgress,
  })
}

// 封装下载文件请求
export function download(url, params, fileName) {
  return service({
    url,
    method: 'get',
    params,
    responseType: 'blob',
  }).then((response) => {
    // 创建blob链接并下载
    const blob = new Blob([response.data])
    const link = document.createElement('a')
    link.href = window.URL.createObjectURL(blob)
    link.download = fileName || 'download'
    link.click()
    window.URL.revokeObjectURL(link.href)
    return response
  })
}

// 导出axios实例
export default service
