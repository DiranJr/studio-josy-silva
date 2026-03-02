export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const slug = searchParams.get('slug')

        if (!slug) {
            return NextResponse.json({ error: 'Slug is required' }, { status: 400 })
        }

        const services = await prisma.service.findMany({
            where: {
                active: true,
                tenant: { slug }
            },
            include: {
                options: {
                    where: { active: true },
                    orderBy: { type: 'asc' }, // APPLICATION before MAINTENANCE alphabetically
                }
            },
            orderBy: { createdAt: 'asc' },
        })

        return NextResponse.json(services)
    } catch (error) {
        console.error('Failed to fetch services:', error)
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
    }
}
