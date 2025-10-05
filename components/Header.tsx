"use client"
import Link from "next/link"
import styles from "@/styles/header.module.css"
export default function Header({ signedIn }: { signedIn: boolean }){
  async function signout(){ await fetch("/api/auth/signout",{method:"POST"}); location.href="/login" }
  return (
    <header className={styles.header}>
      <div className={styles.brand}>
        <div className={styles.brandBadge}>PF</div>
        <strong>PontoFito</strong>
      </div>
      <nav className={styles.nav}>
        <Link className="btn secondary" href="/">Início</Link>
        <Link className="btn secondary" href="/punches">Pontos</Link>
        <Link className="btn secondary" href="/punches/edit">Editar</Link>
        <Link className="btn secondary" href="/users">Usuários</Link>
        {signedIn ? (
          <button className="btn" onClick={signout}>Sair</button>
        ) : (
          <Link className="btn" href="/login">Entrar</Link>
        )}
      </nav>
    </header>
  )
}
