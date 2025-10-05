'use client'
import { useEffect, useState } from 'react'
import styles from '@/styles/ponto.module.css'

type U = { id: string; email: string; name?: string; active: boolean; role: 'employee'|'admin' }

export default function UsersPage() {
  const [items, setItems] = useState<U[]>([])
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<'employee'|'admin'>('employee')

  async function load() {
    const r = await fetch('/api/punches/month-summary?users=1', { cache: 'no-store' })
    const d = await r.json()
    setItems(d.users || [])
  }

  useEffect(() => { load() }, [])

  async function saveUser() {
    await fetch('/api/punches/month-summary?createUser=1', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, name, role, active: true })
    })
    setEmail(''); setName(''); setRole('employee'); load()
  }

  async function toggle(u: U) {
    await fetch('/api/punches/month-summary?toggleUser=1', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ id: u.id, active: !u.active })
    })
    load()
  }

  return (
    <div>
      <h1 style={{fontSize:18, fontWeight:700, marginBottom:12}}>Usuários</h1>
      <div className={styles.form} style={{maxWidth:420}}>
        <input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} className={styles.input} />
        <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className={styles.input} />
        <select value={role} onChange={e=>setRole(e.target.value as any)} className={styles.input}>
          <option value="employee">employee</option>
          <option value="admin">admin</option>
        </select>
        <button onClick={saveUser} className={styles.buttonMain}>Salvar usuário</button>
      </div>
      <div style={{height:16}}/>
      <div className="grid" style={{gap:8}}>
        {items.map(u => (
          <div key={u.id} className={styles.card}>
            <div style={{fontSize:14}}>{u.name || u.email} — {u.role} — {u.active ? 'ativo' : 'inativo'}</div>
            <div style={{height:8}}/>
            <button onClick={()=>toggle(u)} className={styles.buttonMain}>{u.active ? 'Desativar' : 'Ativar'}</button>
          </div>
        ))}
      </div>
    </div>
  )
}
