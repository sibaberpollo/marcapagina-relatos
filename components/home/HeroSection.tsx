import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection() {
    return (
        <section className="w-full bg-neo-white text-neo-black">
            {/* Top Bar / Header-like element if needed, or just start with the grid */}

            <div className="grid grid-cols-1 lg:grid-cols-12 border-b-4 border-neo-black">
                {/* Left Column: Reviews & Criticism (Dummy) */}
                <div className="lg:col-span-4 border-r-4 border-neo-black p-6 flex flex-col gap-8 bg-neo-yellow">
                    <div className="space-y-4">
                        <span className="bg-neo-black text-neo-white px-2 py-1 text-sm font-bold uppercase tracking-widest">
                            Reseña
                        </span>
                        <h3 className="text-3xl font-bold leading-tight font-titles">
                            La insoportable levedad del ser digital
                        </h3>
                        <p className="font-serif text-lg leading-snug">
                            Una crítica mordaz a la literatura generada por IA y por qué nunca reemplazará al dolor humano.
                        </p>
                        <div className="pt-2 border-t-2 border-neo-black w-16"></div>
                    </div>

                    <div className="space-y-4">
                        <span className="bg-neo-black text-neo-white px-2 py-1 text-sm font-bold uppercase tracking-widest">
                            Crítica
                        </span>
                        <h3 className="text-2xl font-bold leading-tight font-titles">
                            ¿Por qué leemos lo que leemos?
                        </h3>
                        <p className="font-serif text-base">
                            Un análisis de las tendencias literarias en TikTok y su impacto en las ventas editoriales.
                        </p>
                    </div>
                </div>

                {/* Center/Main Column: Featured Article (Dummy) */}
                <div className="lg:col-span-8 p-0 relative min-h-[500px] flex flex-col justify-between">
                    {/* Background Image Placeholder */}
                    <div className="absolute inset-0 z-0 bg-gray-200">
                        {/* Use a solid color or pattern if no image available, or a placeholder */}
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale contrast-125"></div>
                        <div className="absolute inset-0 bg-neo-yellow/20 mix-blend-multiply"></div>
                    </div>

                    <div className="relative z-10 p-8 h-full flex flex-col justify-end bg-gradient-to-t from-neo-white/90 via-neo-white/40 to-transparent">
                        <div className="max-w-3xl">
                            <span className="inline-block bg-neo-yellow border-2 border-neo-black px-3 py-1 text-sm font-bold uppercase tracking-widest mb-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                Artículo Destacado
                            </span>
                            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-[0.9] font-titles tracking-tighter">
                                SÍNDROME DEL IMPOSTOR
                            </h1>
                            <p className="text-xl md:text-2xl font-serif font-medium mb-6 max-w-2xl bg-neo-white/80 p-2 inline-block">
                                Cinco grandes escritores que, como tú, pensaban que no sabían escribir.
                            </p>
                            <button className="bg-neo-black text-neo-yellow border-2 border-transparent hover:bg-neo-white hover:text-neo-black hover:border-neo-black px-8 py-3 text-lg font-bold uppercase tracking-wide transition-all shadow-[6px_6px_0px_0px_#faff00] hover:shadow-[6px_6px_0px_0px_#000]">
                                Leer Artículo
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
