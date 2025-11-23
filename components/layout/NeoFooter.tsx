'use client'

import Link from 'next/link'
import Image from 'next/image'
import siteMetadata from '@/data/siteMetadata'
import SocialIcon from '../common/social-icons'

export default function NeoFooter() {
    const socialIcons = [
        { kind: 'github' as const, href: siteMetadata.github },
        { kind: 'instagram' as const, href: siteMetadata.instagram },
        { kind: 'spotify' as const, href: siteMetadata.spotify },
        { kind: 'youtube' as const, href: siteMetadata.youtube },
        { kind: 'bluesky' as const, href: siteMetadata.bluesky },
        { kind: 'threads' as const, href: siteMetadata.threads },
        { kind: 'twitter' as const, href: siteMetadata.twitter },
    ].filter((s) => s.href)

    return (
        <footer className="bg-neo-yellow border-t-4 border-neo-black mt-0">
            <div className="container mx-auto px-4 py-12">
                {/* Typewriter Graphic Section */}
                <div className="flex flex-col md:flex-row items-center gap-8 mb-12 border-b-2 border-neo-black pb-12">
                    <div className="w-full md:w-1/3 flex justify-center">
                        {/* Placeholder for typewriter image */}
                        <div className="w-32 h-32 bg-neo-black flex items-center justify-center">
                            <span className="text-neo-yellow text-4xl font-black">⌨</span>
                        </div>
                    </div>
                    <div className="w-full md:w-2/3">
                        <p className="text-lg md:text-xl font-serif mb-4">
                            <strong className="font-black">¿Te gusta publicar textos en Transtextos?</strong>
                        </p>
                        <p className="text-base mb-6">
                            Envíanos tus textos de narrativa, crónica, poesía y crítica. Si tienes un proyecto editorial, contáctanos. Somos un equipo editorial comprometido, atento y cuidadoso.
                        </p>
                        <Link
                            href="/publica"
                            className="inline-block bg-neo-black text-neo-yellow px-6 py-3 font-black uppercase border-2 border-neo-black hover:bg-neo-white hover:text-neo-black hover:border-neo-black transition-colors"
                        >
                            Publica en Transtextos
                        </Link>
                    </div>
                </div>

                {/* Social Icons */}
                <div className="flex justify-center gap-4 mb-8">
                    {socialIcons.map((social) => (
                        <a
                            key={social.kind}
                            href={social.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 bg-neo-black rounded-full flex items-center justify-center hover:bg-neo-white hover:scale-110 transition-all"
                        >
                            <SocialIcon kind={social.kind} href={social.href} size={5} />
                        </a>
                    ))}
                </div>

                {/* Footer Links */}
                <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm font-bold">
                    <Link href="/acerca-de" className="hover:underline">
                        Acerca de
                    </Link>
                    <span>•</span>
                    <Link href="/criterios-editoriales" className="hover:underline">
                        Criterios editoriales
                    </Link>
                    <span>•</span>
                    <Link href="/publica" className="hover:underline">
                        Publica
                    </Link>
                    <span>•</span>
                    <Link href="/contacto" className="hover:underline">
                        Contacto
                    </Link>
                    <span>•</span>
                    <Link href="/mi-area" className="hover:underline">
                        Mi área
                    </Link>
                </div>

                {/* Copyright */}
                <div className="text-center text-sm">
                    <p className="font-mono">
                        © {new Date().getFullYear()} {siteMetadata.title} • Todos los derechos reservados
                    </p>
                </div>
            </div>
        </footer>
    )
}
