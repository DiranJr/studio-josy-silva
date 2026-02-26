import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parseISO, startOfDay, endOfDay, addMinutes, isBefore, isAfter, isSameDay } from 'date-fns'

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const serviceId = searchParams.get('serviceId')
        const dateStr = searchParams.get('date')
        const staffId = searchParams.get('staffId') // optional in MVP if there's only 1 staff

        if (!serviceId || !dateStr) {
            return NextResponse.json({ error: 'serviceId and date are required' }, { status: 400 })
        }

        const date = parseISO(dateStr)
        const weekday = date.getDay()

        // 1. Get Service
        const service = await prisma.service.findUnique({
            where: { id: serviceId }
        })
        if (!service || !service.active) {
            return NextResponse.json({ error: 'Service not found or inactive' }, { status: 404 })
        }

        // 2. Get Settings
        const settings = await prisma.settings.findFirst()
        if (!settings) {
            return NextResponse.json({ error: 'Settings not configured' }, { status: 500 })
        }

        // 3. Get Staff Requirements
        let targetStaffId = staffId
        if (!targetStaffId) {
            const firstStaff = await prisma.staff.findFirst({ where: { active: true } })
            if (!firstStaff) return NextResponse.json({ error: 'No active staff found' }, { status: 500 })
            targetStaffId = firstStaff.id
        }

        // 4. Get Working Hours for that day
        const workingHours = await prisma.workingHours.findFirst({
            where: {
                staffId: targetStaffId,
                weekday: weekday
            }
        })

        if (!workingHours) {
            return NextResponse.json({ availableSlots: [] })
        }

        // Parse start and end times for the working day
        const [startH, startM] = workingHours.startTime.split(':').map(Number)
        const [endH, endM] = workingHours.endTime.split(':').map(Number)

        const dayStart = startOfDay(date)
        dayStart.setHours(startH, startM, 0, 0)

        const dayEnd = startOfDay(date)
        dayEnd.setHours(endH, endM, 0, 0)

        // 5. Get existing Appointments and Blocks for that staff on that date
        const appointments = await prisma.appointment.findMany({
            where: {
                staffId: targetStaffId,
                startAt: { gte: startOfDay(date) },
                endAt: { lte: endOfDay(date) },
                status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] }
            }
        })

        const blocks = await prisma.block.findMany({
            where: {
                staffId: targetStaffId,
                startAt: { gte: startOfDay(date) },
                endAt: { lte: endOfDay(date) }
            }
        })

        // 6. Generate Candidate Slots
        const availableSlots: string[] = []
        const nowLocal = new Date() // Ideally use timezone config, simplified for now
        const minAdvanceTime = addMinutes(nowLocal, settings.minAdvanceMinutes)

        let currentSlot = dayStart

        while (isBefore(currentSlot, dayEnd)) {
            const slotEnd = addMinutes(currentSlot, service.durationMinutes + settings.bufferMinutes)

            // a) Check if slot ends after working hours
            if (isAfter(slotEnd, dayEnd)) {
                break; // Doesn't fit in remaining day time
            }

            // b) Check advance time
            if (isBefore(currentSlot, minAdvanceTime)) {
                currentSlot = addMinutes(currentSlot, settings.slotMinutes)
                continue
            }

            // c) Check Block conflict
            const hasBlockConflict = blocks.some(b => {
                return (isBefore(currentSlot, b.endAt) && isAfter(slotEnd, b.startAt)) ||
                    (currentSlot.getTime() === b.startAt.getTime())
            })

            // d) Check Appointment conflict
            const hasApptConflict = appointments.some(a => {
                return (isBefore(currentSlot, a.endAt) && isAfter(slotEnd, a.startAt)) ||
                    (currentSlot.getTime() === a.startAt.getTime())
            })

            if (!hasBlockConflict && !hasApptConflict) {
                // Format time to HH:mm string manually
                const slotHours = currentSlot.getHours().toString().padStart(2, '0')
                const slotMins = currentSlot.getMinutes().toString().padStart(2, '0')
                availableSlots.push(`${slotHours}:${slotMins}`)
            }

            currentSlot = addMinutes(currentSlot, settings.slotMinutes)
        }

        return NextResponse.json({ availableSlots })
    } catch (error) {
        console.error('Failed to get availability:', error)
        return NextResponse.json({ error: 'Failed to calculate availability' }, { status: 500 })
    }
}
