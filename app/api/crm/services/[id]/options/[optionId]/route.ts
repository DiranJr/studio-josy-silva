export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

const UpdateOptionSchema = z.object({
    durationMinutes: z.number().int().positive().optional(),
    priceCents: z.number().int().nonnegative().optional(),
    depositCents: z.number().int().nonnegative().optional(),
    active: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string; optionId: string } }) {
    try {
        const payload = verifyAccessToken(request.headers.get('authorization')?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = UpdateOptionSchema.safeParse(body)
        if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

        const updated = await prisma.serviceOption.update({
            where: { id: params.optionId },
            data: parsed.data,
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
