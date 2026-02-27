export const runtime = "nodejs";
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

        let settings = await prisma.settings.findFirst()
        if (!settings) {
            settings = await prisma.settings.create({ data: {} })
        }

        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

const UpdateSettingsSchema = z.object({
    slotMinutes: z.number().int().positive().optional(),
    bufferMinutes: z.number().int().nonnegative().optional(),
    minAdvanceMinutes: z.number().int().nonnegative().optional(),
    timezone: z.string().optional(),
    salonName: z.string().optional(),
    salonAddress: z.string().nullable().optional(),
    salonPhone: z.string().nullable().optional(),
})

export async function PATCH(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = UpdateSettingsSchema.safeParse(body)

        if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

        const settings = await prisma.settings.findFirst()
        if (!settings) return NextResponse.json({ error: 'Settings not found' }, { status: 404 })

        const updated = await prisma.settings.update({
            where: { id: settings.id },
            data: parsed.data
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

