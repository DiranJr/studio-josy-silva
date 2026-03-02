const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    console.log('Clearing old data...')
    await prisma.client.deleteMany()
    await prisma.service.deleteMany()
    await prisma.user.deleteMany()
    await prisma.tenant.deleteMany()

    // 1. Tenant: Josy
    const tenantJosy = await prisma.tenant.create({
        data: {
            name: 'Studio Josy Silva',
            slug: 'josy',
            siteSettings: {
                create: {
                    title: 'Studio Josy Silva',
                    description: 'Especialista em extensões de cílios e design de sobrancelhas de luxo. Realce sua beleza natural com sofisticação.',
                    whatsapp: '5511999999999'
                }
            },
            siteSections: {
                create: [
                    { type: 'banner', order: 0, content: { title: 'Studio Josy Silva', subtitle: 'Especialista em extensões de cílios de luxo.' } },
                    { type: 'services', order: 1, content: { title: 'Nossos Serviços', description: 'Confira os procedimentos disponíveis.' } },
                    { type: 'gallery', order: 2, content: { title: 'Galeria', description: 'Veja alguns de nossos trabalhos.' } },
                    { type: 'cta', order: 3, content: { title: 'Agende seu horário', buttonText: 'Agendar via WhatsApp', whatsapp: '5511999999999' } }
                ]
            }
        }
    })

    await prisma.user.create({
        data: {
            tenantId: tenantJosy.id,
            name: 'Josy Silva',
            email: 'josy@test.com',
            passwordHash: await bcrypt.hash('123456', 10),
            role: 'ADMIN'
        }
    })

    // 2. Tenant: Bianca
    const tenantBianca = await prisma.tenant.create({
        data: {
            name: 'Bianca Brow',
            slug: 'bianca',
            siteSettings: {
                create: {
                    title: 'Bianca Brow - Beauty Lounge',
                    description: 'Cuidados dedicados e focados no olhar. Realizamos técnicas inovadoras para Brow Lamination.',
                    whatsapp: '5511888888888'
                }
            },
            siteSections: {
                create: [
                    { type: 'banner', order: 0, content: { title: 'Bianca Brow', subtitle: 'Beauty Lounge & Brow Lamination.' } },
                    { type: 'services', order: 1, content: { title: 'Design de Sobrancelha', description: 'Técnicas exclusivas para o seu olhar.' } },
                    { type: 'gallery', order: 2, content: { title: 'Trabalhos', description: 'Resultados reais.' } },
                    { type: 'cta', order: 3, content: { title: 'Agendar Horário', buttonText: 'Fale Conosco', whatsapp: '5511888888888' } }
                ]
            }
        }
    })

    await prisma.user.create({
        data: {
            tenantId: tenantBianca.id,
            name: 'Bianca',
            email: 'bianca@test.com',
            passwordHash: await bcrypt.hash('123456', 10),
            role: 'ADMIN'
        }
    })

    console.log('Seed completed successfully.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
