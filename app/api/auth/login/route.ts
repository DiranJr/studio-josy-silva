import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signAccessToken, signRefreshToken } from '@/lib/jwt'
import { z } from 'zod'

const LoginSchema = z.object({
    email: z.string().email(),
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

        const user = await prisma.user.findUnique({
            where: { email },
        })

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
        }

        const payload = { userId: user.id, role: user.role }
        const accessToken = signAccessToken(payload)
        const refreshToken = signRefreshToken(payload)

        return NextResponse.json({ accessToken, refreshToken })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}
