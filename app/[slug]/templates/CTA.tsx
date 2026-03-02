"use client"

export default function CTA({ data, defaultWhatsapp }: any) {
    const title = data?.title || "Informações Importantes";
    const buttonText = data?.buttonText || "Agendar via WhatsApp";
    const whatsapp = data?.whatsapp || defaultWhatsapp;

    const wppLink = whatsapp ? `https://wa.me/${whatsapp}?text=Olá,%20gostaria%20de%20agendar%20um%20horário!` : "#agendar";

    return (
        <section className="py-24 px-6 bg-background-light" id="agendar">
            <div className="max-w-4xl mx-auto">
                <div className="bg-accent-pink rounded-3xl p-10 md:p-16 text-center shadow-2xl shadow-primary/10 border border-primary/10">
                    <h3 className="text-3xl md:text-4xl font-extrabold mb-8 flex items-center justify-center gap-3 text-deep-text">
                        <span className="material-symbols-outlined text-primary text-4xl">info</span>
                        {title}
                    </h3>
                    <div className="grid gap-6 text-left max-w-lg mx-auto mb-12">
                        <div className="flex items-center gap-4 bg-white/60 p-5 rounded-2xl">
                            <span className="material-symbols-outlined text-primary">person_off</span>
                            <p className="font-semibold text-deep-text">Proibido trazer acompanhantes e crianças.</p>
                        </div>
                        <div className="flex items-center gap-4 bg-white/60 p-5 rounded-2xl">
                            <span className="material-symbols-outlined text-primary">payments</span>
                            <p className="font-semibold text-deep-text">Sinal necessário para confirmação.</p>
                        </div>
                    </div>
                    <div>
                        <a href={wppLink} target="_blank" rel="noopener noreferrer" className="bg-emerald-500 text-white px-10 py-5 rounded-2xl text-xl font-bold shadow-xl shadow-emerald-500/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-3 mx-auto max-w-md">
                            <svg className="size-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163..."></path>
                            </svg>
                            {buttonText}
                        </a>
                    </div>
                </div>
            </div>
        </section>
    );
}
