import { verifyAccessToken, JWTPayload } from '@/lib/jwt'

export function getSessionFromRequest(request: Request): JWTPayload | null {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null
    }

    const token = authHeader.split(' ')[1]
    const payload = verifyAccessToken(token)

    return payload
}
