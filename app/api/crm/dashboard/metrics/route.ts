import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns'

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        if (!authHeader) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const payload = verifyAccessToken(authHeader.split(' ')[1])
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized/Forbidden' }, { status: 403 })
        }

        const now = new Date()

        // Dashboard metrics
        // 1. Appointments Today
        const todayStart = startOfDay(now)
        const todayEnd = endOfDay(now)

        const todayAppointments = await prisma.appointment.count({
            where: {
                startAt: { gte: todayStart },
                endAt: { lte: todayEnd },
                status: { not: 'CANCELLED' }
            }
        })

        // 2. Appointments This Week
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }) // Monday
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 })

        const weekAppointments = await prisma.appointment.count({
            where: {
                startAt: { gte: weekStart },
                endAt: { lte: weekEnd },
                status: { not: 'CANCELLED' }
            }
        })

        // 3. Pending Payments count
        const pendingPaymentsCount = await prisma.appointment.count({
            where: {
                status: 'PENDING_PAYMENT'
            }
        })

        // 4. Monthly Estimated Revenue
        // Using start of month
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)

        const monthAppointments = await prisma.appointment.findMany({
            where: {
                startAt: { gte: monthStart },
                endAt: { lte: monthEnd },
                status: { in: ['CONFIRMED', 'DONE'] }
            },
            include: { service: true }
        })

        const estimatedRevenue = monthAppointments.reduce((acc, appt) => acc + appt.service.priceCents, 0)

        return NextResponse.json({
            todayAppointments,
            weekAppointments,
            pendingPaymentsCount,
            estimatedRevenueCents: estimatedRevenue
        })
    } catch (error) {
        console.error('Failed to get metrics:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
