import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('Seeding data safely (idempotent)...')

    // 1. Settings
    const existingSettings = await prisma.settings.findFirst()
    if (!existingSettings) {
        await prisma.settings.create({
            data: {
                slotMinutes: 15,
                bufferMinutes: 10,
                minAdvanceMinutes: 120,
                timezone: 'America/Belem',
                salonName: 'Studio Josy Silva',
            },
        })
        console.log('Created default settings')
    }

    // 2. Admin User
    const passwordHash = await bcrypt.hash('Admin123!', 10)
    await prisma.user.upsert({
        where: { email: 'admin@local' },
        update: {}, // keep existing password if already there
        create: { email: 'admin@local', name: 'Admin', passwordHash, role: 'ADMIN' },
    })
    console.log('Upserted admin user')

    // 3. Staff & Working Hours
    const existingStaff = await prisma.staff.findFirst()
    if (!existingStaff) {
        const staff = await prisma.staff.create({
            data: { name: 'Josy Silva', active: true },
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
    const servicesCount = await prisma.service.count()
    if (servicesCount === 0) {
        console.log('No services found. Seeding initial catalog...')
        const servicesData = [
            {
                name: 'Volume Brasileiro',
                category: 'Cilios',
                description: 'O clássico que amamos. Fios naturais com densidade perfeita.',
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
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 120, priceCents: 13000, depositCents: 4000, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 90, priceCents: 10000, depositCents: 4000, active: true },
                    ]
                }
            },
            {
                name: 'Volume Fox',
                category: 'Cilios',
                description: 'Efeito alongado e impactante que realça o olhar.',
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 130, priceCents: 16000, depositCents: 4000, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 100, priceCents: 12000, depositCents: 4000, active: true },
                    ]
                }
            },
            {
                name: 'Volume Luxo',
                category: 'Cilios',
                description: 'Para quem busca o máximo em glamour e sofisticação.',
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 140, priceCents: 15000, depositCents: 4000, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 100, priceCents: 11000, depositCents: 4000, active: true },
                    ]
                }
            },
            {
                name: 'Design Simples',
                category: 'Outros',
                description: 'Sobrancelha alinhada e desenhada com precisão.',
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 30, priceCents: 2500, depositCents: 0, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 30, priceCents: 2500, depositCents: 0, active: false },
                    ]
                }
            },
            {
                name: 'Design com Henna',
                category: 'Outros',
                description: 'Design completo com Henna para sobrancelhas perfeitamente definidas.',
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 40, priceCents: 4500, depositCents: 0, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 40, priceCents: 4500, depositCents: 0, active: false },
                    ]
                }
            },
            {
                name: 'Epilação de Buço',
                category: 'Outros',
                description: 'Remoção de pelos com cera para um acabamento perfeito.',
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 15, priceCents: 1000, depositCents: 0, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 15, priceCents: 1000, depositCents: 0, active: false },
                    ]
                }
            },
            {
                name: 'Brow Lamination',
                category: 'Outros',
                description: 'Sobrancelhas disciplinadas, volumosas e com aspecto penteado.',
                options: {
                    create: [
                        { type: 'APPLICATION', durationMinutes: 60, priceCents: 11000, depositCents: 2000, active: true },
                        { type: 'MAINTENANCE', durationMinutes: 45, priceCents: 7000, depositCents: 2000, active: true },
                    ]
                }
            }
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
