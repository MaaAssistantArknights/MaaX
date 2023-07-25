import { Singleton } from '@common/function/singletonDecorator'
import { EventEmitter } from 'events'

// send event to listers every 1 second
@Singleton
export class Ticker extends EventEmitter {
  private timer: NodeJS.Timeout | null = null

  constructor() {
    super()
    this.start()
  }

  start() {
    if (this.timer) {
      return
    }
    this.timer = setInterval(() => {
      this.emit('tick')
    }, 1000)
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  }
}
