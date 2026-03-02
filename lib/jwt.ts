import jwt from 'jsonwebtoken'

export interface JWTPayload {
    userId: string
    role: string
    tenantId: string
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

export function verifyAccessToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, getSecret('JWT_SECRET')) as JWTPayload
    } catch {
        return null
    }
}

export function verifyRefreshToken(token: string): JWTPayload | null {
    try {
        return jwt.verify(token, getSecret('REFRESH_SECRET')) as JWTPayload
    } catch {
        return null
    }
}
