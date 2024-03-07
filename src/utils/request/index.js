import axios from 'axios'
import { useEnv } from '@/hooks/useEnv.js'
import { ResultCode, ContentType } from '@/type/httpConfig.js'
import { useMemberStore } from '@/stores/index'
import { addAjaxErrorLog, addAjaxLog } from './log.js'

// const pendingRequests = {}
const token = useMemberStore().userInfo?.accessToken

const defaultConfig = {
  successMessage: false,
  errorMessage: true,
  cancelSame: false,
  isRetry: false,
  retryCount: 3,
  loading: true,
}

const { VITE_BASE_API } = useEnv()
const service = axios.create({
  baseURL: VITE_BASE_API,
  timeout: 10 * 1000,
  headers: {
    'Content-Type': ContentType.JSON,
    Authorization: 'Bearer ' + token || '',
  },
})

service.interceptors.request.use((config) => {
  console.log(config, 222)
  return config
})
service.interceptors.response.use((res) => {
  if (res.data.code === ResultCode.SUCCESS) {
    addAjaxLog(res)
    return res.data
  } else {
    addAjaxErrorLog(res, res.data.message)
    return Promise.reject(res.data)
  }
})
async function requests(method = 'GET', url, data, config) {
  const options = Object.assign({}, defaultConfig, config)
  return new Promise((resolve, reject) => {
    service({ method, url, ...data, requestOptions: options })
      .then((res) => {
        resolve(res)
      })
      .catch((err) => {
        reject(err)
      })
  })
}
const request = {
  get(url, data, config) {
    return requests('GET', url, { params: data }, config)
  },
  post(url, data, config) {
    return requests('POST', url, data, config)
  },
  delete(url, data, config) {
    return requests('DELETE', url, { params: data }, config)
  },
  put(url, data, config) {
    return requests('PUT', url, data, config)
  },
}
export default request
