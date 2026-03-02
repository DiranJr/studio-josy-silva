export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getSessionFromRequest } from '@/lib/session'
import { writeFile } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function GET(request: Request) {
    try {
        const session = getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const gallery = await prisma.gallery.findMany({
            where: { tenantId: session.tenantId },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(gallery)
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const session = getSessionFromRequest(request)
        if (!session || session.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

        const formData = await request.formData()
        const file = formData.get('image') as File | null

        if (!file) {
            return NextResponse.json({ error: 'No image uploaded' }, { status: 400 })
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const ext = file.name.split('.').pop()
        const filename = `${crypto.randomUUID()}.${ext}`

        // Save to public/uploads
        const uploadDir = path.join(process.cwd(), 'public', 'uploads')
        const filePath = path.join(uploadDir, filename)

        await writeFile(filePath, buffer)

        const imageUrl = `/uploads/${filename}`

        const galleryImage = await prisma.gallery.create({
            data: {
                tenantId: session.tenantId,
                imageUrl
            }
        })

        return NextResponse.json(galleryImage, { status: 201 })
    } catch (error) {
        console.error('Gallery upload error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
