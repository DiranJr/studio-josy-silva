'use client';

import { useTransition } from "react";
import { updateAppointmentStatus } from "./actions";

interface AppointmentActionsProps {
    appointmentId: string;
    currentStatus: string;
}

export default function AppointmentActions({ appointmentId, currentStatus }: AppointmentActionsProps) {
    const [isPending, startTransition] = useTransition();

    const handleUpdateStatus = (status: 'CONFIRMED' | 'CANCELLED') => {
        if (confirm(`Tem certeza que deseja marcar este agendamento como ${status === 'CONFIRMED' ? 'Confirmado' : 'Cancelado'}?`)) {
            startTransition(async () => {
                await updateAppointmentStatus(appointmentId, status);
            });
        }
    };

    if (currentStatus === 'CANCELLED' || currentStatus === 'DONE') {
        return (
            <button className="text-xs font-semibold text-slate-400 flex items-center gap-1 cursor-not-allowed" disabled>
                <span className="material-symbols-outlined text-sm">visibility</span> Detalhes
            </button>
        );
    }

    return (
        <div className="flex gap-2 items-center">
            {currentStatus !== 'CONFIRMED' && (
                <button
                    onClick={() => handleUpdateStatus('CONFIRMED')}
                    disabled={isPending}
                    className="text-xs font-semibold text-green-600 hover:text-green-700 dark:text-green-500 dark:hover:text-green-400 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                    <span className="material-symbols-outlined text-sm">check</span> Confirmar
                </button>
            )}

            <button
                onClick={() => handleUpdateStatus('CANCELLED')}
                disabled={isPending}
                className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1 disabled:opacity-50"
            >
                <span className="material-symbols-outlined text-sm">close</span> Cancelar
            </button>

            <button className="text-xs font-semibold text-primary/80 hover:text-primary transition-colors flex items-center gap-1 ml-2">
                <span className="material-symbols-outlined text-sm">visibility</span> Detalhes
            </button>
        </div>
    );
}
