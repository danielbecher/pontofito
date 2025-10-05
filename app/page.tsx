
'use client';
import { useEffect, useState } from "react";

type Punch = { id:string; timestamp:number; type:'in'|'out'; manual:boolean; ip:string };

export default function Home(){
  const [loading,setLoading]=useState(true);
  const [list,setList]=useState<Punch[]>([]);
  const [error,setError]=useState<string|null>(null);
  const [punching,setPunching]=useState(false);

  async function load(){
    setLoading(true);
    const r=await fetch('/api/punches?limit=5',{cache:'no-store'});
    if(r.ok){ setList(await r.json()); } else { setList([]); }
    setLoading(false);
  }
  useEffect(()=>{load();},[]);

  async function punch(){
    setPunching(true);
    setError(null);
    const r=await fetch('/api/punch',{method:'POST'});
    if(!r.ok){ const j=await r.json().catch(()=>({})); setError(j?.error||'Falha ao bater ponto'); }
    await load();
    setPunching(false);
  }

  return (
    <main className="grid">
      <section className="hero card">
        <h1 style={{marginTop:0}}>Bem-vindo ao PontoFito</h1>
        <div className="actions">
          <button className="btn" onClick={punch} disabled={punching}>{punching?'Registrando…':'Bater ponto'}</button>
          <a className="btn secondary" href="/punches">Ver todos</a>
        </div>
        {error && <div className="badge warn" style={{marginTop:10}}>{error}</div>}
      </section>
      <section className="card">
        <h3 style={{marginTop:0}}>Últimos 5 pontos</h3>
        {loading ? <p>Carregando…</p> : (
          <div className="list">
            {list.length===0 && <div className="badge">Sem registros</div>}
            {list.map(p=>(
              <div key={p.id} className={"item "+(p.manual?'manual':'')}>
                <div>
                  <div style={{fontWeight:600}}>{new Date(p.timestamp).toLocaleString()}</div>
                  <div className="badge" style={{marginTop:4}}>{p.type==='in'?'Entrada':'Saída'} • IP {p.ip}</div>
                </div>
                {p.manual && <div className="badge warn">Manual</div>}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
