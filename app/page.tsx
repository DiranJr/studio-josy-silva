import Link from "next/link";
import Image from "next/image";

export default function SaaSLanding() {
    return (
        <div className="min-h-screen bg-gray-50 selection:bg-primary/20">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-deep-text font-black text-xl tracking-tight">
                        <span className="material-symbols-outlined text-primary text-3xl">auto_awesome</span>
                        Beleza<span className="text-primary">Pro</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="text-sm font-semibold text-gray-600 hover:text-primary transition">Login</Link>
                        <Link href="/signup" className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 transition-all">
                            Criar meu site
                        </Link>
                    </div>
                </div>
            </header>

            {/* Hero */}
            <main>
                <section className="pt-24 pb-32 px-6 text-center overflow-hidden relative">
                    {/* Decorators */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10" />

                    <div className="max-w-4xl mx-auto">
                        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary font-bold text-xs uppercase tracking-widest px-4 py-2 rounded-full mb-8">
                            A Plataforma Definitiva
                        </span>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-deep-text tracking-tight leading-[1.1] mb-8">
                            Site pago + Agenda Online <br className="hidden md:block" />
                            <span className="text-primary relative">
                                para o seu Negócio.
                                <svg className="absolute w-full h-3 -bottom-2 left-0 text-accent-pink opacity-50" viewBox="0 0 100 10" preserveAspectRatio="none"><path d="M0 5 Q 50 15 100 5" stroke="currentColor" strokeWidth="4" fill="none" /></svg>
                            </span>
                        </h1>

                        <p className="text-xl text-gray-500 mb-12 max-w-2xl mx-auto leading-relaxed">
                            Crie sua conta em 1 minuto. Seu site entra no ar automaticamente integrado com o CRM para profissionais de beleza, sem configurações difíceis.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <Link href="/signup" className="w-full sm:w-auto bg-primary text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">rocket_launch</span>
                                Criar meu site agora
                            </Link>
                        </div>
                    </div>
                </section>

                {/* Features Highlights */}
                <section className="py-24 bg-white border-y border-gray-100">
                    <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-12">
                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-6 text-3xl">
                                <span className="material-symbols-outlined text-inherit">web</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-deep-text">Site Instantâneo</h3>
                            <p className="text-gray-500 leading-relaxed">Editor Live Preview. Altere fotos, textos e blocos do seu site público com um clique.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center mx-auto mb-6 text-3xl">
                                <span className="material-symbols-outlined text-inherit">calendar_month</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-deep-text">Agenda Online</h3>
                            <p className="text-gray-500 leading-relaxed">Seu cliente agenda horários direto pelo site, liberando mais do seu tempo para focar no trabalho.</p>
                        </div>

                        <div className="text-center">
                            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-6 text-3xl">
                                <span className="material-symbols-outlined text-inherit">monitoring</span>
                            </div>
                            <h3 className="text-xl font-bold mb-3 text-deep-text">CRM Completo</h3>
                            <p className="text-gray-500 leading-relaxed">Tenha controle total do seu financeiro e serviços sem complicação nem planilhas.</p>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}
