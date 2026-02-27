export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import { signAccessToken, verifyRefreshToken } from '@/lib/jwt'
import { z } from 'zod'

const RefreshSchema = z.object({
    refreshToken: z.string(),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = RefreshSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: 'Token missing' }, { status: 400 })
        }

        const payload = verifyRefreshToken(parsed.data.refreshToken)

        if (!payload) {
            return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 })
        }

        // Optional: check if user still exists in DB
        const newAccessToken = signAccessToken({ userId: payload.userId, role: payload.role })

        return NextResponse.json({ accessToken: newAccessToken })
    } catch (error) {
        console.error('Refresh error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
