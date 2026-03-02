"use client"

import ServiceGrid from "@/app/components/ServiceGrid";

export default function Services({ data, services, tenantSlug }: { data: any, services: any[], tenantSlug: string }) {
    const title = data?.title || "Nossos Serviços";
    const description = data?.description || "Confira os procedimentos que oferecemos";

    return (
        <section id="servicos" className="py-24 px-6 bg-white relative">
            <div className="max-w-7xl mx-auto mb-16 text-center">
                <span className="text-primary font-bold tracking-widest uppercase text-sm mb-4 block">Especialidades</span>
                <h2 className="text-4xl md:text-5xl font-extrabold text-deep-text mb-6">{title}</h2>
                <p className="text-lg text-deep-text/60 max-w-2xl mx-auto">{description}</p>
            </div>
            <ServiceGrid services={services} tenantSlug={tenantSlug} />
        </section>
    );
}
