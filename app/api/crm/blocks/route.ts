import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'
import { z } from 'zod'
import { startOfDay, endOfDay } from 'date-fns'

function auth(request: Request) {
    const payload = verifyAccessToken(request.headers.get('authorization')?.split(' ')[1] || '')
    return payload?.role === 'ADMIN' ? payload : null
}

const CreateBlockSchema = z.object({
    staffId: z.string(),
    startAt: z.string(), // ISO string
    endAt: z.string(),   // ISO string
    reason: z.string().optional()
})

// GET — list blocks, optionally filtered by month/year
export async function GET(request: Request) {
    try {
        if (!auth(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { searchParams } = new URL(request.url)
        const year = searchParams.get('year')
        const month = searchParams.get('month')

        const where: any = {}
        if (year && month) {
            const from = new Date(Number(year), Number(month) - 1, 1)
            const to = new Date(Number(year), Number(month), 0, 23, 59, 59)
            where.startAt = { gte: from, lte: to }
        }

        const blocks = await prisma.block.findMany({ where, orderBy: { startAt: 'asc' } })
        return NextResponse.json(blocks)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// POST — block a full day
export async function POST(request: Request) {
    try {
        if (!auth(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const body = await request.json()
        const parsed = CreateBlockSchema.safeParse(body)
        if (!parsed.success) return NextResponse.json({ error: 'Invalid input' }, { status: 400 })

        const start = startOfDay(new Date(parsed.data.startAt))
        const end = endOfDay(new Date(parsed.data.endAt))

        const newBlock = await prisma.block.create({
            data: {
                staffId: parsed.data.staffId,
                startAt: start,
                endAt: end,
                reason: parsed.data.reason,
            }
        })
        return NextResponse.json(newBlock, { status: 201 })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

// DELETE — remove a block
export async function DELETE(request: Request) {
    try {
        if (!auth(request)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')
        if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

        await prisma.block.delete({ where: { id } })
        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
