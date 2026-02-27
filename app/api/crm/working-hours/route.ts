export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

const WorkingHoursSchema = z.array(z.object({
    weekday: z.number().int().min(0).max(6),
    startTime: z.string().regex(/^\d{2}:\d{2}$/),
    endTime: z.string().regex(/^\d{2}:\d{2}$/),
    active: z.boolean().default(true),
}))

export async function GET(request: Request) {
    try {
        const payload = verifyAccessToken(request.headers.get('authorization')?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const workingHours = await prisma.workingHours.findMany({
            orderBy: { weekday: 'asc' }
        })

        return NextResponse.json(workingHours)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const payload = verifyAccessToken(request.headers.get('authorization')?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        // body: { staffId: string, hours: [{weekday, startTime, endTime, active}] }
        const { staffId, hours } = body

        if (!staffId) return NextResponse.json({ error: 'staffId required' }, { status: 400 })

        const parsed = WorkingHoursSchema.safeParse(hours)
        if (!parsed.success) return NextResponse.json({ error: 'Invalid input', details: parsed.error.flatten() }, { status: 400 })

        // Delete all existing hours for this staff, then re-create
        await prisma.workingHours.deleteMany({ where: { staffId } })

        const activeHours = parsed.data.filter(h => h.active)
        if (activeHours.length > 0) {
            await prisma.workingHours.createMany({
                data: activeHours.map(h => ({
                    staffId,
                    weekday: h.weekday,
                    startTime: h.startTime,
                    endTime: h.endTime,
                }))
            })
        }

        const updated = await prisma.workingHours.findMany({
            where: { staffId },
            orderBy: { weekday: 'asc' }
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

