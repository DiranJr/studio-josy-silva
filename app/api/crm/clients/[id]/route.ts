import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const client = await prisma.client.findUnique({
            where: { id: params.id },
            include: {
                appointments: {
                    include: { service: true, staff: true },
                    orderBy: { startAt: 'desc' }
                }
            }
        })

        if (!client) return NextResponse.json({ error: 'Not found' }, { status: 404 })

        return NextResponse.json(client)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

const UpdateClientSchema = z.object({
    name: z.string().min(2).optional(),
    phone: z.string().min(10).optional(),
    email: z.string().email().optional().or(z.literal('')),
    notes: z.string().optional()
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = UpdateClientSchema.safeParse(body)

        if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

        const updated = await prisma.client.update({
            where: { id: params.id },
            data: parsed.data
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
