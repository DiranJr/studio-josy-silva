export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { parseISO, startOfDay, endOfDay } from 'date-fns'

export async function GET(request: Request) {
    try {
        const payload = verifyAccessToken(request.headers.get('authorization')?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { searchParams } = new URL(request.url)
        const fromStr = searchParams.get('from')
        const toStr = searchParams.get('to')
        const statusFilter = searchParams.get('status') // 'CONFIRMED' | 'PENDING_PAYMENT' | 'CANCELLED'

        const where: any = {}
        if (fromStr) where.startAt = { ...(where.startAt || {}), gte: startOfDay(parseISO(fromStr)) }
        if (toStr) where.startAt = { ...(where.startAt || {}), lte: endOfDay(parseISO(toStr)) }
        if (statusFilter) where.status = statusFilter

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                client: true,
                serviceOption: { include: { service: true } },
                staff: true,
            },
            orderBy: { startAt: 'desc' }
        })

        // Revenue from confirmed appointments only
        const confirmed = appointments.filter(a => a.status === 'CONFIRMED')
        const totalRevenueCents = confirmed.reduce((sum, a) => sum + a.serviceOption.priceCents, 0)
        const totalReservations = confirmed.reduce((sum, a) => sum + a.serviceOption.depositCents, 0)

        // Revenue by service
        const byService: Record<string, { name: string; count: number; revenueCents: number }> = {}
        for (const a of confirmed) {
            const key = a.serviceOption.service.id
            if (!byService[key]) {
                byService[key] = { name: a.serviceOption.service.name, count: 0, revenueCents: 0 }
            }
            byService[key].count++
            byService[key].revenueCents += a.serviceOption.priceCents
        }

        return NextResponse.json({
            appointments,
            stats: {
                total: appointments.length,
                confirmed: confirmed.length,
                pending: appointments.filter(a => a.status === 'PENDING_PAYMENT').length,
                cancelled: appointments.filter(a => a.status === 'CANCELLED').length,
                totalRevenueCents,
                totalReservations,
                averageTicketCents: confirmed.length > 0 ? Math.round(totalRevenueCents / confirmed.length) : 0,
                byService: Object.values(byService).sort((a, b) => b.revenueCents - a.revenueCents),
            }
        })
    } catch (error) {
        console.error(error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

