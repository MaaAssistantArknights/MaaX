export function formattedDurationToSeconds (time: string | null) {
  if (!time) return 0
  const [hour, minute, second] = time.split(':').map(v => {
    const num = Number(v)
    return isNaN(num) ? 0 : num
  })
  return hour * 3600 + minute * 60 + second
}

export function secondsToFormattedDuration (seconds: number) {
  if (seconds >= 86400 || seconds < 0) {
    return '00:00:00'
  }
  const arr = []
  for (let index = 0; index < 3; ++index) {
    arr.push(String(seconds % 60).padStart(2, '0'))
    seconds = Math.floor(seconds / 60)
  }
  return arr.reverse().join(':')
}
