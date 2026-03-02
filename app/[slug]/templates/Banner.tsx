"use client"

export default function Banner({ data, tenantName, defaultBanner, whatsapp, defaultDescription }: any) {
    const title = data?.title || tenantName;
    const subtitle = data?.subtitle || defaultDescription;
    const bannerUrl = defaultBanner || "/josy-silva.jpg";

    return (
        <section className="relative overflow-hidden bg-soft-pink py-16 px-6 lg:py-0 min-h-[90vh] flex items-center">
            {/* Background decoration */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-accent-pink/40 blur-2xl" />
            </div>

            <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
                {/* Left — Text */}
                <div className="flex flex-col items-start text-left order-2 lg:order-1 pb-8 lg:pb-0 lg:py-20">
                    <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-6">
                        <span className="material-symbols-outlined text-[16px]">auto_awesome</span>
                        Destaque
                    </span>

                    <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-deep-text leading-[1.05] mb-6">
                        {title.split(' ')[0]}<br />
                        <span className="text-primary">{title.split(' ').slice(1).join(' ')}</span>
                    </h1>

                    <p className="text-lg text-deep-text/70 max-w-lg mb-10 leading-relaxed font-medium">
                        {subtitle}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4">
                        <a href="#agendar" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all">
                            <span className="material-symbols-outlined">calendar_month</span>
                            Marcar meu horário
                        </a>
                        <a href="#servicos" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl text-lg font-bold border-2 border-primary/10 hover:border-primary/30 transition-all">
                            Ver serviços
                        </a>
                    </div>
                </div>

                {/* Right — Photo */}
                <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
                    <div className="absolute bottom-0 right-0 lg:right-0 w-[85%] h-[90%] bg-gradient-to-t from-primary/20 to-transparent rounded-3xl" />
                    <div className="relative z-10 w-72 md:w-96 lg:w-[420px]">
                        <img
                            src={bannerUrl}
                            alt={title}
                            className="w-full object-cover object-top rounded-3xl shadow-2xl shadow-primary/20"
                            style={{ maxHeight: "600px", objectPosition: "top center" }}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
