import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

function auth(request: Request) {
    const payload = verifyAccessToken(request.headers.get('authorization')?.split(' ')[1] || '')
    return payload?.role === 'ADMIN' ? payload : null
}

const UpdateServiceSchema = z.object({
    name: z.string().min(2).optional(),
    description: z.string().optional(),
    category: z.string().optional(),
    active: z.boolean().optional(),
})

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        if (!auth(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = UpdateServiceSchema.safeParse(body)
        if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

        const updated = await prisma.service.update({
            where: { id: params.id },
            data: parsed.data,
            include: { options: true }
        })

        return NextResponse.json(updated)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        if (!auth(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        await prisma.service.update({
            where: { id: params.id },
            data: { active: false }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
