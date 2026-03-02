export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/session'
import { z } from 'zod'

export async function GET(request: Request) {
    try {
        const session = getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        let settings = await prisma.siteSettings.findUnique({
            where: { tenantId: session.tenantId }
        })

        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    tenantId: session.tenantId,
                    title: 'Meu Estúdio de Beleza',
                    description: 'Especialistas em realçar sua beleza natural.',
                }
            })
        }

        return NextResponse.json(settings)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

const UpdateSiteSettingsSchema = z.object({
    title: z.string().min(2),
    description: z.string().min(5),
    banner: z.string().optional().nullable(),
    whatsapp: z.string().optional().nullable(),
    instagram: z.string().optional().nullable()
})

export async function PUT(request: Request) {
    try {
        const session = getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = UpdateSiteSettingsSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 })
        }

        const updated = await prisma.siteSettings.upsert({
            where: { tenantId: session.tenantId },
            update: parsed.data,
            create: {
                ...parsed.data,
                tenantId: session.tenantId
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
