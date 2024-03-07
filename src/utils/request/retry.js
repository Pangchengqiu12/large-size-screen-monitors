export class AxiosRetry {
  retry(service, err) {
    const config = err?.config
    config._retryCount = config._retryCount || 0
    config._retryCount += 1
    delete config.headers
    setTimeout(() => {
      service(config)
    }, 100)
  }
}
