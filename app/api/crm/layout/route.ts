export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/session'
import { z } from 'zod'

const VALID_LAYOUTS = ['beauty', 'nails', 'brow', 'elegant', 'minimal', 'vibrant', 'botanical', 'retro', 'modern', 'pastel'];

export async function PATCH(request: Request) {
    try {
        const session = getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const layout = body?.layout

        if (!layout || !VALID_LAYOUTS.includes(layout)) {
            return NextResponse.json({ error: 'Layout inválido.' }, { status: 400 })
        }

        await prisma.tenant.update({
            where: { id: session.tenantId },
            data: { layout }
        })

        return NextResponse.json({ layout })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
