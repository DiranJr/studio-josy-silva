"use client"

export default function Gallery({ data, galleries }: any) {
    const title = data?.title || "Galeria de Trabalhos";
    const description = data?.description || "Veja nossos melhores resultados";

    if (!galleries || galleries.length === 0) return null;

    return (
        <section id="galeria" className="py-24 px-6 bg-gray-50">
            <div className="max-w-7xl mx-auto">
                <div className="mb-16 text-center">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Portfólio</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-deep-text mb-6">{title}</h2>
                    <p className="text-lg text-deep-text/60 max-w-2xl mx-auto">{description}</p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {galleries.map((img: any) => (
                        <div key={img.id} className="relative aspect-square rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition duration-300 group">
                            <img
                                src={img.imageUrl}
                                alt="Trabalho"
                                className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
