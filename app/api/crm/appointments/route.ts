export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { parseISO } from 'date-fns'

export async function GET(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        const { searchParams } = new URL(request.url)
        const fromStr = searchParams.get('from')
        const toStr = searchParams.get('to')
        const staffId = searchParams.get('staffId')

        const where: any = {}
        if (fromStr && toStr) {
            where.startAt = { gte: parseISO(fromStr) }
            where.endAt = { lte: parseISO(toStr) }
        }
        if (staffId) {
            where.staffId = staffId
        }

        const appointments = await prisma.appointment.findMany({
            where,
            include: {
                client: true,
                serviceOption: { include: { service: true } },
                staff: true,
            },
            orderBy: { startAt: 'asc' }
        })

        return NextResponse.json(appointments)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}



