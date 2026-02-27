import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function CRMDashboard() {
    // Basic metrics (in a real app this would be more complex and cached)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsToday = await prisma.appointment.findMany({
        where: {
            startAt: {
                gte: today,
                lt: tomorrow,
            },
            status: { in: ['PENDING_PAYMENT', 'CONFIRMED', 'DONE'] }
        },
        include: {
            service: true
        }
    });

    const appointmentsTodayCount = appointmentsToday.length;

    const estimatedRevenueCents = appointmentsToday.reduce((total, app) => total + app.service.priceCents, 0);
    const estimatedRevenue = new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(estimatedRevenueCents / 100);

    const totalClients = await prisma.client.count();

    const upcomingAppointments = await prisma.appointment.findMany({
        where: {
            startAt: { gte: new Date() },
            status: { in: ['CONFIRMED', 'PENDING_PAYMENT'] }
        },
        orderBy: { startAt: 'asc' },
        take: 5,
        include: { client: true, service: true }
    });

    return (
        <div className="p-8 space-y-8">
            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <span className="material-symbols-outlined">event_available</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Agendamentos Hoje</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{appointmentsTodayCount}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <span className="material-symbols-outlined">payments</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Faturamento Est.</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{estimatedRevenue}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 p-6 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                        <div className="p-2 bg-primary/10 rounded-lg text-primary">
                            <span className="material-symbols-outlined">person_add</span>
                        </div>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">Total de Clientes</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-slate-100 mt-1">{totalClients}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8">
                {/* Table Section */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Próximos Agendamentos</h3>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 dark:bg-slate-800/50">
                                    <tr>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Cliente</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Serviço</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Data/Hora</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
                                        <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                    {upcomingAppointments.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                                                Nenhum agendamento futuro encontrado.
                                            </td>
                                        </tr>
                                    ) : (
                                        upcomingAppointments.map((app) => (
                                            <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300 uppercase">
                                                            {app.client.name.substring(0, 2)}
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">{app.client.name}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">{app.service.name}</td>
                                                <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                                                    {format(new Date(app.startAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                                                </td>
                                                <td className="px-6 py-4">
                                                    {app.status === 'CONFIRMED' ? (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            Confirmado
                                                        </span>
                                                    ) : (
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">
                                                            Pendente Pix
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button className="text-slate-400 hover:text-primary transition-colors">
                                                        <span className="material-symbols-outlined text-xl">edit</span>
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
