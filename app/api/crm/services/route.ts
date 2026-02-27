export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const services = await prisma.service.findMany({
            include: {
                options: { orderBy: { type: 'asc' } }
            },
            orderBy: { createdAt: 'asc' }
        })

        return NextResponse.json(services)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

const CreateServiceSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    category: z.string().default('Cilios'),
    applicationDurationMinutes: z.number().int().positive(),
    applicationPriceCents: z.number().int().nonnegative(),
    applicationDepositCents: z.number().int().nonnegative().default(0),
    maintenanceDurationMinutes: z.number().int().positive().optional(),
    maintenancePriceCents: z.number().int().nonnegative().optional(),
    maintenanceDepositCents: z.number().int().nonnegative().default(0),
    includesMaintenance: z.boolean().default(true),
})

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = CreateServiceSchema.safeParse(body)
        if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })

        const { name, description, category,
            applicationDurationMinutes, applicationPriceCents, applicationDepositCents,
            maintenanceDurationMinutes, maintenancePriceCents, maintenanceDepositCents,
            includesMaintenance } = parsed.data

        const options: any[] = [
            { type: 'APPLICATION', durationMinutes: applicationDurationMinutes, priceCents: applicationPriceCents, depositCents: applicationDepositCents, active: true }
        ]

        if (includesMaintenance) {
            options.push({
                type: 'MAINTENANCE',
                durationMinutes: maintenanceDurationMinutes || applicationDurationMinutes,
                priceCents: maintenancePriceCents || applicationPriceCents,
                depositCents: maintenanceDepositCents,
                active: true
            })
        } else {
            options.push({
                type: 'MAINTENANCE', durationMinutes: 30, priceCents: 0, depositCents: 0, active: false
            })
        }

        const newService = await prisma.service.create({
            data: { name, description, category, options: { create: options } },
            include: { options: true }
        })

        return NextResponse.json(newService, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}



