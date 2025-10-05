
'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { clientAuth } from '@/lib/firebaseClient';

export default function LoginPage(){
  const router = useRouter();
  const sp = useSearchParams();
  const [checking,setChecking]=useState(true);
  const [email,setEmail]=useState('admin@coffito.gov.br');
  const [password,setPassword]=useState('123456');
  const [error,setError]=useState<string|null>(null);
  const [submitting,setSubmitting]=useState(false);

  useEffect(()=>{
    (async()=>{
      const r=await fetch('/api/auth/session',{cache:'no-store'});
      if(r.ok){ router.replace(sp.get('redirect')||'/'); return; }
      setChecking(false);
    })();
  },[router,sp]);

  async function onSubmit(e:React.FormEvent){
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try{
      const cred = await signInWithEmailAndPassword(clientAuth,email,password);
      const idToken = await cred.user.getIdToken(true);
      const res = await fetch('/api/auth/signin',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({idToken})
      });
      if(!res.ok){ const j=await res.json().catch(()=>({})); throw new Error(j?.error||'Falha no login'); }
      router.replace(sp.get('redirect')||'/');
    }catch(err:any){
      setError(err?.message||'Falha no login');
    }finally{
      setSubmitting(false);
    }
  }

  if(checking){ return <main style={{display:'grid',placeItems:'center',minHeight:'60dvh'}}>Carregando…</main> }

  return (
    <main style={{display:'grid',placeItems:'center',minHeight:'70dvh',padding:16}}>
      <form onSubmit={onSubmit} className="card" style={{width:360,display:'grid',gap:12}}>
        <h2 style={{margin:0}}>Entrar</h2>
        <label>
          <div className="label">E-mail</div>
          <input className="input" type="email" value={email} onChange={e=>setEmail(e.target.value)} required />
        </label>
        <label>
          <div className="label">Senha</div>
          <input className="input" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
        </label>
        {error && <div className="badge warn">{error}</div>}
        <button className="btn" type="submit" disabled={submitting}>{submitting?'Entrando…':'Entrar'}</button>
      </form>
    </main>
  );
}
