import axios from 'axios'
import { useMemberStore } from '@/stores/index'

// const pendingRequests = {}
const token = useMemberStore().userInfo?.accessToken
console.log(useMemberStore().userInfo?.accessToken)
// let requestKey = null
// let errorRequest = false //判断重新发送的请求是否失败
let maxCount = 2 //最大重试次数

let request = axios.create({
  baseURL: 'https://lhhcrm.asrobot.cn/app-api/',
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: 'Bearer ' + token || '',
  },
})

request.interceptors.request.use(
  (config) => {
    config.method === 'get' || config.method === 'delete' ? (config.params = config.data) : ''
    config.method === 'get' || config.method === 'delete'
      ? (config.headers['Content-Type'] = 'application/x-www-form-urlencoded')
      : ''
    // requestKey = config.method + config.url + JSON.stringify(config.params || {})
    // pendingRequests[requestKey] && !errorRequest // 如果请求已经存在且不是失败的请求，则取消请求
    //   ? (config.cancelToken = new axios.CancelToken((cancel) => {
    //       cancel('请求已取消')
    //     }))
    //   : ''
    return config
  },
  (error) => {
    console.log(error)
    return Promise.reject(error)
  },
)
request.interceptors.response.use(
  ({ data }) => {
    // errorRequest = false
    // pendingRequests[requestKey] = true
    return data
  },
  (error) => {
    // errorRequest = true
    maxCount <= 0 ? Promise.reject(error) : (request(error.config), (maxCount -= 1))
  },
  // maxCount <= 0 ? Promise.reject(error) : request(opt, maxCount - 1)
)
export default request
