export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/session'
import { z } from 'zod'

export async function GET(request: Request) {
    try {
        const session = getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const tenant = await prisma.tenant.findUnique({
            where: { id: session.tenantId },
            include: { siteSettings: true }
        })
        if (!tenant) return NextResponse.json({ error: 'Tenant not found' }, { status: 404 })

        // Auto-create SiteSettings if missing
        let settings = tenant.siteSettings
        if (!settings) {
            settings = await prisma.siteSettings.create({
                data: {
                    tenantId: session.tenantId,
                    title: tenant.name || 'Meu Estúdio de Beleza',
                    description: 'Especialistas em realçar sua beleza natural.',
                }
            })
        }

        return NextResponse.json({
            slug: tenant.slug,
            name: tenant.name,
            salonPhone: tenant.salonPhone,
            salonAddress: tenant.salonAddress,
            ...settings,
        })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

const UpdateSiteSchema = z.object({
    slug: z.string().min(2).max(40).regex(/^[a-z0-9-]+$/, 'Slug deve conter apenas letras minúsculas, números e hífens').optional(),
    title: z.string().min(2).optional(),
    description: z.string().min(5).optional(),
    banner: z.string().optional().nullable(),
    whatsapp: z.string().optional().nullable(),
    instagram: z.string().optional().nullable(),
    salonPhone: z.string().optional().nullable(),
    salonAddress: z.string().optional().nullable(),
})

export async function PUT(request: Request) {
    try {
        const session = getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = UpdateSiteSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input', details: parsed.error.format() }, { status: 400 })
        }

        const { slug, title, description, banner, whatsapp, instagram, salonPhone, salonAddress } = parsed.data

        // Check slug uniqueness if changing it
        if (slug) {
            const existing = await prisma.tenant.findFirst({ where: { slug, NOT: { id: session.tenantId } } })
            if (existing) return NextResponse.json({ error: 'Slug já está em uso. Escolha outro.' }, { status: 409 })

            await prisma.tenant.update({
                where: { id: session.tenantId },
                data: { slug, salonPhone, salonAddress }
            })
        }

        const updatedSettings = await prisma.siteSettings.upsert({
            where: { tenantId: session.tenantId },
            update: { title, description, banner, whatsapp, instagram },
            create: {
                tenantId: session.tenantId,
                title: title || 'Meu Estúdio',
                description: description || 'Especialistas em beleza.',
                banner, whatsapp, instagram
            }
        })

        const tenant = await prisma.tenant.findUnique({ where: { id: session.tenantId } })

        return NextResponse.json({ slug: tenant?.slug, name: tenant?.name, ...updatedSettings })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
