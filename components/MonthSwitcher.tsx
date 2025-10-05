'use client'
import { useRouter, useSearchParams } from 'next/navigation'
import styles from '@/styles/ponto.module.css'

function addMonth(ym: string, delta: number) {
  const [y, m] = ym.split('-').map(Number)
  const d = new Date(Date.UTC(y, m - 1 + delta, 1))
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
}

export default function MonthSwitcher({ value }: { value: string }) {
  const router = useRouter()
  const sp = useSearchParams()
  const prev = addMonth(value, -1)
  const next = addMonth(value, 1)
  const go = (v: string) => {
    const q = new URLSearchParams(sp.toString())
    q.set('month', v)
    router.push(`/punches?${q.toString()}`)
  }
  return (
    <div className={styles.monthSwitch}>
      <button className={styles.monthBtn} onClick={() => go(prev)} aria-label="Anterior">◀</button>
      <div className={styles.monthText}>{value}</div>
      <button className={styles.monthBtn} onClick={() => go(next)} aria-label="Próximo">▶</button>
    </div>
  )
}
