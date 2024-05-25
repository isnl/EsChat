// @ts-nocheck
import axios from 'axios'
import { useLoginStore } from '@/stores/login'
import { useTokenStore } from '@/stores/token'
import { ElMessage } from 'element-plus'
import { isDev } from '@/utils'
export const BASE_URL = isDev ? 'http://localhost:3100/' : '/'
// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 60 * 1000
})
const err = (error) => {
  ElMessage.closeAll()
  const ignoreMessageUrls = ['status']
  if (error.response) {
    // 部分接口请求不走响应拦截器的message通知
    if (ignoreMessageUrls.some((url) => error.response.config.url.includes(url))) {
      return Promise.reject(error)
    }
    let message = '服务器错误，请稍后再试'
    if (error.response.status === 400) {
      try {
        message = error.response.data.message
      } catch (error) {}
      ElMessage.error(message)
    } else if (error.response.status === 401) {
      const { setVisible } = useLoginStore()
      setVisible(true)
    }
  } else if (error.message) {
    if (error.message.includes('timeout')) {
      ElMessage({
        message: '网络超时',
        type: 'warning'
      })
    } else {
      ElMessage({
        message: '系统错误，请稍后再试',
        type: 'warning'
      })
    }
  }
  return Promise.reject(error)
}
axiosInstance.interceptors.request.use(
  (config) => {
    const tokenStore = useTokenStore()
    const BearerToken = `Bearer ${tokenStore.token}`
    config.headers['authorization'] = BearerToken
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)
axiosInstance.interceptors.response.use((response) => {
  if (response.data.code === 200) {
    return response.data
  } else {
    ElMessage.closeAll()
    ElMessage({
      message: response.data.msg,
      type: 'warning'
    })
    return Promise.reject(response.data)
  }
}, err)
export default axiosInstance
