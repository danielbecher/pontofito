
'use client';
import { useEffect, useState } from "react";

type Punch = { id:string; timestamp:number; type:'in'|'out'; manual:boolean; ip:string };

export default function EditPunches(){
  const [list,setList]=useState<Punch[]>([]);
  const [loading,setLoading]=useState(true);
  const [msg,setMsg]=useState<string|null>(null);

  async function load(){
    setLoading(true);
    const r=await fetch('/api/punches?limit=200',{cache:'no-store'});
    setList(r.ok? await r.json():[]);
    setLoading(false);
  }

  useEffect(()=>{load();},[]);

  async function save(id:string, timestampStr:string){
    setMsg(null);
    const ts = new Date(timestampStr).getTime();
    const r = await fetch('/api/punches/update',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({id,timestamp:ts})});
    if(!r.ok){ setMsg('Falha ao salvar'); } else { setMsg('Salvo'); await load(); }
  }

  return (
    <main className="grid">
      <div className="card">
        <h3 style={{marginTop:0}}>Editar pontos</h3>
        {loading? <p>Carregando…</p> : (
          <div className="editGrid">
            {list.map(p=>(
              <div className="editRow" key={p.id} style={{background:p.manual?'#2b2a00':'transparent',padding:10,borderRadius:10,border:'1px solid #1f2937'}}>
                <div style={{minWidth:240}}>{new Date(p.timestamp).toLocaleString()}</div>
                <input className="input" type="datetime-local"
                       defaultValue={new Date(p.timestamp).toISOString().slice(0,16)}
                       onChange={(e)=> (p)._new=e.target.value } />
                <button className="btn" onClick={()=>save(p.id, (p)._new || new Date(p.timestamp).toISOString().slice(0,16))}>Salvar</button>
              </div>
            ))}
          </div>
        )}
        {msg && <div className="badge" style={{marginTop:10}}>{msg}</div>}
      </div>
    </main>
  );
}
