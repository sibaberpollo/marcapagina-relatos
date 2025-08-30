'use client'

import { useEffect, useState } from 'react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const seen = localStorage.getItem('mp_cookie_consent_seen')
    if (!seen) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[10000] w-[95%] sm:w-auto">
      <div className="rounded-xl border border-black bg-white text-black p-4 sm:p-3 shadow-lg flex flex-col sm:flex-row gap-3 items-start sm:items-center">
        <p className="text-sm">
          Usamos analíticas y, si aceptas, señales demográficas para mejorar recomendaciones. Puedes aceptar todo o solo analíticas.
        </p>
        <div className="flex gap-2 ml-auto">
          <button
            className="px-3 py-2 text-sm rounded-lg border border-black bg-white hover:bg-gray-100"
            onClick={() => {
              try { (window as any).acceptAnalyticsOnly?.() } catch {}
              localStorage.setItem('mp_cookie_consent_seen', '1')
              setVisible(false)
            }}
          >
            Solo analíticas
          </button>
          <button
            className="px-3 py-2 text-sm rounded-lg border border-black bg-[var(--color-accent)] hover:brightness-95"
            onClick={() => {
              try { (window as any).acceptAllConsent?.() } catch {}
              localStorage.setItem('mp_cookie_consent_seen', '1')
              setVisible(false)
            }}
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  )
}


