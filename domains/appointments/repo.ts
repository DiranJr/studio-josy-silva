import prisma from '@/lib/prisma'

// ─────────────────────────────────────────────────────────────────
// All functions require tenantId — it is NEVER optional.
// Never call prisma.appointment.findMany() without tenantId.
// ─────────────────────────────────────────────────────────────────

export type AppointmentFilters = {
    from?: Date
    to?: Date
    staffId?: string
    status?: string
    clientId?: string
}

export async function listAppointments(tenantId: string, filters: AppointmentFilters = {}) {
    return prisma.appointment.findMany({
        where: {
            tenantId,
            ...(filters.staffId ? { staffId: filters.staffId } : {}),
            ...(filters.status ? { status: filters.status } : {}),
            ...(filters.clientId ? { clientId: filters.clientId } : {}),
            ...(filters.from || filters.to ? {
                startAt: {
                    ...(filters.from ? { gte: filters.from } : {}),
                    ...(filters.to ? { lte: filters.to } : {}),
                }
            } : {}),
        },
        include: {
            client: { select: { id: true, name: true, phone: true } },
            staff: { select: { id: true, name: true } },
            serviceOption: {
                select: {
                    id: true, type: true, priceCents: true, durationMinutes: true,
                    service: { select: { id: true, name: true, category: true } }
                }
            },
            payments: { select: { id: true, method: true, amountCents: true, status: true } },
        },
        orderBy: { startAt: 'asc' },
    })
}

export async function getAppointment(tenantId: string, id: string) {
    const appt = await prisma.appointment.findFirst({
        where: { id, tenantId },
        include: {
            client: true,
            staff: true,
            serviceOption: { include: { service: true } },
            payments: true,
        },
    })
    return appt
}

export async function updateAppointmentStatus(tenantId: string, id: string, status: string, notes?: string) {
    // Ensure appointment belongs to this tenant before updating
    const existing = await prisma.appointment.findFirst({ where: { id, tenantId } })
    if (!existing) return null

    return prisma.appointment.update({
        where: { id },
        data: { status, ...(notes !== undefined ? { internalNotes: notes } : {}) },
    })
}

export async function createAppointment(tenantId: string, data: {
    clientId: string
    staffId: string
    serviceOptionId: string
    startAt: Date
    endAt: Date
    status?: string
    clientNotes?: string
}) {
    return prisma.appointment.create({
        data: { tenantId, ...data, status: data.status || 'PENDING_PAYMENT' },
    })
}
