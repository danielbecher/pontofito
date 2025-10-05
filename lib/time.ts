export function nowTs() { return Date.now() }

export function toDateKey(ts: number, tzOffsetMin = 0) {
  const d = new Date(ts + tzOffsetMin * 60 * 1000)
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
