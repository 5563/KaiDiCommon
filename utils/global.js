const microData = window.microApp?.getData()
const tokenKey = microData && microData.tokenKey ? microData.tokenKey : import.meta.env.VITE_TOKENKEY || 'token'

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
