import MonthSwitcher from '@/components/MonthSwitcher'
import PunchList from '@/components/PunchList'
import styles from '@/styles/ponto.module.css'

function currentMonth() {
  const d = new Date()
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}`
}

export default function PunchesPage() {
  const month = currentMonth()
  return (
    <div>
      <div className={styles.monthBar}>
        <h1 style={{fontSize:18, fontWeight:700}}>Pontos</h1>
        <MonthSwitcher value={month} />
      </div>
      <PunchList />
      <div style={{marginTop:14}}>
        <a className={styles.smallLink} href={`/api/export/pdf?month=${month}`} target="_blank">Exportar PDF deste mês</a>
      </div>
    </div>
  )
}
