"use client";

import { useState } from "react";
import Link from "next/link";

const SERVICE_IMAGES: Record<string, string> = {
    "Volume Brasileiro": "https://lh3.googleusercontent.com/aida-public/AB6AXuDF02QowsJkgA5HnZWbYYtPN_jPBrzyaJu2zDkZHeYHGZqR_EKQcrS4ZQjkLXjZgnTmgoXXGxmPPVtALRzr7iYDB-y0rmR5JxWd_wJ-gOM0a0OLKqAJG5kaZCDNOogUjWaAHlaiEe-EqYpqUjDYpk1AXy9U23K1TXJ-jzv-z2sUNd2PjbF928oipq-eF0BJ7XsONWuk5r5BGbi-SeP9bhsFImibzwkk_Xqf4EWel3k-RglMvBMF7ITqG1IPP_21dBi_F0E8aSLvD5FO",
    "Volume Egípcio": "https://lh3.googleusercontent.com/aida-public/AB6AXuDFcIjTQHUmDt7LkjR2HcMEDczi1RH7gpxfmhUJ0Z1S5sm0gAjCE0b3B5EYOwLOlMDtKNN9WBgGi4pZUCGW2dfTNVUmIxXeJRj51RCh9aDI-juzpPrp4mAQ3H-OyQE0D8EtkChT_CaOkdkOoe9bVqooOmPBy26nMFjWJS7d1Z2-bnOTOyUI10zLwso7u8WnsuRKxGvUhw7KkxQ43Qjw4m9AKdBKNNX5hAcAahnalwIzwPKIlWl-Bk1gDfU0anOIDIaFgDejVU39ZG4-",
    "Volume Fox": "https://lh3.googleusercontent.com/aida-public/AB6AXuDhx2P2-E-owxDv2hqsNE45-ReOhMdddPnzTDc256l5OM9dlIbKOIDG_vpHVI-DeodZxVvE82Ezr0RXqx6zdZtx9ECixSv7BJAa5vNM4G0DIrJBO8rcZ3zX4cO_6Ct8T8TvJfOGCVOVrzjpkmaECwrp18bXZCsXmcukCKIpTRpoZGKiF00_h9p4gmr1PrhWdARA2tCe9Qrk3UcAPE9is7NzL-ZFQoWOvNDLwDU5kKOOvCPbQQ64Ueppko6BbXmIP3U9DggZUa5aC4uR",
    "Volume Luxo": "https://lh3.googleusercontent.com/aida-public/AB6AXuBwB5PGZJdWMbXhUZyK9xKruk0PSA-v92s-9r27jXSD74MYiARU7XcR3uhDmj-TuqHRmptYSQlLgCE8r5Gzjg2NGEeIbM17HcfDfd1fxsppkolmu2MFhRjlHmqG5SCT5sIi4iS8CL3M0jPHoXUkbTovwpVmHXI3FpNVTaiImtZGBjiYUsj48ekVVpuHXkBT3bdppb9foiripRqbthGlTpNP00SzG6p9I9GFZS90mrX9XrO7rYAG5ON0v2egeX8YOnvJqx552qcMF8l_",
};

const DEFAULT_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuDF02QowsJkgA5HnZWbYYtPN_jPBrzyaJu2zDkZHeYHGZqR_EKQcrS4ZQjkLXjZgnTmgoXXGxmPPVtALRzr7iYDB-y0rmR5JxWd_wJ-gOM0a0OLKqAJG5kaZCDNOogUjWaAHlaiEe-EqYpqUjDYpk1AXy9U23K1TXJ-jzv-z2sUNd2PjbF928oipq-eF0BJ7XsONWuk5r5BGbi-SeP9bhsFImibzwkk_Xqf4EWel3k-RglMvBMF7ITqG1IPP_21dBi_F0E8aSLvD5FO";

export default function ServiceGrid({ services }: { services: any[] }) {
    const [selectedService, setSelectedService] = useState<any>(null);

    const ciliосServices = services.filter((s) => s.category === "Cilios");
    const otherServices = services.filter((s) => s.category !== "Cilios");

    const activeOptions = (service: any) =>
        (service.options || []).filter((o: any) => o.active);

    const applicationOption = (service: any) =>
        activeOptions(service).find((o: any) => o.type === "APPLICATION");

    return (
        <>
            {/* ─── Cílios Section ─────────────────────────────────────── */}
            <section className="py-24 px-6 max-w-7xl mx-auto" id="servicos">
                <div className="text-center mb-16">
                    <span className="text-primary font-bold tracking-widest uppercase text-sm">
                        Beleza &amp; Sofisticação
                    </span>
                    <h3 className="text-4xl font-extrabold mt-2">Nossos Serviços Premium</h3>
                    <p className="text-deep-text/60 mt-3 max-w-lg mx-auto">
                        Escolha um serviço e selecione entre <strong>Aplicação</strong> ou <strong>Manutenção</strong>.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ciliосServices.map((service) => {
                        const appOpt = applicationOption(service);
                        return (
                            <div
                                key={service.id}
                                className="bg-white rounded-2xl shadow-xl shadow-primary/5 overflow-hidden flex flex-col hover:-translate-y-1 transition-transform border border-primary/5"
                            >
                                <div className="h-56 bg-primary/10 overflow-hidden">
                                    <img
                                        alt={service.name}
                                        className="w-full h-full object-cover"
                                        src={SERVICE_IMAGES[service.name] || DEFAULT_IMAGE}
                                    />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h4 className="text-xl font-bold mb-1">{service.name}</h4>
                                    <p className="text-sm text-deep-text/60 mb-4 flex-grow">
                                        {service.description || "Serviço especializado de extensão de cílios."}
                                    </p>
                                    {appOpt && (
                                        <p className="text-primary font-bold text-sm mb-4">
                                            A partir de R$ {(appOpt.priceCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                        </p>
                                    )}
                                    <button
                                        onClick={() => setSelectedService(service)}
                                        className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors text-center"
                                    >
                                        Agendar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ─── Outros Serviços Section ─────────────────────────────── */}
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
                            Complemente seu look com nossos serviços especializados.
                        </p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {otherServices.map((service) => {
                            const appOpt = applicationOption(service);
                            const hasMaintenance = activeOptions(service).some((o: any) => o.type === "MAINTENANCE");
                            return (
                                <button
                                    key={service.id}
                                    onClick={() => setSelectedService(service)}
                                    className="p-5 rounded-2xl bg-soft-pink flex flex-col justify-between items-start group hover:bg-accent-pink transition-colors text-left relative overflow-hidden shadow-sm"
                                >
                                    <div className="z-10 relative w-full">
                                        <h5 className="font-bold text-lg mb-1">{service.name}</h5>
                                        {appOpt && (
                                            <p className="text-primary font-bold text-sm">
                                                R$ {(appOpt.priceCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </p>
                                        )}
                                        <p className="text-xs text-deep-text/50 mt-2">
                                            {hasMaintenance ? "Aplicação & Manutenção" : "Somente Aplicação"}
                                        </p>
                                    </div>
                                    <span className="material-symbols-outlined text-primary/10 absolute -bottom-4 -right-4 size-24 text-[100px] z-0 pointer-events-none">
                                        auto_awesome
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ─── Service Option Modal ────────────────────────────────── */}
            {selectedService && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
                    onClick={(e) => { if (e.target === e.currentTarget) setSelectedService(null); }}
                >
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md relative overflow-hidden">
                        {/* Modal header */}
                        <div className="bg-soft-pink px-6 pt-8 pb-6 text-center border-b border-primary/10">
                            <button
                                onClick={() => setSelectedService(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-gray-800 transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                            <span className="material-symbols-outlined text-primary text-4xl mb-2 block">
                                auto_awesome
                            </span>
                            <h2 className="text-2xl font-extrabold text-deep-text">{selectedService.name}</h2>
                            <p className="text-deep-text/60 text-sm mt-1">Escolha a modalidade do serviço</p>
                        </div>

                        {/* Options */}
                        <div className="p-6 flex flex-col gap-4">
                            {activeOptions(selectedService).map((opt: any) => (
                                <Link
                                    key={opt.id}
                                    href={`/agendar/horario?serviceOptionId=${opt.id}`}
                                    className="flex items-center justify-between p-4 rounded-2xl border-2 border-primary/10 hover:border-primary hover:bg-primary/5 transition-all group"
                                >
                                    <div>
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className={`inline-block w-2 h-2 rounded-full ${opt.type === 'APPLICATION' ? 'bg-primary' : 'bg-accent-pink'}`} />
                                            <p className="font-extrabold text-lg text-neutral-dark group-hover:text-primary">
                                                {opt.type === "APPLICATION" ? "✨ Aplicação" : "🔄 Manutenção"}
                                            </p>
                                        </div>
                                        <div className="flex gap-3 text-sm text-gray-500 mt-0.5">
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">schedule</span>
                                                {opt.durationMinutes} min
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <span className="material-symbols-outlined text-[14px]">payments</span>
                                                R$ {(opt.priceCents / 100).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                                            </span>
                                            {opt.depositCents > 0 && (
                                                <span className="flex items-center gap-1 text-primary">
                                                    <span className="material-symbols-outlined text-[14px]">lock</span>
                                                    Taxa de Reserva R$ {(opt.depositCents / 100).toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <span className="material-symbols-outlined text-primary/30 group-hover:text-primary text-2xl">
                                        arrow_forward
                                    </span>
                                </Link>
                            ))}

                            {activeOptions(selectedService).length === 0 && (
                                <p className="text-center text-gray-500 py-4">Nenhuma opção disponível no momento.</p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
