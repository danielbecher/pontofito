'use client'
import { useEffect, useState } from 'react'
import styles from '@/styles/punches.module.css'

type Punch = {
  id: string
  timestamp: number
  type: 'in' | 'out'
  manual: boolean
  ip: string
}

export default function PunchesPage() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<Punch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [month, setMonth] = useState(() => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
  })

  async function load() {
    setLoading(true)
    setError(null)
    try {
      const base = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
      const res = await fetch(`${base}/api/punches?month=${month}`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Falha ao carregar registros')
      const data = await res.json()
      setList(data)
    } catch (e: any) {
      setError(e.message)
    }
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [month])

  return (
    <main className={styles.container}>
      <section className="card">
        <h1>Registros de Ponto</h1>
        <div className={styles.filters}>
          <input
            type="month"
            value={month}
            onChange={e => setMonth(e.target.value)}
          />
        </div>
        {loading ? (
          <p>Carregando…</p>
        ) : error ? (
          <div className="badge warn">{error}</div>
        ) : list.length === 0 ? (
          <div className="badge">Sem registros</div>
        ) : (
          <div className={styles.list}>
            {list.map(p => (
              <div key={p.id} className={`${styles.item} ${p.manual ? styles.manual : ''}`}>
                <div>
                  <div style={{ fontWeight: 600 }}>
                    {new Date(p.timestamp).toLocaleString()}
                  </div>
                  <div className="badge" style={{ marginTop: 4 }}>
                    {p.type === 'in' ? 'Entrada' : 'Saída'} • IP {p.ip}
                  </div>
                </div>
                {p.manual && <div className="badge warn">Manual</div>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
