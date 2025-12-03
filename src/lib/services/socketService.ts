interface SocketServiceOpts {
  protocols?: string | string[]
  reconnect?: boolean
  protocolOnReconnect?: () => string | string[]
  maxReconnectAttempts?: number
  reconnectDelay?: number
  onChangeConnection?: (isConnected: boolean) => void
}

type QueuedMessage = {
  message: string
  resolve: (value: boolean) => void
  reject: (reason?: any) => void
};

class SocketService {
  public client: WebSocket
  public onClientRecreated: (() => void) | null = null

  private readonly options: SocketServiceOpts
  private reconnectAttempts: number = 0
  private readonly url: string
  private messageQueue: QueuedMessage[] = []
  private isConnected: boolean = false

  constructor(url: string, opts: SocketServiceOpts = {}) {
    this.options = {
      maxReconnectAttempts: 3,
      reconnectDelay: 500,
      ...opts
    }
    this.url = url

    const { protocols } = this.options
    this.client = new WebSocket(url, protocols)
    this.setupEventHandlers()
  }

  private setupEventHandlers() {
    this.client.onopen = () => {
      this.isConnected = true
      this.reconnectAttempts = 0

      this.flushMessageQueue()
      this.options.onChangeConnection?.(true)
    }

    if (!this.options.reconnect) return

    this.client.onclose = () => {
      this.isConnected = false
      this.options.onChangeConnection?.(false)

      if (!this.onClientRecreated) return

      if (this.reconnectAttempts < this.options.maxReconnectAttempts!) {
        console.warn(`WebSocket closed, attempting to reconnect (${this.reconnectAttempts + 1}/${this.options.maxReconnectAttempts})...`)

        this.reconnectAttempts++

        // Implement exponential backoff with a delay
        setTimeout(() => {
          const protocols = this.options.protocolOnReconnect?.()
          this.client = new WebSocket(this.url, protocols)
          this.setupEventHandlers()
          this.onClientRecreated?.()

        }, this.options.reconnectDelay)

        return
      }

      console.warn(`WebSocket closed, max reconnect attempts (${this.options.maxReconnectAttempts}) reached`)

      this.messageQueue.forEach((queued) => {
        queued.reject(new Error('Max reconnection attempts reached, message could not be sent'))
      })

      this.messageQueue = []
    }
  }

  public async send(message: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.isConnected && this.client.readyState === WebSocket.OPEN) {
        try {
          this.client.send(message)
          resolve(true)
        } catch (error) {
          reject(error)
        }

        return
      }

      console.warn('WebSocket not connected, message queued for later sending')
      this.messageQueue.push({ message, resolve, reject })

      if (this.options.reconnect === false ||
        this.reconnectAttempts >= this.options.maxReconnectAttempts!) {
        reject(new Error('WebSocket is not connected and will not reconnect'))
      }
    })
  }

  private flushMessageQueue() {
    if (this.messageQueue.length === 0) return

    const queueCopy = [...this.messageQueue]
    this.messageQueue = []

    for (const queued of queueCopy) {
      try {
        if (this.isConnected && this.client.readyState === WebSocket.OPEN) {
          this.client.send(queued.message)
          queued.resolve(true)
        } else {
          // If we somehow lost connection again, put the message back in the queue
          this.messageQueue.push(queued)
          console.warn('Connection lost while flushing message queue')
        }
      } catch (error) {
        queued.reject(error)
      }
    }
  }
}

export default SocketService
