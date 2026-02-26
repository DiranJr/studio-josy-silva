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
        { name: 'Volume Brasileiro', description: 'O clássico que amamos. Fios em formato de Y.', durationMinutes: 120, priceCents: 15000, depositCents: 4000 },
        { name: 'Volume Egípcio', description: 'Tecnologia em fios W para um olhar mais denso.', durationMinutes: 120, priceCents: 17000, depositCents: 4000 },
        { name: 'Volume Luxo', description: 'Para quem busca o máximo glamour.', durationMinutes: 150, priceCents: 20000, depositCents: 4000 },
    ]
    await prisma.service.createMany({ data: servicesData })
    console.log('Created services')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
