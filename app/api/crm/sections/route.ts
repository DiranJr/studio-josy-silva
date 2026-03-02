export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/session'

export async function GET(request: Request) {
    try {
        const session = getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const sections = await prisma.siteSection.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { order: 'asc' }
        })

        return NextResponse.json(sections)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function PUT(request: Request) {
    try {
        const session = getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()

        // Handle bulk reorder operation
        if (Array.isArray(body)) {
            // Expected body: [{ id: '...', order: 0 }, { id: '...', order: 1 }]
            for (const item of body) {
                await prisma.siteSection.update({
                    where: { id: item.id, tenantId: session.tenantId },
                    data: { order: item.order }
                })
            }
            return NextResponse.json({ success: true })
        }

        // Handle single section update
        const { id, content, active } = body
        const updated = await prisma.siteSection.update({
            where: { id, tenantId: session.tenantId },
            data: {
                content: content !== undefined ? content : undefined,
                active: active !== undefined ? active : undefined
            }
        })
        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
