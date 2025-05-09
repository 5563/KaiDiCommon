const tokenKey = import.meta.env.VITE_TOKENKEY || 'token'

// 动态导入cesium，避免强制依赖
const getCesium = () => {
  try {
    // 优先从微应用数据中获取cesium
    const microData = window.microApp?.getData()
    if (microData && microData.cesium) {
      return microData.cesium
    }
    
    // 尝试从全局获取cesium
    if (window.Cesium) {
      return window.Cesium
    }
    
    // 尝试动态导入cesium（如果项目安装了cesium）
    return import('cesium').catch(() => {
      console.warn('Cesium模块未找到，请确保已安装或通过其他方式提供')
      return null
    })
  } catch (error) {
    console.warn('获取Cesium失败:', error)
    return null
  }
}

const getToken = () => {
  const microData = window.microApp?.getData()
  if (microData && microData.token) {
    return microData.token
  }
  return localStorage.getItem(tokenKey)
}

const setToken = (token) => {
  localStorage.setItem(tokenKey, token)
}

const clearToken = () => {
  localStorage.removeItem(tokenKey)
}

const getAppId = () => {
  const microData = window.microApp?.getData()
  if (microData && microData.appId) {
    return microData.appId
  }
  return import.meta.env.VITE_APPID
}

const getSystemId = () => {
  const microData = window.microApp?.getData()
  if (microData && microData.systemId) {
    return microData.systemId
  }
  return import.meta.env.VITE_SYSTEM_ID
}

export default {
  get cesium() {
    return getCesium()
  },
  get token() {
    return getToken()
  },
  set token(value) {
    setToken(value)
  },
  clearToken,
  get appId() {
    return getAppId()
  },
  get systemId() {
    return getSystemId()
  },
}
