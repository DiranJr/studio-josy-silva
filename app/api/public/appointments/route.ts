export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { parseISO, startOfDay, endOfDay, addMinutes, isBefore, isAfter } from 'date-fns'

const CreateAppointmentSchema = z.object({
    serviceOptionId: z.string().uuid(),
    staffId: z.string().uuid().optional(),
    date: z.string(), // YYYY-MM-DD
    time: z.string(), // HH:mm
    client: z.object({
        name: z.string().min(2),
        phone: z.string().min(10),
        email: z.string().email().optional().or(z.literal('')),
    }),
    clientNotes: z.string().optional()
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = CreateAppointmentSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input', details: parsed.error }, { status: 400 })
        }

        const data = parsed.data

        // 1. Fetch relations & Settings
        const serviceOption = await prisma.serviceOption.findUnique({
            where: { id: data.serviceOptionId },
            include: { service: true }
        })
        if (!serviceOption || !serviceOption.active || !serviceOption.service.active) {
            return NextResponse.json({ error: 'SERVICE_OPTION_INACTIVE' }, { status: 404 })
        }

        const settings = await prisma.settings.findFirst()
        if (!settings) return NextResponse.json({ error: 'Settings missing' }, { status: 500 })

        let staffId = data.staffId
        if (!staffId) {
            const staff = await prisma.staff.findFirst({ where: { active: true } })
            if (!staff) return NextResponse.json({ error: 'No active staff available' }, { status: 500 })
            staffId = staff.id
        }

        // 2. Validate availability AGAIN 
        const dateObj = parseISO(data.date)
        const [hours, mins] = data.time.split(':').map(Number)
        const startAt = new Date(dateObj)
        startAt.setHours(hours, mins, 0, 0)

        const endAt = addMinutes(startAt, serviceOption.durationMinutes + settings.bufferMinutes)

        const appointments = await prisma.appointment.findMany({
            where: {
                staffId,
                startAt: { lt: endAt },
                endAt: { gt: startAt },
                status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] }
            }
        })

        const blocks = await prisma.block.findMany({
            where: {
                staffId,
                startAt: { lt: endAt },
                endAt: { gt: startAt },
            }
        })

        if (appointments.length > 0 || blocks.length > 0) {
            return NextResponse.json({ error: 'SLOT_NOT_AVAILABLE' }, { status: 409 })
        }

        // 3. Upsert Client (find by phone)
        const client = await prisma.client.findFirst({
            where: { phone: data.client.phone }
        })

        let clientId = client?.id
        if (!clientId) {
            const newClient = await prisma.client.create({
                data: {
                    name: data.client.name,
                    phone: data.client.phone,
                    email: data.client.email || null,
                }
            })
            clientId = newClient.id
        }

        // 4. Create appointment
        const requiresDeposit = serviceOption.depositCents > 0;
        const initialStatus = requiresDeposit ? 'PENDING_PAYMENT' : 'CONFIRMED'

        const appointment = await prisma.appointment.create({
            data: {
                clientId,
                serviceOptionId: serviceOption.id,
                staffId,
                startAt,
                endAt,
                clientNotes: data.clientNotes,
                status: initialStatus
            },
            include: {
                serviceOption: {
                    include: { service: true }
                }
            }
        })

        return NextResponse.json({
            success: true,
            appointmentId: appointment.id,
            status: appointment.status,
            startAt: appointment.startAt,
            endAt: appointment.endAt,
            serviceName: appointment.serviceOption.service.name,
            optionType: appointment.serviceOption.type,
            requiresDeposit,
            depositValue: serviceOption.depositCents,
            totalValue: serviceOption.priceCents
        })

    } catch (error) {
        console.error('Failed to create appointment:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

