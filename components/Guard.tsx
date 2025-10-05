'use client'
import { useEffect, useState } from 'react'

export default function Guard({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    fetch('/api/auth/session', { cache: 'no-store' }).then(r => {
      if (r.ok) setOk(true)
      else window.location.href = '/login'
    })
  }, [])
  if (!ok) return null
  return <>{children}</>
}
