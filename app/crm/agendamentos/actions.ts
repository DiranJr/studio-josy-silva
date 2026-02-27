'use server';

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(appointmentId: string, status: 'CONFIRMED' | 'CANCELLED' | 'DONE' | 'NO_SHOW') {
    try {
        await prisma.appointment.update({
            where: { id: appointmentId },
            data: { status }
        });

        revalidatePath('/crm/agendamentos');
        revalidatePath('/crm/clientes');
        revalidatePath('/crm');

        return { success: true };
    } catch (error) {
        console.error("Failed to update appointment status:", error);
        return { success: false, error: "Falha ao atualizar o status do agendamento." };
    }
}
