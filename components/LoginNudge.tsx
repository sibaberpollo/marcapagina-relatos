'use client'

import { useEffect, useMemo, useState } from 'react'
import LoginModal from './LoginModal'
import { useSession } from 'next-auth/react'

type Props = {
  slug: string
}

// Nudge de login basado en navegación/tiempo
export default function LoginNudge({ slug }: Props) {
  const { status } = useSession()
  const [open, setOpen] = useState(false)

  const STORAGE_KEYS = useMemo(
    () => ({
      pv: 'mp_pv_count',
      ms: 'mp_read_ms_total',
      last: 'mp_last_login_nudge',
    }),
    []
  )

  // Incrementar PV al montar en relatos
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const pv = parseInt(localStorage.getItem(STORAGE_KEYS.pv) || '0', 10) || 0
      localStorage.setItem(STORAGE_KEYS.pv, String(pv + 1))
    } catch (_) {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Cronómetro de lectura (visible only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    let acc = 0
    let last = Date.now()
    let timer: number | null = null

    function tick() {
      const now = Date.now()
      acc += now - last
      last = now
    }

    function start() {
      if (timer != null) return
      last = Date.now()
      timer = window.setInterval(tick, 1000)
    }

    function stop() {
      if (timer != null) {
        window.clearInterval(timer)
        timer = null
      }
      try {
        const prev = parseInt(localStorage.getItem(STORAGE_KEYS.ms) || '0', 10) || 0
        localStorage.setItem(STORAGE_KEYS.ms, String(prev + acc))
        acc = 0
      } catch (_) {}
    }

    const onVis = () => (document.visibilityState === 'visible' ? start() : stop())
    document.addEventListener('visibilitychange', onVis)
    if (document.visibilityState === 'visible') start()
    return () => {
      document.removeEventListener('visibilitychange', onVis)
      stop()
    }
  }, [STORAGE_KEYS.ms])

  // Decidir si mostrar nudge (si no hay sesión)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (status !== 'unauthenticated') return
    try {
      const pv = parseInt(localStorage.getItem(STORAGE_KEYS.pv) || '0', 10) || 0
      const ms = parseInt(localStorage.getItem(STORAGE_KEYS.ms) || '0', 10) || 0
      const last = parseInt(localStorage.getItem(STORAGE_KEYS.last) || '0', 10) || 0
      const now = Date.now()
      const weekMs = 7 * 24 * 60 * 60 * 1000
      const thresholdsMet = pv >= 3 || ms >= 6 * 60 * 1000
      const cooldownOver = now - last > weekMs
      if (thresholdsMet && cooldownOver) {
        setOpen(true)
        localStorage.setItem(STORAGE_KEYS.last, String(now))
      }
    } catch (_) {}
  }, [status, STORAGE_KEYS])

  return <LoginModal open={open} onClose={() => setOpen(false)} title="¡Gracias por leer!" />
}
