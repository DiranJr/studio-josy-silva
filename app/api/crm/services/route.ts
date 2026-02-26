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
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(services)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

const CreateServiceSchema = z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    durationMinutes: z.number().int().positive(),
    priceCents: z.number().int().nonnegative(),
    depositCents: z.number().int().nonnegative().default(0),
    active: z.boolean().default(true)
})

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = CreateServiceSchema.safeParse(body)

        if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

        const newService = await prisma.service.create({
            data: parsed.data
        })

        return NextResponse.json(newService)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
