'use client'
import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { clientAuth } from '@/lib/firebaseClient'
import styles from '@/styles/login.module.css'
export default function LoginPage(){
  const router = useRouter()
  const sp = useSearchParams()
  const [checking,setChecking]=useState(true)
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [error,setError]=useState<string|null>(null)
  const [submitting,setSubmitting]=useState(false)
  useEffect(()=>{
    (async()=>{
      const r=await fetch('/api/auth/session',{cache:'no-store'})
      if(r.ok){ router.replace(sp.get('redirect')||'/'); return }
      setChecking(false)
    })()
  },[router,sp])
  async function onSubmit(e:React.FormEvent){
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try{
      const cred = await signInWithEmailAndPassword(clientAuth,email,password)
      const idToken = await cred.user.getIdToken(true)
      const res = await fetch('/api/auth/signin',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({idToken})})
      if(!res.ok){ const j=await res.json().catch(()=>({})); throw new Error(j?.error||'Falha no login') }
      router.replace(sp.get('redirect')||'/')
    }catch(err:any){
      const c = err?.code || ''
      if(c==='auth/invalid-email'){ setError('E-mail inválido.') }
      else if(c==='auth/user-not-found'){ setError('Usuário não encontrado.') }
      else if(c==='auth/wrong-password'){ setError('Senha incorreta.') }
      else if(c==='auth/invalid-credential'){ setError('Credenciais inválidas. Confira e-mail e senha.') }
      else{ setError(err?.message||'Erro inesperado.') }
    }finally{
      setSubmitting(false)
    }
  }
  if(checking){ return <main className={styles.wrapper}>Carregando…</main> }
  return (
    <main className={styles.wrapper}>
      <form onSubmit={onSubmit} className={`card ${styles.form}`}>
        <h2 className={styles.heading}>Entrar</h2>
        <label>
          <div className={styles.label}>E-mail</div>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>
          <div className={styles.label}>Senha</div>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        {error && <div className="badge warn">{error}</div>}
        <button className="btn" type="submit" disabled={submitting}>{submitting?'Entrando…':'Entrar'}</button>
      </form>
    </main>
  )
}