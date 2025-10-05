'use client'
import Link from 'next/link'
import s from '@/styles/layout.module.css'

export default function Header() {
  return (
    <header className={s.header}>
      <div className={s.headerInner}>
        <div className={s.brand}>
          <span className={s.h1}>PontoFito</span>
        </div>
        <nav className={s.nav}>
          <Link className={s.link} href="/">Início</Link>
          <Link className={s.link} href="/punches">Pontos</Link>
          <Link className={s.link} href="/admin/users">Usuários</Link>
        </nav>
      </div>
    </header>
  )
}
