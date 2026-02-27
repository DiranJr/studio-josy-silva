import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";
import ServiceGrid from "./components/ServiceGrid";

const SERVICE_IMAGES: Record<string, string> = {
    "Volume Brasileiro": "https://lh3.googleusercontent.com/aida-public/AB6AXuDF02QowsJkgA5HnZWbYYtPN_jPBrzyaJu2zDkZHeYHGZqR_EKQcrS4ZQjkLXjZgnTmgoXXGxmPPVtALRzr7iYDB-y0rmR5JxWd_wJ-gOM0a0OLKqAJG5kaZCDNOogUjWaAHlaiEe-EqYpqUjDYpk1AXy9U23K1TXJ-jzv-z2sUNd2PjbF928oipq-eF0BJ7XsONWuk5r5BGbi-SeP9bhsFImibzwkk_Xqf4EWel3k-RglMvBMF7ITqG1IPP_21dBi_F0E8aSLvD5FO",
    "Volume Egípcio": "https://lh3.googleusercontent.com/aida-public/AB6AXuDFcIjTQHUmDt7LkjR2HcMEDczi1RH7gpxfmhUJ0Z1S5sm0gAjCE0b3B5EYOwLOlMDtKNN9WBgGi4pZUCGW2dfTNVUmIxXeJRj51RCh9aDI-juzpPrp4mAQ3H-OyQE0D8EtkChT_CaOkdkOoe9bVqooOmPBy26nMFjWJS7d1Z2-bnOTOyUI10zLwso7u8WnsuRKxGvUhw7KkxQ43Qjw4m9AKdBKNNX5hAcAahnalwIzwPKIlWl-Bk1gDfU0anOIDIaFgDejVU39ZG4-",
    "Volume Luxo": "https://lh3.googleusercontent.com/aida-public/AB6AXuBwB5PGZJdWMbXhUZyK9xKruk0PSA-v92s-9r27jXSD74MYiARU7XcR3uhDmj-TuqHRmptYSQlLgCE8r5Gzjg2NGEeIbM17HcfDfd1fxsppkolmu2MFhRjlHmqG5SCT5sIi4iS8CL3M0jPHoXUkbTovwpVmHXI3FpNVTaiImtZGBjiYUsj48ekVVpuHXkBT3bdppb9foiripRqbthGlTpNP00SzG6p9I9GFZS90mrX9XrO7rYAG5ON0v2egeX8YOnvJqx552qcMF8l_",
    "Efeito Fox": "https://lh3.googleusercontent.com/aida-public/AB6AXuDhx2P2-E-owxDv2hqsNE45-ReOhMdddPnzTDc256l5OM9dlIbKOIDG_vpHVI-DeodZxVvE82Ezr0RXqx6zdZtx9ECixSv7BJAa5vNM4G0DIrJBO8rcZ3zX4cO_6Ct8T8TvJfOGCVOVrzjpkmaECwrp18bXZCsXmcukCKIpTRpoZGKiF00_h9p4gmr1PrhWdARA2tCe9Qrk3UcAPE9is7NzL-ZFQoWOvNDLwDU5kKOOvCPbQQ64Ueppko6BbXmIP3U9DggZUa5aC4uR"
};

const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDF02QowsJkgA5HnZWbYYtPN_jPBrzyaJu2zDkZHeYHGZqR_EKQcrS4ZQjkLXjZgnTmgoXXGxmPPVtALRzr7iYDB-y0rmR5JxWd_wJ-gOM0a0OLKqAJG5kaZCDNOogUjWaAHlaiEe-EqYpqUjDYpk1AXy9U23K1TXJ-jzv-z2sUNd2PjbF928oipq-eF0BJ7XsONWuk5r5BGbi-SeP9bhsFImibzwkk_Xqf4EWel3k-RglMvBMF7ITqG1IPP_21dBi_F0E8aSLvD5FO";

export default async function Home() {
    const services = await prisma.service.findMany({
        where: { active: true },
        include: {
            options: {
                where: { active: true }
            }
        },
        orderBy: { createdAt: "asc" }
    });

    return (
        <main>
            {/* Hero Section */}
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
                            Lash Designer Especialista
                        </span>

                        <h1 className="text-5xl md:text-6xl xl:text-7xl font-extrabold text-deep-text leading-[1.05] mb-6">
                            Studio<br />
                            <span className="text-primary">Josy Silva</span>
                        </h1>

                        <p className="text-lg text-deep-text/70 max-w-lg mb-10 leading-relaxed font-medium">
                            Especialista em extensões de cílios e design de sobrancelhas de luxo. Realce sua beleza natural com sofisticação e o cuidado que você merece.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4">
                            <a href="#servicos" className="inline-flex items-center justify-center gap-2 bg-primary text-white px-8 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 hover:-translate-y-0.5 transition-all">
                                <span className="material-symbols-outlined">calendar_month</span>
                                Marcar meu horário
                            </a>
                            <a href="#servicos" className="inline-flex items-center justify-center gap-2 bg-white text-primary px-8 py-4 rounded-xl text-lg font-bold border-2 border-primary/10 hover:border-primary/30 transition-all">
                                Ver serviços
                            </a>
                        </div>

                        {/* Trust badges */}
                        <div className="flex flex-wrap gap-6 mt-12 pt-8 border-t border-primary/10 w-full">
                            {[
                                { icon: "verified", text: "Volume Brasileiro" },
                                { icon: "star", text: "Volume Luxo" },
                                { icon: "spa", text: "Brow Lamination" },
                            ].map(b => (
                                <div key={b.icon} className="flex items-center gap-2 text-sm text-deep-text/60 font-medium">
                                    <span className="material-symbols-outlined text-primary text-[18px]">{b.icon}</span>
                                    {b.text}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Photo */}
                    <div className="relative flex justify-center lg:justify-end order-1 lg:order-2">
                        {/* Pink gradient backdrop */}
                        <div className="absolute bottom-0 right-0 lg:right-0 w-[85%] h-[90%] bg-gradient-to-t from-primary/20 to-transparent rounded-3xl" />

                        {/* Photo */}
                        <div className="relative z-10 w-72 md:w-96 lg:w-[420px]">
                            <img
                                src="/josy-silva.jpg"
                                alt="Josy Silva — Especialista em Extensão de Cílios"
                                className="w-full object-cover object-top rounded-3xl shadow-2xl shadow-primary/20"
                                style={{ maxHeight: "600px", objectPosition: "top center" }}
                            />

                            {/* Floating badge */}
                            <div className="absolute -left-6 bottom-10 bg-white rounded-2xl shadow-xl shadow-primary/10 px-4 py-3 flex items-center gap-3 border border-primary/5">
                                <div className="bg-green-100 rounded-full p-2">
                                    <span className="material-symbols-outlined text-green-600 text-[18px]">check_circle</span>
                                </div>
                                <div>
                                    <p className="font-extrabold text-deep-text text-sm">+500 clientes</p>
                                    <p className="text-deep-text/50 text-xs">atendidas com sucesso</p>
                                </div>
                            </div>

                            {/* Top badge */}
                            <div className="absolute -right-4 top-8 bg-primary text-white rounded-2xl shadow-xl px-4 py-3 text-center">
                                <p className="font-extrabold text-sm">⭐ 5.0</p>
                                <p className="text-white/80 text-xs">Avaliação</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <ServiceGrid services={services} />

            {/* Information & Rules Section */}
            <section className="py-24 px-6 bg-background-light" id="regras">
                <div className="max-w-4xl mx-auto">
                    <div className="bg-accent-pink rounded-lg p-10 md:p-16 text-center shadow-2xl shadow-primary/10">
                        <h3 className="text-3xl font-extrabold mb-8 flex items-center justify-center gap-3">
                            <span className="material-symbols-outlined text-primary text-4xl">
                                info
                            </span>
                            Informações Importantes
                        </h3>
                        <div className="grid gap-6 text-left max-w-lg mx-auto mb-12">
                            <div className="flex items-center gap-4 bg-white/50 p-4 rounded-lg">
                                <span className="material-symbols-outlined text-primary">
                                    person_off
                                </span>
                                <p className="font-semibold text-deep-text">
                                    Proibido trazer acompanhantes e crianças.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 bg-white/50 p-4 rounded-lg">
                                <span className="material-symbols-outlined text-primary">
                                    payments
                                </span>
                                <p className="font-semibold text-deep-text">
                                    Taxa de R$ 40,00 para agendamento.
                                </p>
                            </div>
                            <div className="flex items-center gap-4 bg-white/50 p-4 rounded-lg">
                                <span className="material-symbols-outlined text-primary">
                                    schedule
                                </span>
                                <p className="font-semibold text-deep-text">
                                    Atendimento somente com horário marcado.
                                </p>
                            </div>
                        </div>
                        <div id="contato">
                            <button className="bg-emerald-500 text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-3 mx-auto">
                                <svg className="size-6" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.246 2.248 3.484 5.232 3.483 8.411-.003 6.557-5.338 11.892-11.893 11.892-1.997-.001-3.951-.5-5.688-1.448l-6.308 1.657zm6.215-3.565c1.556.923 3.064 1.385 4.671 1.386 5.318 0 9.646-4.328 9.648-9.648.001-2.576-1.003-4.998-2.827-6.824-1.824-1.825-4.246-2.828-6.822-2.829-5.317 0-9.645 4.328-9.648 9.648-.001 1.916.558 3.447 1.491 5.06l-.994 3.633 3.731-.979zm11.534-7.53c-.303-.152-1.791-.883-2.07-.985-.278-.102-.481-.153-.683.153-.203.305-.785.985-.963 1.188-.177.203-.355.228-.658.076-.304-.152-1.282-.473-2.441-1.506-.902-.804-1.51-1.796-1.687-2.1-.178-.305-.019-.47.133-.621.136-.136.304-.355.456-.533.151-.178.203-.305.304-.508.102-.203.051-.381-.025-.533-.076-.152-.683-1.644-.937-2.254-.247-.595-.499-.514-.683-.524l-.583-.009c-.203 0-.532.076-.811.381-.278.305-1.064 1.041-1.064 2.539 0 1.497 1.089 2.943 1.241 3.146.152.203 2.144 3.274 5.19 4.59.725.313 1.291.5 1.731.64.729.231 1.391.198 1.916.12.585-.087 1.791-.733 2.044-1.442.254-.71.254-1.32.177-1.442-.076-.122-.278-.19-.581-.342z"></path>
                                </svg>
                                Agendar via WhatsApp
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
