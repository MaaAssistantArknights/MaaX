const originalConsole = global.console
const prefixable = ['log', 'warn', 'debug', 'info', 'error']
const fixZero = (n, l = 2) => `${n}`.padStart(l, '0')

const toLocalTimeZoneString = (date = new Date()) =>
  `${date.getFullYear()}-${fixZero(date.getMonth() + 1)}-${fixZero(date.getDate())}T${fixZero(
    date.getHours()
  )}:${fixZero(date.getMinutes())}:${fixZero(date.getSeconds())}.${fixZero(
    date.getMilliseconds(),
    3
  )}+${fixZero(Math.floor(-date.getTimezoneOffset() / 60))}:${fixZero(
    -date.getTimezoneOffset() % 60
  )}`

const console = new Proxy(originalConsole, {
  get: (t, p) => (prefixable.includes(p) ? t[p].bind(t, `[${toLocalTimeZoneString()}]`) : t[p]),
})

const Authorization = `Basic ${Buffer.from(process.env.WEBHOOK_SECRET, 'utf-8').toString('base64')}`
for (let retryTime = 0; retryTime < 10; retryTime++) {
  console.info(`Attempt #${retryTime} running...`)
  try {
    const result = await (
      await fetch(process.env.WEBHOOK_URL, {
        headers: {
          Authorization,
        },
        method: 'GET',
      })
    ).text()
    console.info('Attempt #', retryTime, 'success, result:', result)
    console.info('Done.')
    process.exit(0)
  } catch (e) {
    console.error('Fail at attempt #', retryTime, ':', e)
    continue
  }
}
console.error('Maximum retries exceeded, failed.')
process.exit(1)
