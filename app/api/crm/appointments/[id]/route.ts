export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

const UpdateAppointmentSchema = z.object({
    status: z.enum(['PENDING_PAYMENT', 'CONFIRMED', 'CANCELLED', 'DONE', 'NO_SHOW']).optional(),
    internalNotes: z.string().optional()
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = UpdateAppointmentSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { status, internalNotes } = parsed.data

        const updated = await prisma.appointment.update({
            where: { id: params.id },
            data: {
                status,
                internalNotes
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
