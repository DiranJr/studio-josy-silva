import { verifyAccessToken } from '@/lib/jwt'

export type { JWTPayload } from '@/lib/jwt'

export function getSessionFromRequest(request: Request) {
    // 1. Try Authorization: Bearer header (backwards compat for any direct API calls)
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1]
        const payload = verifyAccessToken(token)
        if (payload) return payload
    }

    // 2. Try HttpOnly cookie (new standard — set by /api/auth/login)
    const cookieHeader = request.headers.get('cookie')
    if (cookieHeader) {
        const match = cookieHeader.match(/(?:^|;\s*)access-token=([^;]+)/)
        if (match) {
            const payload = verifyAccessToken(match[1])
            if (payload) return payload
        }
    }

    return null
}
