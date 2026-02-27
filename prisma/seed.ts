import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    // 1. Settings
    const settings = await prisma.settings.create({
        data: {
            slotMinutes: 15,
            bufferMinutes: 10,
            minAdvanceMinutes: 120,
            timezone: 'America/Belem',
            salonName: 'Studio Josy Silva',
        },
    })
    console.log('Created settings', settings.id)

    // 2. Admin User
    const passwordHash = await bcrypt.hash('Admin123!', 10)
    const admin = await prisma.user.upsert({
        where: { email: 'admin@local' },
        update: {},
        create: {
            email: 'admin@local',
            name: 'Admin',
            passwordHash,
            role: 'ADMIN',
        },
    })
    console.log('Created admin user', admin.email)

    // 3. Staff
    const staff = await prisma.staff.create({
        data: {
            name: 'Atendente 1',
            active: true,
        },
    })
    console.log('Created staff', staff.name)

    // 4. Working Hours (Seg-Sex 09:00-18:00, Sáb 09:00-13:00)
    const workingHoursData = []
    // Monday to Friday (1-5)
    for (let i = 1; i <= 5; i++) {
        workingHoursData.push({ staffId: staff.id, weekday: i, startTime: '09:00', endTime: '18:00' })
    }
    // Saturday (6)
    workingHoursData.push({ staffId: staff.id, weekday: 6, startTime: '09:00', endTime: '13:00' })

    await prisma.workingHours.createMany({
        data: workingHoursData,
    })
    console.log('Created working hours for staff', staff.id)

    // 5. Services
    const servicesData = [
        // CILIOS
        {
            name: 'Volume Brasileiro',
            category: 'Cilios',
            description: 'O clássico que amamos. Fios em formato de Y.',
            options: {
                create: [
                    { type: 'APPLICATION', durationMinutes: 120, priceCents: 18000, depositCents: 4000 },
                    { type: 'MAINTENANCE', durationMinutes: 90, priceCents: 10000, depositCents: 4000 }
                ]
            }
        },
        {
            name: 'Volume Egípcio',
            category: 'Cilios',
            description: 'Tecnologia em fios W para um olhar mais denso.',
            options: {
                create: [
                    { type: 'APPLICATION', durationMinutes: 130, priceCents: 20000, depositCents: 4000 },
                    { type: 'MAINTENANCE', durationMinutes: 100, priceCents: 12000, depositCents: 4000 }
                ]
            }
        },
        {
            name: 'Volume Fox',
            category: 'Cilios',
            description: 'Efeito alongado impactante.',
            options: {
                create: [
                    { type: 'APPLICATION', durationMinutes: 140, priceCents: 21000, depositCents: 4000 },
                    { type: 'MAINTENANCE', durationMinutes: 100, priceCents: 13000, depositCents: 4000 }
                ]
            }
        },
        {
            name: 'Volume Luxo',
            category: 'Cilios',
            description: 'Para quem busca o máximo glamour.',
            options: {
                create: [
                    { type: 'APPLICATION', durationMinutes: 150, priceCents: 23000, depositCents: 5000 },
                    { type: 'MAINTENANCE', durationMinutes: 110, priceCents: 14000, depositCents: 5000 }
                ]
            }
        },
        // OUTROS SERVICOS
        {
            name: 'Design Simples',
            category: 'Outros',
            description: 'Sobrancelha alinhada',
            options: {
                create: [
                    { type: 'APPLICATION', durationMinutes: 30, priceCents: 2500, depositCents: 0 },
                    { type: 'MAINTENANCE', durationMinutes: 30, priceCents: 2500, depositCents: 0, active: false }
                ]
            }
        },
        {
            name: 'Design com Henna',
            category: 'Outros',
            description: 'Design completo com Henna',
            options: {
                create: [
                    { type: 'APPLICATION', durationMinutes: 40, priceCents: 4500, depositCents: 0 },
                    { type: 'MAINTENANCE', durationMinutes: 40, priceCents: 4500, depositCents: 0, active: false }
                ]
            }
        },
        {
            name: 'Epilação de Buço',
            category: 'Outros',
            description: 'Remoção de pelo',
            options: {
                create: [
                    { type: 'APPLICATION', durationMinutes: 15, priceCents: 1000, depositCents: 0 },
                    { type: 'MAINTENANCE', durationMinutes: 15, priceCents: 1000, depositCents: 0, active: false }
                ]
            }
        },
        {
            name: 'Brow Lamination',
            category: 'Outros',
            description: 'Sobrancelhas disciplinadas e volumosas',
            options: {
                create: [
                    { type: 'APPLICATION', durationMinutes: 60, priceCents: 11000, depositCents: 2000 },
                    { type: 'MAINTENANCE', durationMinutes: 45, priceCents: 7000, depositCents: 2000 }
                ]
            }
        },
    ];

    for (const s of servicesData) {
        await prisma.service.create({
            data: s
        });
    }
    console.log('Created services with options')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
