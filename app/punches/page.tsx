
import Link from "next/link";

function getMonthKey(d: Date){ return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`; }

export default async function PunchesPage({ searchParams }: { searchParams?: { month?: string } }){
  const now = new Date();
  const month = searchParams?.month || getMonthKey(now);
  const prev = new Date(month+"-01T00:00:00"); prev.setMonth(prev.getMonth()-1);
  const next = new Date(month+"-01T00:00:00"); next.setMonth(next.getMonth()+1);

  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ""}/api/punches?month=${month}`, { cache: "no-store" });
  const list = res.ok ? await res.json() : [];

  const map: Record<string, number> = {};
  for(const p of list){
    const d = new Date(p.timestamp).toISOString().slice(0,10);
    map[d] = (map[d]||0)+1;
  }
  const missing = Object.entries(map).filter(([,c])=>c%2===1).map(([d])=>d);

  return (
    <main className="grid">
      <div className="card monthNav">
        <Link className="btn secondary" href={`/punches?month=${getMonthKey(prev)}`}>← {getMonthKey(prev)}</Link>
        <div className="badge">Mês atual: {month}</div>
        <Link className="btn secondary" href={`/punches?month=${getMonthKey(next)}`}>{getMonthKey(next)} →</Link>
        <a className="btn" style={{marginLeft:"auto"}} href={`/punches/export?month=${month}`} target="_blank" rel="noreferrer">Exportar PDF</a>
      </div>

      <div className="card">
        <table className="table">
          <thead><tr><th>Data/Hora</th><th>Tipo</th><th>IP</th><th>Origem</th></tr></thead>
          <tbody>
            {list.map((p:any)=>(
              <tr key={p.id} style={{background:p.manual?'#2b2a00':'transparent'}}>
                <td>{new Date(p.timestamp).toLocaleString()}</td>
                <td>{p.type==='in'?'Entrada':'Saída'}</td>
                <td>{p.ip}</td>
                <td>{p.manual?'Manual':'Automático'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {missing.length>0 && <div className="badge warn" style={{marginTop:10}}>Há dias com número ímpar de pontos: {missing.join(", ")}</div>}
      </div>
    </main>
  );
}
