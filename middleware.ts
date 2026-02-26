import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Middleware to protect /api/crm and /crm endpoints
export function middleware(request: NextRequest) {
    // API Protection
    if (request.nextUrl.pathname.startsWith('/api/crm')) {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized middleware' }, { status: 401 })
        }
    }

    // UI Protection
    if (request.nextUrl.pathname.startsWith('/crm')) {
        const token = request.cookies.get('auth-token')
        if (!token) {
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: ['/api/crm/:path*', '/crm/:path*'],
}
