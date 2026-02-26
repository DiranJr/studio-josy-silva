import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'super-secret-refresh-key'

export interface JWTPayload {
    userId: string
    role: string
}

export function signAccessToken(payload: JWTPayload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '1h' })
}

export function signRefreshToken(payload: JWTPayload) {
    return jwt.sign(payload, REFRESH_SECRET, { expiresIn: '7d' })
}

export function verifyAccessToken(token: string) {
    try {
        return jwt.verify(token, JWT_SECRET) as JWTPayload
    } catch (error) {
        return null
    }
}

export function verifyRefreshToken(token: string) {
    try {
        return jwt.verify(token, REFRESH_SECRET) as JWTPayload
    } catch (error) {
        return null
    }
}
