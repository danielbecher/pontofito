'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import styles from '@/styles/ponto.module.css'
import { useSearchParams } from 'next/navigation'

type Row = {
  id: string
  timestamp: number
  type: 'in' | 'out'
  manual: boolean
  ip: string
  dateKey: string
}

export default function PunchList() {
  const sp = useSearchParams()
  const month = sp.get('month') || new Date().toISOString().slice(0, 7)
  const [rows, setRows] = useState<Row[]>([])
  const [oddDays, setOddDays] = useState<string[]>([])

  useEffect(() => {
    fetch(`/api/punches/list?month=${month}`, { cache: 'no-store' })
      .then(r => r.json())
      .then(d => { setRows(d.items || []); setOddDays(d.oddDays || []) })
  }, [month])

  return (
    <div>
      {oddDays.length > 0 && (
        <div className={styles.warningBox}>
          Atenção: dias com número ímpar de pontos: {oddDays.join(', ')}
        </div>
      )}
      <div className={styles.list}>
        {rows.sort((a,b)=>b.timestamp-a.timestamp).map(p => (
          <Link key={p.id} href={`/punches/edit/${p.id}`} className={`${styles.row} ${p.manual ? styles.rowManual : ''}`}>
            {new Date(p.timestamp).toLocaleString('pt-BR', { timeZone: 'UTC' })} — {p.type.toUpperCase()} — {p.ip}
          </Link>
        ))}
      </div>
    </div>
  )
}
