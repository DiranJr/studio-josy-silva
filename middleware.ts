import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyAccessToken } from '@/lib/jwt'

function extractTokenFromRequest(request: NextRequest): string | null {
    // Cookie (new standard)
    const cookie = request.cookies.get('access-token')
    if (cookie?.value) return cookie.value

    // Authorization: Bearer (API calls / backward compat)
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) return authHeader.split(' ')[1]

    return null
}

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl

    // ── API protection (/api/crm/*) ─────────────────────────────────
    if (pathname.startsWith('/api/crm')) {
        const token = extractTokenFromRequest(request)
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        const payload = verifyAccessToken(token)
        if (!payload) {
            return NextResponse.json({ error: 'Token inválido ou expirado' }, { status: 401 })
        }
        // Inject tenantId header so handlers can trust it without re-verifying
        const requestHeaders = new Headers(request.headers)
        requestHeaders.set('x-tenant-id', payload.tenantId)
        requestHeaders.set('x-user-id', payload.userId)
        requestHeaders.set('x-user-role', payload.role)
        return NextResponse.next({ request: { headers: requestHeaders } })
    }

    // ── UI protection (/crm/*) ──────────────────────────────────────
    if (pathname.startsWith('/crm')) {
        const token = extractTokenFromRequest(request)
        if (!token || !verifyAccessToken(token)) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/crm/:path*', '/crm/:path*'],
}
