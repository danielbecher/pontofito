'use client'
import { useEffect, useState } from 'react'
import { clientAuth } from '@/lib/firebaseClient'
import { signInWithEmailAndPassword, onAuthStateChanged, getIdToken } from 'firebase/auth'
import styles from '@/styles/ponto.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [redirect, setRedirect] = useState('/')

  useEffect(() => {
    const p = new URLSearchParams(window.location.search)
    setRedirect(p.get('redirect') || '/')
    const unsub = onAuthStateChanged(clientAuth, async user => {
      if (user) {
        const t = await getIdToken(user, true)
        document.cookie = `__session=${t}; Path=/; SameSite=Lax`
        window.location.href = redirect
      }
    })
    return () => unsub()
  }, [redirect])

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    try {
      await signInWithEmailAndPassword(clientAuth, email, password)
    } catch {
      setError('Falha no login')
    }
  }

  return (
    <div style={{maxWidth: 380, margin: '40px auto'}}>
      <h1 style={{fontSize: 18, fontWeight: 700, marginBottom: 12}}>Entrar</h1>
      <form onSubmit={onSubmit} className={styles.form}>
        <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email" className={styles.input} />
        <input value={password} onChange={e=>setPassword(e.target.value)} placeholder="Senha" type="password" className={styles.input} />
        <button className={styles.buttonMain}>Entrar</button>
        {error && <div style={{color:'#b00020', fontSize:13}}>{error}</div>}
      </form>
    </div>
  )
}
