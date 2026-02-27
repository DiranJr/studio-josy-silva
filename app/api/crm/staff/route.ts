export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'

export async function GET(request: Request) {
    try {
        const payload = verifyAccessToken(request.headers.get('authorization')?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const staff = await prisma.staff.findMany({
            where: { active: true },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(staff)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

