import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default async function CRMClients() {
    const clients = await prisma.client.findMany({
        include: {
            appointments: {
                orderBy: { startAt: 'desc' },
                take: 1,
                include: { service: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark flex gap-8">
            {/* Client Grid */}
            <div className="flex-1">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Gestão de Clientes</h1>
                        <p className="text-slate-500 dark:text-slate-400">Gerencie e visualize o histórico completo das suas clientes.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    {clients.map(client => {
                        const lastAppointment = client.appointments[0];

                        return (
                            <div key={client.id} className="p-5 bg-white dark:bg-slate-800 rounded-xl border border-primary/5 hover:border-primary/20 shadow-sm flex flex-col gap-4 transition-all cursor-pointer">
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4 items-center">
                                        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xl uppercase">
                                            {client.name.substring(0, 2)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 dark:text-slate-100">{client.name}</h3>
                                            <p className="text-sm text-slate-500 dark:text-slate-400">{client.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between border-t border-slate-100 dark:border-slate-700 pt-4 text-sm">
                                    <div>
                                        <p className="text-slate-400 text-xs uppercase font-bold tracking-tighter">Último Serviço</p>
                                        <p className="font-medium text-slate-700 dark:text-slate-300">
                                            {lastAppointment ? format(new Date(lastAppointment.startAt), "dd/MM/yyyy") : 'Nenhum'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-slate-400 text-xs uppercase font-bold tracking-tighter">Último Serviço Realizado</p>
                                        <p className="font-bold text-primary text-xs mt-1">
                                            {lastAppointment ? lastAppointment.service.name : '-'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    {clients.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            Nenhuma cliente encontrada.
                        </div>
                    )}
                </div>
            </div>

            {/* Client Details Sidebar - Selected Client View (Mock for now) */}
            <aside className="hidden lg:flex w-[350px] bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 overflow-hidden flex-col h-[calc(100vh-8rem)] sticky top-6">
                <div className="p-6 bg-primary/5 border-b border-primary/10 text-center flex flex-col items-center justify-center h-full text-slate-500">
                    <span className="material-symbols-outlined text-4xl mb-4 opacity-50">group</span>
                    <p>Selecione uma cliente para ver os detalhes</p>
                </div>
            </aside>
        </div>
    );
}
