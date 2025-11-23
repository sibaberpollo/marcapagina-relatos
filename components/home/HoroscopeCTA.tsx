import Link from 'next/link'

export default function HoroscopeCTA() {
    return (
        <section className="w-full bg-neo-black text-neo-yellow py-8 border-b-4 border-neo-black overflow-hidden relative group cursor-pointer">
            <Link href="/horoscopo" className="block w-full h-full">
                <div className="container mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter font-titles transform group-hover:scale-105 transition-transform duration-300">
                        ¿Qué dicen los astros hoy?
                    </h2>
                    <p className="mt-2 text-xl font-serif italic text-neo-white group-hover:text-neo-yellow transition-colors">
                        Descubre tu destino literario →
                    </p>
                </div>

                {/* Decorative elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <div className="w-full h-full bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,#faff00_10px,#faff00_20px)]"></div>
                </div>
            </Link>
        </section>
    )
}
