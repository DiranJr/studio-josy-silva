export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { parseISO, startOfDay, endOfDay, addMinutes, isBefore, isAfter, isSameDay } from 'date-fns'

/**
 * @swagger
 * /api/public/availability:
 *   get:
 *     summary: Get available appointment slots
 *     description: Returns a list of available HH:mm slots for a given service and date, considering staff working hours, existing appointments, and blocks.
 *     tags:
 *       - Public
 *     parameters:
 *       - in: query
 *         name: serviceId
 *         required: true
 *         schema:
 *           type: string
 *         description: The UUID of the service
 *       - in: query
 *         name: date
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The target date (YYYY-MM-DD)
 *       - in: query
 *         name: staffId
 *         required: false
 *         schema:
 *           type: string
 *         description: The UUID of the staff member (optional, defaults to first active staff)
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 availableSlots:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["09:00", "09:30", "10:00"]
 *       400:
 *         description: Missing parameters
 *       404:
 *         description: Service not found
 *       500:
 *         description: Server configuration error
 */
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url)
        const serviceOptionId = searchParams.get('serviceOptionId')
        const dateStr = searchParams.get('date')
        const staffId = searchParams.get('staffId') // optional in MVP if there's only 1 staff

        if (!serviceOptionId || !dateStr) {
            return NextResponse.json({ error: 'serviceOptionId and date are required' }, { status: 400 })
        }

        const date = parseISO(dateStr)
        const weekday = date.getDay()

        // 1. Get Service Option
        const serviceOption = await prisma.serviceOption.findUnique({
            where: { id: serviceOptionId },
            include: { service: true }
        })

        if (!serviceOption || !serviceOption.active || !serviceOption.service.active) {
            return NextResponse.json({ error: 'SERVICE_OPTION_INACTIVE' }, { status: 404 })
        }

        if (serviceOption.durationMinutes <= 0) {
            return NextResponse.json({ error: 'Invalid service duration' }, { status: 400 })
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
            const slotEnd = addMinutes(currentSlot, serviceOption.durationMinutes + settings.bufferMinutes)

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



