export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import { z } from 'zod'

const LoginSchema = z.object({
    email: z.string().min(3),
    password: z.string().min(6),
})

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const parsed = LoginSchema.safeParse(body)

        if (!parsed.success) {
            return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
        }

        const { email, password } = parsed.data
        const user = await prisma.user.findUnique({ where: { email } }) as any

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const payload = { userId: user.id, role: user.role, tenantId: user.tenantId }
        const accessToken = signAccessToken(payload)
        const refreshToken = signRefreshToken(payload)

        const isProd = process.env.NODE_ENV === 'production'

        const response = NextResponse.json({ ok: true })

        // Access token: HttpOnly, short-lived
        response.cookies.set('access-token', accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            maxAge: 60 * 60,        // 1h
            path: '/',
        })

        // Refresh token: HttpOnly, scoped to refresh endpoint only
        response.cookies.set('refresh-token', refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7d
            path: '/api/auth/refresh',
        })

        return response
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
