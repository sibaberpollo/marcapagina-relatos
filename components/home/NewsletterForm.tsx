export default function NewsletterForm() {
    return (
        <section className="w-full bg-neo-black text-neo-white py-16 md:py-24 border-t-4 border-neo-yellow">
            <div className="container mx-auto px-4 max-w-4xl text-center">
                <h2 className="text-4xl md:text-6xl font-black mb-6 font-titles tracking-tighter text-neo-yellow">
                    NO TE PIERDAS NADA
                </h2>
                <p className="text-xl md:text-2xl font-serif mb-10 text-gray-300">
                    Recibe los mejores relatos, reseñas y memes directamente en tu bandeja de entrada. Sin spam, solo literatura.
                </p>

                <form className="flex flex-col md:flex-row gap-4 max-w-xl mx-auto">
                    <input
                        type="email"
                        placeholder="tu@email.com"
                        className="flex-1 bg-neo-white text-neo-black px-6 py-4 text-lg font-bold border-4 border-transparent focus:border-neo-yellow focus:outline-none placeholder:text-gray-500"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-neo-yellow text-neo-black px-8 py-4 text-lg font-black uppercase tracking-wide border-4 border-neo-yellow hover:bg-transparent hover:text-neo-yellow transition-colors"
                    >
                        Suscribirse
                    </button>
                </form>

                <p className="mt-6 text-sm text-gray-500 font-mono">
                    * Al suscribirte aceptas nuestros términos y condiciones. Puedes darte de baja cuando quieras.
                </p>
            </div>
        </section>
    )
}
