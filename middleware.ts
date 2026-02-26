import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Simple middleware to protect /api/crm endpoints
export function middleware(request: NextRequest) {
    // If accessing /api/crm, require authorization header validation
    if (request.nextUrl.pathname.startsWith('/api/crm')) {
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ error: 'Unauthorized middleware' }, { status: 401 })
        }
        // We cannot easily use edge-incompatible libs (like full jsonwebtoken) in regular middleware without config
        // For MVP we just assert token is present and starts with Bearer. 
        // The individual /api/crm/* route handlers will strictly verify the token signature.
    }
    return NextResponse.next()
}

export const config = {
    matcher: ['/api/crm/:path*'],
}
