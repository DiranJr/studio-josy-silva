import Banner from "../templates/Banner";
import Services from "../templates/Services";
import Gallery from "../templates/Gallery";
import CTA from "../templates/CTA";

export default function BrowTemplate({ sections, tenant, services, galleries }: any) {
    // Minimalist, high-end dark-themed wrapper for Brow designers
    return (
        <main className="theme-brow bg-stone-900 text-stone-100 min-h-screen">
            {sections.map((section: any) => {
                const data = section.content;

                if (section.type === "banner") {
                    return <div key={section.id} className="contrast-125 grayscale-[30%]"><Banner
                        data={data}
                        tenantName={tenant.name}
                        defaultDescription={tenant.siteSettings?.description}
                        defaultBanner={tenant.siteSettings?.banner}
                        whatsapp={tenant.siteSettings?.whatsapp}
                    /></div>
                }

                if (section.type === "services") {
                    return <div key={section.id} className="py-8"><Services
                        data={data}
                        services={services}
                        tenantSlug={tenant.slug}
                    /></div>
                }

                if (section.type === "gallery") {
                    return <Gallery
                        key={section.id}
                        data={data}
                        galleries={galleries}
                    />
                }

                if (section.type === "cta") {
                    return <div key={section.id} className="opacity-90"><CTA
                        data={data}
                        defaultWhatsapp={tenant.siteSettings?.whatsapp}
                    /></div>
                }

                return null;
            })}
        </main>
    );
}
