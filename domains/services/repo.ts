import prisma from '@/lib/prisma'

// ─────────────────────────────────────────────────────────────────
// All functions require tenantId — it is NEVER optional.
// ─────────────────────────────────────────────────────────────────

export async function listServices(tenantId: string, activeOnly = false) {
    return prisma.service.findMany({
        where: { tenantId, ...(activeOnly ? { active: true } : {}) },
        include: { options: { where: { active: true }, orderBy: { type: 'asc' } } },
        orderBy: { name: 'asc' },
    })
}

export async function createService(tenantId: string, data: {
    name: string
    description?: string
    category?: string
    options: Array<{
        type: string
        durationMinutes: number
        priceCents: number
        depositCents?: number
    }>
}) {
    const { options, ...serviceData } = data
    return prisma.service.create({
        data: {
            tenantId,
            ...serviceData,
            options: { create: options },
        },
        include: { options: true },
    })
}

export async function updateService(tenantId: string, id: string, data: Partial<{
    name: string
    description: string
    active: boolean
    category: string
}>) {
    const existing = await prisma.service.findFirst({ where: { id, tenantId } })
    if (!existing) return null
    return prisma.service.update({ where: { id }, data })
}

export async function updateServiceOption(tenantId: string, serviceId: string, optionId: string, data: Partial<{
    durationMinutes: number
    priceCents: number
    depositCents: number
    active: boolean
}>) {
    // Verify the service belongs to this tenant before updating its option
    const service = await prisma.service.findFirst({ where: { id: serviceId, tenantId } })
    if (!service) return null
    return prisma.serviceOption.update({ where: { id: optionId }, data })
}
