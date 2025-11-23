'use client'

import Link from 'next/link'
import { Search, Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function NeoHeader() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)

    const navLinks = [
        { href: '/relato', label: 'RELATOS' },
        { href: '/microcuento', label: 'MICROCUENTOS' },
        { href: '/articulo', label: 'ARTÍCULOS' },
        { href: '/autores', label: 'AUTORES' },
        { href: '/playlist', label: 'PLAYLIST' },
        { href: '/horoscopo', label: 'HORÓSCOPO' },
        { href: '/contacto', label: 'CONTACTO' },
    ]

    return (
        <>
            {/* Top Black Bar */}
            <div className="bg-neo-black text-neo-white py-2 px-4 text-xs font-mono flex justify-between items-center">
                <div className="flex gap-4">
                    <Link href="/acerca-de" className="hover:text-neo-yellow transition-colors">
                        ACERCA DE
                    </Link>
                    <Link href="/criterios-editoriales" className="hover:text-neo-yellow transition-colors">
                        CRITERIOS EDITORIALES
                    </Link>
                </div>
                <div className="flex gap-3 items-center">
                    <button
                        onClick={() => setSearchOpen(!searchOpen)}
                        className="hover:text-neo-yellow transition-colors"
                        aria-label="Search"
                    >
                        <Search className="h-4 w-4" />
                    </button>
                    <Link
                        href="/publica"
                        className="bg-neo-yellow text-neo-black px-3 py-1 font-bold hover:bg-white transition-colors"
                    >
                        Publica
                    </Link>
                    <Link
                        href="/mi-area"
                        className="border border-neo-white px-3 py-1 hover:bg-neo-white hover:text-neo-black transition-colors"
                    >
                        Mi área
                    </Link>
                </div>
            </div>

            {/* Main Yellow Header */}
            <header className="bg-neo-yellow border-b-4 border-neo-black sticky top-0 z-50">
                <div className="container mx-auto px-4">
                    {/* Logo */}
                    <div className="py-4 text-center border-b-2 border-neo-black">
                        <Link href="/" className="inline-block">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter font-titles">
                                :MARCA PÁGINA
                            </h1>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex justify-center items-center gap-1 py-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="px-3 py-2 text-sm font-bold tracking-wide hover:bg-neo-black hover:text-neo-yellow transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex justify-center py-2">
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="p-2 hover:bg-neo-black hover:text-neo-yellow transition-colors"
                            aria-label="Toggle menu"
                        >
                            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden border-t-2 border-neo-black bg-neo-yellow">
                        <nav className="flex flex-col">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    className="px-4 py-3 text-sm font-bold border-b border-neo-black hover:bg-neo-black hover:text-neo-yellow transition-colors"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* Search Overlay */}
            {searchOpen && (
                <div className="fixed inset-0 bg-neo-black/90 z-50 flex items-start justify-center pt-20">
                    <div className="bg-neo-yellow p-8 max-w-2xl w-full mx-4 border-4 border-neo-black">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-black">BUSCAR</h2>
                            <button
                                onClick={() => setSearchOpen(false)}
                                className="p-2 hover:bg-neo-black hover:text-neo-yellow transition-colors"
                            >
                                <X className="h-6 w-6" />
                            </button>
                        </div>
                        <input
                            type="text"
                            placeholder="¿Qué estás buscando?"
                            className="w-full px-4 py-3 text-lg border-4 border-neo-black focus:outline-none focus:ring-4 focus:ring-neo-black"
                            autoFocus
                        />
                    </div>
                </div>
            )}
        </>
    )
}
