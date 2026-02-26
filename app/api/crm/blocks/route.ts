import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'

const CreateBlockSchema = z.object({
    staffId: z.string().uuid(),
    startAt: z.string(), // ISO string
    endAt: z.string(), // ISO string
    reason: z.string().optional()
})

export async function POST(request: Request) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = CreateBlockSchema.safeParse(body)

        if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

        const newBlock = await prisma.block.create({
            data: {
                staffId: parsed.data.staffId,
                startAt: new Date(parsed.data.startAt),
                endAt: new Date(parsed.data.endAt),
                reason: parsed.data.reason
            }
        })

        return NextResponse.json(newBlock)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
