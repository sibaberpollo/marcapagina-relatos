import Link from 'next/link'
import Image from 'next/image'
import FeaturedStoryCard from '@/components/content/cards/FeaturedStoryCard'
import SimpleMemeItem from '@/components/features/memes/SimpleMemeItem'

interface ContentGridProps {
    featuredStory?: any // Type as any for now to be flexible with what we pass
}

export default function ContentGrid({ featuredStory }: ContentGridProps) {
    return (
        <section className="w-full bg-neo-white">
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-screen">
                {/* Left Column: More Dummy Articles (Wide) */}
                <div className="lg:col-span-8 border-r-4 border-neo-black p-6 md:p-12 flex flex-col gap-12">

                    {/* Article 1 */}
                    <article className="group cursor-pointer">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-1/3 aspect-[4/3] bg-gray-200 relative border-2 border-neo-black shadow-[4px_4px_0px_0px_#000]">
                                {/* Placeholder Image */}
                                <div className="absolute inset-0 bg-neo-black/10"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-neo-black font-bold opacity-20 text-4xl">IMG</div>
                            </div>
                            <div className="w-full md:w-2/3">
                                <span className="text-xs font-bold uppercase tracking-widest bg-neo-yellow px-2 py-1 mb-2 inline-block border border-neo-black">
                                    Ensayo
                                </span>
                                <h3 className="text-3xl font-bold mb-3 font-titles group-hover:underline decoration-4 decoration-neo-yellow underline-offset-4">
                                    El fin de la novela tal como la conocemos
                                </h3>
                                <p className="text-lg text-gray-700 font-serif leading-relaxed">
                                    ¿Estamos ante el ocaso de la narrativa larga o simplemente ante una metamorfosis necesaria? Un recorrido por las nuevas formas de contar historias.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-sm font-bold uppercase">
                                    <span>Por Juan Pérez</span>
                                    <span className="w-1 h-1 bg-neo-black rounded-full"></span>
                                    <span>5 min de lectura</span>
                                </div>
                            </div>
                        </div>
                    </article>

                    <div className="border-t-2 border-neo-black border-dashed"></div>

                    {/* Article 2 */}
                    <article className="group cursor-pointer">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-1/3 aspect-[4/3] bg-gray-200 relative border-2 border-neo-black shadow-[4px_4px_0px_0px_#000]">
                                <div className="absolute inset-0 bg-neo-yellow/20"></div>
                                <div className="absolute inset-0 flex items-center justify-center text-neo-black font-bold opacity-20 text-4xl">IMG</div>
                            </div>
                            <div className="w-full md:w-2/3">
                                <span className="text-xs font-bold uppercase tracking-widest bg-neo-black text-neo-white px-2 py-1 mb-2 inline-block">
                                    Entrevista
                                </span>
                                <h3 className="text-3xl font-bold mb-3 font-titles group-hover:underline decoration-4 decoration-neo-yellow underline-offset-4">
                                    "Escribir es un acto de resistencia"
                                </h3>
                                <p className="text-lg text-gray-700 font-serif leading-relaxed">
                                    Conversamos con la autora revelación del año sobre su proceso creativo, sus miedos y por qué decidió publicar en independiente.
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-sm font-bold uppercase">
                                    <span>Por María González</span>
                                    <span className="w-1 h-1 bg-neo-black rounded-full"></span>
                                    <span>12 min de lectura</span>
                                </div>
                            </div>
                        </div>
                    </article>

                    <div className="border-t-2 border-neo-black border-dashed"></div>

                    {/* Article 3 */}
                    <article className="group cursor-pointer">
                        <div className="flex flex-col md:flex-row gap-6 items-start">
                            <div className="w-full md:w-2/3">
                                <span className="text-xs font-bold uppercase tracking-widest bg-gray-200 px-2 py-1 mb-2 inline-block border border-neo-black">
                                    Lista
                                </span>
                                <h3 className="text-3xl font-bold mb-3 font-titles group-hover:underline decoration-4 decoration-neo-yellow underline-offset-4">
                                    10 libros para leer antes de que se acabe el mundo
                                </h3>
                                <p className="text-lg text-gray-700 font-serif leading-relaxed">
                                    Una selección curada de distopías y utopías que te prepararán para cualquier escenario apocalíptico (o no).
                                </p>
                            </div>
                            <div className="w-full md:w-1/3 aspect-[4/3] bg-gray-200 relative border-2 border-neo-black shadow-[4px_4px_0px_0px_#000]">
                                <div className="absolute inset-0 flex items-center justify-center text-neo-black font-bold opacity-20 text-4xl">IMG</div>
                            </div>
                        </div>
                    </article>

                </div>

                {/* Right Column: Transtextos & Meme */}
                <div className="lg:col-span-4 bg-gray-50 p-6 flex flex-col gap-8">

                    {/* Transtextos Header */}
                    <div className="flex items-center justify-between border-b-2 border-neo-black pb-2">
                        <h4 className="font-black uppercase text-xl tracking-tighter">Transtextos</h4>
                        <Link href="/transtextos" className="text-sm font-bold underline decoration-2 decoration-neo-yellow hover:bg-neo-yellow transition-colors">
                            Ver todo
                        </Link>
                    </div>

                    {/* Featured Transtextos Story */}
                    {featuredStory ? (
                        <div className="transform hover:-rotate-1 transition-transform duration-300">
                            <FeaturedStoryCard
                                slug={featuredStory.slug}
                                date={featuredStory.date}
                                title={featuredStory.title}
                                summary={featuredStory.summary}
                                tags={featuredStory.tags}
                                author={featuredStory.author}
                                image={featuredStory.image}
                                bgColor={featuredStory.bgColor || '#faff00'}
                            />
                        </div>
                    ) : (
                        <div className="p-4 border-2 border-dashed border-gray-400 text-center text-gray-500">
                            Cargando historia destacada...
                        </div>
                    )}

                    {/* Meme Section */}
                    <div className="mt-8">
                        <div className="bg-neo-black text-neo-yellow px-4 py-2 font-black uppercase text-center text-lg mb-4 transform -skew-x-6 inline-block">
                            Meme de la semana
                        </div>
                        <div className="border-4 border-neo-black shadow-[8px_8px_0px_0px_#faff00] overflow-hidden">
                            {/* Placeholder Meme if no component available or just use a div */}
                            <div className="aspect-square bg-gray-800 flex items-center justify-center text-white p-4 text-center">
                                <p className="font-bold text-xl">Cuando te das cuenta que tienes 50 libros sin leer y compras 3 más.</p>
                            </div>
                        </div>
                    </div>

                    {/* Ad / Extra Space */}
                    <div className="mt-auto p-6 bg-neo-yellow border-2 border-neo-black text-center">
                        <p className="font-bold font-serif text-lg">¿Te gusta escribir?</p>
                        <Link href="/publica" className="mt-2 inline-block bg-neo-black text-white px-4 py-2 font-bold uppercase hover:scale-105 transition-transform">
                            Envíanos tu texto
                        </Link>
                    </div>

                </div>
            </div>
        </section>
    )
}
