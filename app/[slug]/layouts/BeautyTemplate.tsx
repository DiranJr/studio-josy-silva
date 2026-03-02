import Banner from "../templates/Banner";
import Services from "../templates/Services";
import Gallery from "../templates/Gallery";
import CTA from "../templates/CTA";

export default function BeautyTemplate({ sections, tenant, services, galleries }: any) {
    return (
        <main className="theme-beauty">
            {sections.map((section: any) => {
                const data = section.content;

                if (section.type === "banner") {
                    return <Banner
                        key={section.id}
                        data={data}
                        tenantName={tenant.name}
                        defaultDescription={tenant.siteSettings?.description}
                        defaultBanner={tenant.siteSettings?.banner}
                        whatsapp={tenant.siteSettings?.whatsapp}
                    />
                }

                if (section.type === "services") {
                    return <Services
                        key={section.id}
                        data={data}
                        services={services}
                        tenantSlug={tenant.slug}
                    />
                }

                if (section.type === "gallery") {
                    return <Gallery
                        key={section.id}
                        data={data}
                        galleries={galleries}
                    />
                }

                if (section.type === "cta") {
                    return <CTA
                        key={section.id}
                        data={data}
                        defaultWhatsapp={tenant.siteSettings?.whatsapp}
                    />
                }

                return null;
            })}
        </main>
    );
}
