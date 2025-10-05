'use client'
import { useEffect, useState } from "react"
import styles from "@/styles/home.module.css"

type Punch = { id: string; timestamp: number; type: 'in' | 'out'; manual: boolean; ip: string }

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [list, setList] = useState<Punch[]>([])
  const [error, setError] = useState<string | null>(null)
  const [punching, setPunching] = useState(false)

  async function load() {
    setLoading(true)
    try {
      const r = await fetch('/api/punches?limit=5', { cache: 'no-store' })
      if (!r.ok) throw new Error()
      const data = await r.json()
      setList(Array.isArray(data) ? data : [])
    } catch {
      setList([])
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function punch() {
    setPunching(true)
    setError(null)
    try {
      const r = await fetch('/api/punch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'in',
          timestamp: Date.now(),
          manual: false
        })
      })
      if (!r.ok) {
        const j = await r.json().catch(() => ({}))
        setError(j?.error || 'Falha ao bater ponto')
      }
      await load()
    } catch {
      setError('Erro de rede ou servidor')
    }
    setPunching(false)
  }

  return (
    <main className={styles.grid}>
      <section className={`card ${styles.hero}`}>
        <h1>Bem-vindo ao PontoFito</h1>
        <div className={styles.actions}>
          <button className="btn" onClick={punch} disabled={punching}>
            {punching ? 'Registrando…' : 'Bater ponto'}
          </button>
          <a className="btn secondary" href="/punches">Ver todos</a>
        </div>
        {error && <div className="badge warn">{error}</div>}
      </section>

      <section className="card">
        <h3>Últimos 5 pontos</h3>
        {loading ? (
          <p>Carregando…</p>
        ) : (
          <div className={styles.list}>
            {(!list || list.length === 0) && <div className="badge">Sem registros</div>}
            {list && list.map(p => (
              <div key={p.id} className={`${styles.item} ${p.manual ? styles.manual : ''}`}>
                <div>
                  <div style={{ fontWeight: 600 }}>{new Date(p.timestamp).toLocaleString()}</div>
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
