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

        const tenant = await prisma.tenant.findUnique({ where: { id: payload.tenantId } })
        if (!tenant) {
            return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })
        }

        return NextResponse.json(tenant)
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

        const tenant = await prisma.tenant.findUnique({ where: { id: payload.tenantId } })
        if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

        const updateData: any = { ...parsed.data }
        if (updateData.salonName !== undefined) {
            updateData.name = updateData.salonName
            delete updateData.salonName
        }

        const updated = await prisma.tenant.update({
            where: { id: tenant.id },
            data: updateData
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
