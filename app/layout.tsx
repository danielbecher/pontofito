import './globals.css'
import Header from '@/components/Header'
import Guard from '@/components/Guard'
import s from '@/styles/layout.module.css'

export const metadata = {
  title: 'PontoFito',
  description: 'Sistema de registro de ponto dos empregados comissionados do COFFITO',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Header />
        <Guard>
          <main className={s.container}>{children}</main>
        </Guard>
      </body>
    </html>
  )
}
