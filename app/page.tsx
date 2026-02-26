import Image from "next/image";
import Link from "next/link";
import prisma from "@/lib/prisma";

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
        orderBy: { createdAt: "asc" }
    });

    return (
        <main>
            {/* Hero Section */}
            <section className="bg-soft-pink py-20 px-6">
                <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
                    <div className="size-40 rounded-full border-4 border-white shadow-xl mb-8 overflow-hidden bg-white">
                        <img
                            alt="Josy Silva Profile"
                            className="w-full h-full object-cover"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnSLptdcmnrXyh3Ae9kyUVfsATmUb4lEZPnIEQPVhtrGPottMbl6cofMJ0Ici80P_5D0Va119wGHSCQwixd_HaVWyB2kRGcCALXX8XzCWc9RVQpL7e_5FatbkxmCjAnMB4fFofaPLXoPrIWLtnHqpK4LdJ9Ve-O9JlTBJqxFYOik04tK8g1dYtBT4U0BOxSe1XDEGlW81vLXHeLSIej8akiXKzRfzt3QhzjP6IJPXqCUnPufNBBMuJnp3zVVrb5i6kFHQ-ZRTbf_Mj"
                        />
                    </div>
                    <h2 className="text-5xl md:text-6xl font-extrabold text-deep-text mb-6">
                        Studio Josy Silva
                    </h2>
                    <p className="text-lg md:text-xl text-deep-text/70 max-w-2xl mb-10 leading-relaxed font-medium">
                        Especialista em extensões de cílios e design de sobrancelhas de luxo. Realce sua beleza natural com sofisticação e o cuidado que você merece.
                    </p>
                    <a href="#servicos" className="bg-primary text-white px-10 py-4 rounded-xl text-lg font-bold shadow-xl shadow-primary/30 hover:bg-primary/90 transition-all">
                        Marcar meu horário
                    </a>
                </div>
            </section>

            {/* Main Services Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto" id="servicos">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">
                        Beleza &amp; Sofisticação
                    </span>
                    <h3 className="text-4xl font-extrabold mt-2">Nossos Serviços Premium</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {services.map((service) => (
                        <div key={service.id} className="bg-white rounded-lg shadow-xl shadow-primary/5 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform border border-primary/5">
                            <div className="h-56 bg-primary/10 overflow-hidden">
                                <img
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                    src={SERVICE_IMAGES[service.name] || DEFAULT_IMAGE}
                                />
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <h4 className="text-xl font-bold mb-2">{service.name}</h4>
                                <p className="text-sm text-deep-text/60 mb-6 flex-grow">
                                    {service.description || "Serviço especializado de extensão de cílios."}
                                </p>
                                <div className="flex gap-2 mb-4">
                                    <span className="bg-accent-pink text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                                        {service.durationMinutes} min
                                    </span>
                                    <span className="bg-accent-pink text-primary text-[10px] font-black px-2 py-1 rounded-full uppercase tracking-tighter">
                                        R$ {(service.priceCents / 100).toFixed(2)}
                                    </span>
                                </div>
                                <Link
                                    href={`/agendar/horario?serviceId=${service.id}`}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors text-center inline-block"
                                >
                                    Agendar
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Complementary Services Section */}
            <section className="bg-white py-24 px-6 border-y border-primary/5">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                        <div>
                            <span className="text-primary font-bold tracking-widest uppercase text-sm">
                                Outros Serviços
                            </span>
                            <h3 className="text-4xl font-extrabold mt-2">Design &amp; Cuidados</h3>
                        </div>
                        <p className="text-deep-text/60 max-w-sm">
                            Complemente seu olhar com nossos serviços especializados de sobrancelhas e epilação.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="p-6 rounded-lg bg-soft-pink flex justify-between items-center group hover:bg-accent-pink transition-colors">
                            <div>
                                <h5 className="font-bold text-lg">Design Simples</h5>
                                <span className="text-primary font-black text-xl">R$ 25</span>
                            </div>
                            <span className="material-symbols-outlined text-primary size-10 flex items-center justify-center bg-white rounded-full group-hover:scale-110 transition-transform">
                                brush
                            </span>
                        </div>
                        <div className="p-6 rounded-lg bg-soft-pink flex justify-between items-center group hover:bg-accent-pink transition-colors">
                            <div>
                                <h5 className="font-bold text-lg">Design com Henna</h5>
                                <span className="text-primary font-black text-xl">R$ 45</span>
                            </div>
                            <span className="material-symbols-outlined text-primary size-10 flex items-center justify-center bg-white rounded-full group-hover:scale-110 transition-transform">
                                ink_pen
                            </span>
                        </div>
                        <div className="p-6 rounded-lg bg-soft-pink flex justify-between items-center group hover:bg-accent-pink transition-colors">
                            <div>
                                <h5 className="font-bold text-lg">Epilação de Buço</h5>
                                <span className="text-primary font-black text-xl">R$ 10</span>
                            </div>
                            <span className="material-symbols-outlined text-primary size-10 flex items-center justify-center bg-white rounded-full group-hover:scale-110 transition-transform">
                                face
                            </span>
                        </div>
                        <div className="p-6 rounded-lg bg-soft-pink flex justify-between items-center group hover:bg-accent-pink transition-colors">
                            <div>
                                <h5 className="font-bold text-lg">Brow Lamination</h5>
                                <span className="text-primary font-black text-xl">R$ 110</span>
                            </div>
                            <span className="material-symbols-outlined text-primary size-10 flex items-center justify-center bg-white rounded-full group-hover:scale-110 transition-transform">
                                auto_awesome
                            </span>
                        </div>
                    </div>
                </div>
            </section>

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
                                    Sinal de R$ 40,00 para agendamento.
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
