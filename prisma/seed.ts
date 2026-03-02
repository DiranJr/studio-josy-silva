import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding data safely (idempotent)...')

    // 1. Ensure a default Tenant exists
    const tenantSlug = 'studio-josy-silva'
    let tenant = await prisma.tenant.findUnique({ where: { slug: tenantSlug } })

    if (!tenant) {
        tenant = await prisma.tenant.create({
            data: {
                name: 'Studio Josy Silva',
                slug: tenantSlug,
                slotMinutes: 15,
                bufferMinutes: 10,
                minAdvanceMinutes: 120,
                timezone: 'America/Belem',
                siteSettings: {
                    create: {
                        title: 'Studio Josy Silva',
                        description: 'O clássico que amamos.',
                    }
                },
                siteSections: {
                    create: [
                        { type: 'banner', order: 0, content: { title: 'Studio Josy Silva', subtitle: 'Sua beleza em primeiro lugar.' } },
                        { type: 'services', order: 1, content: { title: 'Nossos Serviços', description: 'Confira os procedimentos disponíveis.' } },
                        { type: 'gallery', order: 2, content: { title: 'Galeria', description: 'Veja alguns de nossos trabalhos.' } },
                        { type: 'cta', order: 3, content: { title: 'Agende seu horário', buttonText: 'Agendar via WhatsApp', whatsapp: '' } }
                    ]
                }
            }
        })
        console.log('Created default Tenant')
    }

    // 2. Admin User
    const passwordHash = await bcrypt.hash('Admin123!', 10)
    await prisma.user.upsert({
        where: { email: 'admin@local' },
        update: {}, // keep existing password if already there
        create: { email: 'admin@local', name: 'Admin', passwordHash, role: 'ADMIN', tenantId: tenant.id },
    })
    console.log('Upserted admin user')

    // 3. Staff & Working Hours
    const existingStaff = await prisma.staff.findFirst({ where: { tenantId: tenant.id } })
    if (!existingStaff) {
        const staff = await prisma.staff.create({
            data: { name: 'Josy Silva', active: true, tenantId: tenant.id },
        })
        console.log('Created staff: Josy Silva')

        const wh = []
        for (let i = 1; i <= 5; i++) {
            wh.push({ staffId: staff.id, weekday: i, startTime: '09:00', endTime: '18:00' })
        }
        wh.push({ staffId: staff.id, weekday: 6, startTime: '09:00', endTime: '13:00' })
        await prisma.workingHours.createMany({ data: wh })
        console.log('Created default working hours')
    }

    // 4. Services
    const servicesCount = await prisma.service.count({ where: { tenantId: tenant.id } })
    if (servicesCount === 0) {
        console.log('No services found for tenant. Seeding initial catalog...')
        const servicesData = [
            {
                name: 'Volume Brasileiro',
                category: 'Cilios',
                description: 'O clássico que amamos. Fios naturais com densidade perfeita.',
                tenantId: tenant.id,
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 120, priceCents: 14000, depositCents: 4000, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 90, priceCents: 11000, depositCents: 4000, active: true },
                    ]
                }
            },
            {
                name: 'Volume Egípcio',
                category: 'Cilios',
                description: 'Tecnologia em fios W para um olhar mais denso e marcante.',
                tenantId: tenant.id,
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 120, priceCents: 13000, depositCents: 4000, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 90, priceCents: 10000, depositCents: 4000, active: true },
                    ]
                }
            },
            {
                name: 'Volume Luxo',
                category: 'Cilios',
                description: 'Para quem busca o máximo em glamour e sofisticação.',
                tenantId: tenant.id,
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 140, priceCents: 15000, depositCents: 4000, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 100, priceCents: 11000, depositCents: 4000, active: true },
                    ]
                }
            },
            {
                name: 'Design com Henna',
                category: 'Outros',
                description: 'Design completo com Henna para sobrancelhas perfeitamente definidas.',
                tenantId: tenant.id,
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 40, priceCents: 4500, depositCents: 0, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 40, priceCents: 4500, depositCents: 0, active: false },
                    ]
                }
            },
        ]

        for (const s of servicesData) {
            await prisma.service.create({ data: s as any })
        }
        console.log('Initial services catalog seeded successfully.')
    }

    console.log('✅ Seeding completed safely!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
