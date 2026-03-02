import Banner from "../templates/Banner";
import Services from "../templates/Services";
import Gallery from "../templates/Gallery";
import CTA from "../templates/CTA";

export default function NailsTemplate({ sections, tenant, services, galleries }: any) {
    // A distinct aesthetic wrapper for Nails, overriding global CSS variables or adding custom wrapper classes.
    return (
        <main className="theme-nails min-h-screen bg-rose-50/30">
            {/* Custom wrapper demonstrating different spacing/containment */}
            <div className="max-w-7xl mx-auto xl:px-8 xl:py-12">
                <div className="bg-white xl:rounded-[40px] xl:shadow-2xl overflow-hidden">
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
                </div>
            </div>
        </main>
    );
}
