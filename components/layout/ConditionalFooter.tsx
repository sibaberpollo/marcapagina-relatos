'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'
import NeoFooter from './NeoFooter'

export default function ConditionalFooter() {
    const pathname = usePathname()

    // Ocultar footer en dashboard y biblioteca personal
    if (pathname.startsWith('/dashboard') || pathname.startsWith('/biblioteca-personal')) {
        return null
    }

    // Homepage usa NeoFooter
    if (pathname === '/') {
        return <NeoFooter />
    }

    // Resto de páginas usan Footer normal
    return <Footer />
}
