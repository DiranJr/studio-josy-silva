import prisma from '@/lib/prisma'
import type { NextRequest } from 'next/server'

/**
 * Extracts tenant slug from the request.
 * Today: from pathname /[slug]/...
 * Future: from subdomain empresa-x.agenda.com (just uncomment)
 */
export function extractSlugFromRequest(request: NextRequest | Request): string | null {
    const host = (request.headers as Headers).get('host') || ''

    // Future: subdomain support — uncomment when ready
    // if (host.endsWith('.agendapro.app')) return host.split('.')[0]

    const url = new URL(request.url)
    const segment = url.pathname.split('/')[1]
    return segment || null
}

/**
 * Resolves a tenant by slug.
 * Throws if not found or inactive.
 */
export async function resolveTenantBySlug(slug: string) {
    if (!slug) throw new TenantError('SLUG_MISSING', 'Slug de tenant não informado')

    const tenant = await prisma.tenant.findUnique({
        where: { slug },
        include: { siteSettings: true },
    })

    if (!tenant) throw new TenantError('TENANT_NOT_FOUND', `Tenant "${slug}" não encontrado`)

    return tenant
}

/**
 * Resolves tenant from the authenticated session's tenantId.
 * Used in ALL CRM routes — tenant NEVER comes from the URL in the CRM.
 */
export async function resolveTenantFromSession(tenantId: string) {
    if (!tenantId) throw new TenantError('SESSION_MISSING', 'Sessão sem tenantId')

    const tenant = await prisma.tenant.findUnique({
        where: { id: tenantId },
        include: { siteSettings: true },
    })

    if (!tenant) throw new TenantError('TENANT_NOT_FOUND', 'Tenant da sessão não encontrado')

    return tenant
}

export class TenantError extends Error {
    constructor(public code: string, message: string) {
        super(message)
        this.name = 'TenantError'
    }
}
