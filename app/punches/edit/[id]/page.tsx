'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import styles from '@/styles/ponto.module.css'

export default function EditPunchPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [ts, setTs] = useState<string>('')

  useEffect(() => {
    fetch(`/api/punches/list?id=${id}`).then(r=>r.json()).then(d=>{
      const p = d.items?.[0]
      if (p) setTs(new Date(p.timestamp).toISOString().slice(0,19))
    })
  }, [id])

  async function save() {
    const timestamp = new Date(ts).getTime()
    await fetch('/api/punches/update', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id, timestamp })
    })
    router.push('/punches')
  }

  return (
    <div style={{maxWidth: 420}}>
      <h1 style={{fontSize:18, fontWeight:700, marginBottom:8}}>Editar ponto</h1>
      <label style={{fontSize:13}}>Data/hora</label>
      <input type="datetime-local" value={ts} onChange={e=>setTs(e.target.value)} className={styles.input} />
      <div style={{height:10}}/>
      <button onClick={save} className={styles.buttonMain}>Salvar</button>
    </div>
  )
}
