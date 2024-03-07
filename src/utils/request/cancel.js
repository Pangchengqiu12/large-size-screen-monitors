export class AxiosCancel {
  pendingMap
  constructor() {
    this.pendingMap = new Map()
  }

  generateReqKey(config) {
    const { method, url } = config
    return [url || '', method || '', JSON.stringify(config.params), JSON.stringify(config.data)].join('&')
  }

  addPending(config) {
    this.removePending(config)
    const requestKey = this.generateReqKey(config)
    if (!this.pendingMap.has(requestKey)) {
      const controller = new AbortController()
      config.signal = controller.signal
      this.pendingMap.set(requestKey, controller)
    } else {
      config.signal = this.pendingMap.get(requestKey).signal
    }
  }

  removePending(config) {
    const requestKey = this.generateReqKey(config)
    if (this.pendingMap.has(requestKey)) {
      this.pendingMap.get(requestKey).abort()
      this.pendingMap.delete(requestKey)
    }
  }

  removeAllPending() {
    this.pendingMap.forEach((cancel) => {
      cancel.abort()
    })
    this.reset()
  }
  reset() {
    this.pendingMap = new Map()
  }
}
