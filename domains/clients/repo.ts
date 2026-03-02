import prisma from '@/lib/prisma'

// ─────────────────────────────────────────────────────────────────
// All functions require tenantId — it is NEVER optional.
// ─────────────────────────────────────────────────────────────────

export type ClientFilters = {
    search?: string
    skip?: number
    take?: number
}

export async function listClients(tenantId: string, filters: ClientFilters = {}) {
    const { search, skip = 0, take = 50 } = filters
    const where = {
        tenantId,
        ...(search ? {
            OR: [
                { name: { contains: search, mode: 'insensitive' as const } },
                { phone: { contains: search } },
                { email: { contains: search, mode: 'insensitive' as const } },
            ]
        } : {})
    }
    const [clients, total] = await Promise.all([
        prisma.client.findMany({
            where,
            skip,
            take,
            include: {
                appointments: {
                    orderBy: { startAt: 'desc' },
                    take: 5,
                    include: {
                        serviceOption: { include: { service: { select: { name: true } } } },
                        staff: { select: { name: true } },
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.client.count({ where }),
    ])
    return { clients, total }
}

export async function getClient(tenantId: string, id: string) {
    return prisma.client.findFirst({
        where: { id, tenantId },
        include: {
            appointments: {
                orderBy: { startAt: 'desc' },
                include: {
                    serviceOption: { include: { service: { select: { name: true, category: true } } } },
                    staff: { select: { name: true } },
                    payments: { select: { method: true, amountCents: true, status: true } },
                }
            }
        },
    })
}

export async function upsertClient(tenantId: string, data: {
    id?: string
    name: string
    phone: string
    email?: string
    notes?: string
}) {
    if (data.id) {
        const existing = await prisma.client.findFirst({ where: { id: data.id, tenantId } })
        if (!existing) return null
        return prisma.client.update({ where: { id: data.id }, data })
    }
    return prisma.client.create({ data: { tenantId, ...data } })
}
