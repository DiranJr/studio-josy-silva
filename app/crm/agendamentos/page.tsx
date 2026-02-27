import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CalendarSidebar from "./CalendarSidebar";
import AppointmentActions from "./AppointmentActions";

export default async function CRMAppointments({ searchParams }: { searchParams: { date?: string } }) {
    // Basic date parsing from URL or use today
    const queryDateStr = searchParams.date || new Date().toISOString();
    const queryDate = new Date(queryDateStr);

    // Normalize to start and end of day for the query
    const startOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    const appointments = await prisma.appointment.findMany({
        where: {
            startAt: {
                gte: startOfDay,
                lt: endOfDay
            }
        },
        include: {
            client: true,
            serviceOption: { include: { service: true } }
        },
        orderBy: {
            startAt: 'asc'
        }
    });

    return (
        <div className="p-8 space-y-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Agendamentos</h1>
                    <p className="text-slate-500 dark:text-slate-400">Gerencie a agenda do dia.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg font-bold shadow-md shadow-primary/20">
                        <span className="material-symbols-outlined">add</span>
                        Novo Agendamento
                    </button>
                </div>
            </div>

            <div className="flex gap-8 flex-1 overflow-hidden">
                {/* Agenda List */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden min-h-0">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50 shrink-0">
                        <h3 className="font-bold text-slate-800 dark:text-slate-200">
                            Agenda para {format(startOfDay, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                        </h3>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {appointments.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                                <span className="material-symbols-outlined text-4xl mb-4 opacity-50">free_cancellation</span>
                                <p>Nenhum agendamento para este dia.</p>
                            </div>
                        ) : (
                            appointments.map(app => (
                                <div key={app.id} className="flex gap-4 p-4 rounded-xl border border-slate-100 dark:border-slate-800 hover:border-primary/20 transition-colors shadow-sm bg-white dark:bg-slate-800">
                                    <div className="w-20 text-center shrink-0 flex flex-col justify-center border-r border-slate-100 dark:border-slate-700 pr-4">
                                        <p className="text-xl font-bold font-display text-slate-800 dark:text-slate-200">{format(new Date(app.startAt), "HH:mm")}</p>
                                        <p className="text-xs text-slate-400">{app.serviceOption.durationMinutes} min</p>
                                    </div>
                                    <div className="flex-1 flex flex-col">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-slate-900 dark:text-slate-100 text-lg">{app.client.name}</h4>
                                            {app.status === 'CONFIRMED' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400">
                                                    <span className="material-symbols-outlined text-[14px]">check_circle</span>Confirmado
                                                </span>
                                            ) : app.status === 'PENDING_PAYMENT' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400">
                                                    <span className="material-symbols-outlined text-[14px]">schedule</span>Pendente Taxa de Reserva
                                                </span>
                                            ) : app.status === 'CANCELLED' ? (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400">
                                                    <span className="material-symbols-outlined text-[14px]">cancel</span>Cancelado
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400">
                                                    {app.status}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                            {app.serviceOption.service.name} - {app.serviceOption.type === 'APPLICATION' ? 'Aplicação' : 'Manutenção'}
                                        </p>

                                        <div className="mt-auto pt-4">
                                            <AppointmentActions appointmentId={app.id} currentStatus={app.status} />
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Calendar Side Panel */}
                <CalendarSidebar initialDate={startOfDay.toISOString()} />
            </div>
        </div>
    );
}
