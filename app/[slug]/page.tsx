import prisma from "@/lib/prisma";
import LivePreviewWrapper from "./components/LivePreviewWrapper";

export const dynamic = "force-dynamic";

export default async function Home({ params }: { params: { slug: string } }) {
    const { slug } = params;

    const tenant = await prisma.tenant.findUnique({
        where: { slug },
        include: {
            siteSettings: true,
            galleries: true,
            siteSections: {
                orderBy: { order: "asc" }
            }
        }
    });

    if (!tenant) {
        return <main className="min-h-screen flex items-center justify-center bg-gray-50"><h1 className="text-2xl font-bold">Página não encontrada (404)</h1></main>;
    }

    const services = await prisma.service.findMany({
        where: { active: true, tenantId: tenant.id },
        include: {
            options: {
                where: { active: true }
            }
        },
        orderBy: { createdAt: "asc" }
    });

    const { siteSections, galleries } = tenant;

    return (
        <LivePreviewWrapper
            initialSections={siteSections}
            tenant={tenant}
            services={services}
            galleries={galleries}
        />
    );
}
