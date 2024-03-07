// import dayjs from "dayjs";
import { ErrorMsg } from '@/type/httpConfig.js'
import { useErrorLogStoreWithOut } from '@/stores/modules/errorLog'
import { useMessage } from '@/hooks'
import { addOperationInfo, Api } from '@/api/log'

const { error, success } = useMessage()

export const setErrorMessage = (err) => {
  const { data, status } = err
  let message = data?.message || ''
  if (!message) {
    switch (status) {
      case 400:
        message = ErrorMsg.ERROR_400
        break
      case 401:
        message = ErrorMsg.ERROR_401
        break
      case 403:
        message = ErrorMsg.ERROR_403
        break
      case 404:
        message = ErrorMsg.ERROR_404
        break
      case 500:
        message = ErrorMsg.ERROR_500
        break
      case 503:
        message = ErrorMsg.ERROR_503
        break
      case 504:
        message = ErrorMsg.ERROR_504
        break
    }
  }
  addAjaxErrorLog(err, message)
}

export const addAjaxErrorLog = (err, message) => {
  addAjaxLog(err)
  const { url, method, params, data, requestOptions } = err.config
  const errorLogStore = useErrorLogStoreWithOut()
  errorLogStore.addErrorLog({
    // type: ErrorTypeEnum.AJAX,
    url: url,
    method,
    message,
    params: ['get', 'delete'].includes(method) ? JSON.stringify(params) : JSON.stringify(data),
    data: err.data ? JSON.stringify(err.data) : '',
    detail: JSON.stringify(err),
    // time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
  requestOptions.errorMessage && error(message)
}

export const addAjaxLog = (response) => {
  const { url, method, requestOptions } = response.config
  if ([Api.ADD_OPERATION_INFO, Api.ADD_ERROR_INFO, Api.ADD_LOGIN_INFO].includes(url) || method === 'get') return
  requestOptions.successMessage && success(response?.data?.message)

  addOperationInfo({
    method,
    url,
    user: 'admin',
    userIp: '127.0.0.1',
    status: response.data.code,
    // time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
  })
}
