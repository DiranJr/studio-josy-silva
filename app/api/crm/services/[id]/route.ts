import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

const UpdateServiceSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    durationMinutes: z.number().int().positive().optional(),
    priceCents: z.number().int().nonnegative().optional(),
    depositCents: z.number().int().nonnegative().optional(),
    active: z.boolean().optional()
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = UpdateServiceSchema.safeParse(body)

        if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

        const updated = await prisma.service.update({
            where: { id: params.id },
            data: parsed.data
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
