import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyAccessToken } from '@/lib/jwt'

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        const authHeader = request.headers.get('authorization')
        const payload = verifyAccessToken(authHeader?.split(' ')[1] || '')
        if (!payload || payload.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        await prisma.block.delete({
            where: { id: params.id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
