import { getSessionFromRequest } from '@/lib/session'
import { resolveTenantFromSession, resolveTenantBySlug, TenantError } from '@/lib/tenant-resolver'
import { NextResponse } from 'next/server'

export type RequestContext = {
    tenantId: string
    userId: string
    role: string
    timezone: string
    tenant: Awaited<ReturnType<typeof resolveTenantFromSession>>
}

/**
 * CRM request context — tenant always resolved from JWT session.
 * NEVER uses slug from URL. Prevents user from accessing other tenants via URL manipulation.
 */
export async function getCrmContext(request: Request): Promise<RequestContext> {
    const session = getSessionFromRequest(request)
    if (!session) throw new ContextError('UNAUTHORIZED', 'Sessão inválida ou expirada')

    const tenant = await resolveTenantFromSession(session.tenantId)

    return {
        tenantId: session.tenantId,
        userId: session.userId,
        role: session.role,
        timezone: tenant.timezone,
        tenant,
    }
}

/**
 * Public request context — tenant resolved by URL slug, validated as active.
 */
export async function getPublicContext(slug: string) {
    if (!slug) throw new ContextError('SLUG_MISSING', 'Slug não informado')
    const tenant = await resolveTenantBySlug(slug)
    return { tenantId: tenant.id, timezone: tenant.timezone, tenant }
}

/**
 * Helper: returns a 401/403 NextResponse from a context error.
 */
export function contextErrorResponse(error: unknown) {
    if (error instanceof ContextError) {
        const status = error.code === 'UNAUTHORIZED' ? 401 : 400
        return NextResponse.json({ error: { code: error.code, message: error.message } }, { status })
    }
    if (error instanceof TenantError) {
        return NextResponse.json({ error: { code: error.code, message: error.message } }, { status: 404 })
    }
    return NextResponse.json({ error: { code: 'INTERNAL', message: 'Erro interno' } }, { status: 500 })
}

export class ContextError extends Error {
    constructor(public code: string, message: string) {
        super(message)
        this.name = 'ContextError'
    }
}
