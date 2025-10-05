'use client'
import { useEffect, useState } from 'react'
import styles from '@/styles/ponto.module.css'

type Punch = { id: string; timestamp: number; type: 'in'|'out'; manual: boolean; ip: string }

export default function HomePage() {
  const [items, setItems] = useState<Punch[]>([])
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    fetch('/api/punches/list?limit=5', { cache: 'no-store' })
      .then(r => r.json())
      .then(d => setItems(d.items || []))
  }, [])

  async function punch() {
    setBusy(true)
    try {
      const r = await fetch('/api/punches/create', { method: 'POST' })
      if (r.ok) {
        const d = await r.json()
        setItems(prev => [d.item, ...prev].slice(0,5))
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid" style={{gap:12}}>
      <button onClick={punch} disabled={busy} className={styles.buttonMain}>
        {busy ? 'Registrando...' : 'Bater ponto'}
      </button>
      <div className="grid" style={{gap:8}}>
        {items.map(p => (
          <div key={p.id} className={`${styles.card} ${p.manual ? styles.cardManual : ''}`}>
            <div style={{fontSize:14}}>
              {new Date(p.timestamp).toLocaleString('pt-BR', { timeZone: 'UTC' })} — {p.type.toUpperCase()} — {p.ip}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
