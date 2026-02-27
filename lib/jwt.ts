import jwt from 'jsonwebtoken'

export interface JWTPayload {
    userId: string
    role: string
}

function getSecret(name: string): string {
    const v = process.env[name]
    if (!v) throw new Error(`${name} env var is missing`)
    return v
}

export function signAccessToken(payload: JWTPayload) {
    return jwt.sign(payload, getSecret('JWT_SECRET'), { expiresIn: '1h' })
}

export function signRefreshToken(payload: JWTPayload) {
    return jwt.sign(payload, getSecret('REFRESH_SECRET'), { expiresIn: '7d' })
}

export function verifyAccessToken(token: string) {
    try {
        const secret = process.env.JWT_SECRET || 'super-secret-jwt-key' // fallback for local dev
        return jwt.verify(token, secret) as JWTPayload
    } catch {
        return null
    }
}

export function verifyRefreshToken(token: string) {
    try {
        const secret = process.env.REFRESH_SECRET || 'super-secret-refresh-key'
        return jwt.verify(token, secret) as JWTPayload
    } catch {
        return null
    }
}
