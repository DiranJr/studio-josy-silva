"use client";

import { useState } from "react";
import Link from "next/link";

const SERVICE_IMAGES: Record<string, string> = {
    "Volume Brasileiro": "https://lh3.googleusercontent.com/aida-public/AB6AXuDF02QowsJkgA5HnZWbYYtPN_jPBrzyaJu2zDkZHeYHGZqR_EKQcrS4ZQjkLXjZgnTmgoXXGxmPPVtALRzr7iYDB-y0rmR5JxWd_wJ-gOM0a0OLKqAJG5kaZCDNOogUjWaAHlaiEe-EqYpqUjDYpk1AXy9U23K1TXJ-jzv-z2sUNd2PjbF928oipq-eF0BJ7XsONWuk5r5BGbi-SeP9bhsFImibzwkk_Xqf4EWel3k-RglMvBMF7ITqG1IPP_21dBi_F0E8aSLvD5FO",
    "Volume Egípcio": "https://lh3.googleusercontent.com/aida-public/AB6AXuDFcIjTQHUmDt7LkjR2HcMEDczi1RH7gpxfmhUJ0Z1S5sm0gAjCE0b3B5EYOwLOlMDtKNN9WBgGi4pZUCGW2dfTNVUmIxXeJRj51RCh9aDI-juzpPrp4mAQ3H-OyQE0D8EtkChT_CaOkdkOoe9bVqooOmPBy26nMFjWJS7d1Z2-bnOTOyUI10zLwso7u8WnsuRKxGvUhw7KkxQ43Qjw4m9AKdBKNNX5hAcAahnalwIzwPKIlWl-Bk1gDfU0anOIDIaFgDejVU39ZG4-",
    "Volume Luxo": "https://lh3.googleusercontent.com/aida-public/AB6AXuBwB5PGZJdWMbXhUZyK9xKruk0PSA-v92s-9r27jXSD74MYiARU7XcR3uhDmj-TuqHRmptYSQlLgCE8r5Gzjg2NGEeIbM17HcfDfd1fxsppkolmu2MFhRjlHmqG5SCT5sIi4iS8CL3M0jPHoXUkbTovwpVmHXI3FpNVTaiImtZGBjiYUsj48ekVVpuHXkBT3bdppb9foiripRqbthGlTpNP00SzG6p9I9GFZS90mrX9XrO7rYAG5ON0v2egeX8YOnvJqx552qcMF8l_",
    "Efeito Fox": "https://lh3.googleusercontent.com/aida-public/AB6AXuDhx2P2-E-owxDv2hqsNE45-ReOhMdddPnzTDc256l5OM9dlIbKOIDG_vpHVI-DeodZxVvE82Ezr0RXqx6zdZtx9ECixSv7BJAa5vNM4G0DIrJBO8rcZ3zX4cO_6Ct8T8TvJfOGCVOVrzjpkmaECwrp18bXZCsXmcukCKIpTRpoZGKiF00_h9p4gmr1PrhWdARA2tCe9Qrk3UcAPE9is7NzL-ZFQoWOvNDLwDU5kKOOvCPbQQ64Ueppko6BbXmIP3U9DggZUa5aC4uR"
};

const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDF02QowsJkgA5HnZWbYYtPN_jPBrzyaJu2zDkZHeYHGZqR_EKQcrS4ZQjkLXjZgnTmgoXXGxmPPVtALRzr7iYDB-y0rmR5JxWd_wJ-gOM0a0OLKqAJG5kaZCDNOogUjWaAHlaiEe-EqYpqUjDYpk1AXy9U23K1TXJ-jzv-z2sUNd2PjbF928oipq-eF0BJ7XsONWuk5r5BGbi-SeP9bhsFImibzwkk_Xqf4EWel3k-RglMvBMF7ITqG1IPP_21dBi_F0E8aSLvD5FO";

export default function ServiceGrid({ services }: { services: any[] }) {
    const [selectedService, setSelectedService] = useState<any>(null);

    const mainServices = services.filter(s => s.category === "Cilios");
    const otherServices = services.filter(s => s.category === "Outros");

    return (
        <>
            {/* Main Services Section */}
            <section className="py-24 px-6 max-w-7xl mx-auto" id="servicos">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">
                        Beleza &amp; Sofisticação
                    </span>
                    <h3 className="text-4xl font-extrabold mt-2">Nossos Serviços Premium</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {mainServices.map((service) => (
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
                                <button
                                    onClick={() => setSelectedService(service)}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-bold hover:bg-primary/90 transition-colors text-center inline-block"
                                >
                                    Agendar
                                </button>
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
                        {otherServices.map((service) => (
                            <button key={service.id} onClick={() => setSelectedService(service)} className="p-4 rounded-lg bg-soft-pink flex flex-col justify-center items-start group hover:bg-accent-pink transition-colors text-left relative overflow-hidden">
                                <div className="z-10 relative">
                                    <h5 className="font-bold text-lg">{service.name}</h5>
                                </div>
                                <span className="material-symbols-outlined text-primary/10 absolute -bottom-4 -right-4 size-24 text-[100px] z-0 pointer-events-none">
                                    auto_awesome
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Modal */}
            {selectedService && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative animate-in fade-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setSelectedService(null)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-900"
                        >
                            <span className="material-symbols-outlined">close</span>
                        </button>
                        <h2 className="text-2xl font-bold mb-2">Escolha o tipo do serviço</h2>
                        <p className="text-gray-600 mb-6 font-medium">{selectedService.name}</p>

                        <div className="flex flex-col gap-3">
                            {selectedService.options.map((opt: any) => (
                                <Link
                                    key={opt.id}
                                    href={`/agendar/horario?serviceOptionId=${opt.id}`}
                                    className="flex items-center justify-between p-4 rounded-xl border-2 border-primary/10 hover:border-primary hover:bg-primary-soft/50 transition-all group"
                                >
                                    <div>
                                        <p className="font-bold text-lg text-neutral-dark group-hover:text-primary">
                                            {opt.type === 'APPLICATION' ? 'Aplicação' : 'Manutenção'}
                                        </p>
                                        <p className="text-sm text-gray-500">
                                            {opt.durationMinutes} min • R$ {(opt.priceCents / 100).toFixed(2)}
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary/30 group-hover:text-primary">
                                        arrow_forward
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
