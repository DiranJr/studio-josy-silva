import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import ClientSearch from "./ClientSearch";

export default async function CRMClients({ searchParams }: { searchParams: { q?: string, page?: string, clientId?: string } }) {
    const q = searchParams.q || "";
    const page = parseInt(searchParams.page || "1", 10);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    const where = q ? {
        OR: [
            { name: { contains: q, mode: 'insensitive' as const } },
            { phone: { contains: q } },
        ]
    } : {};

    const [clients, totalItems] = await Promise.all([
        prisma.client.findMany({
            where,
            include: {
                appointments: {
                    orderBy: { startAt: 'desc' },
                    take: 1,
                    include: { serviceOption: { include: { service: true } } }
                }
            },
            orderBy: { name: 'asc' },
            skip,
            take: pageSize,
        }),
        prisma.client.count({ where })
    ]);

    const totalPages = Math.ceil(totalItems / pageSize);

    let selectedClient = null;
    if (searchParams.clientId) {
        selectedClient = await prisma.client.findUnique({
            where: { id: searchParams.clientId },
            include: {
                appointments: {
                    orderBy: { startAt: 'desc' },
                    include: { serviceOption: { include: { service: true } }, staff: true }
                }
            }
        });
    }

    return (
        <div className="flex-1 overflow-y-auto p-8 bg-background-light dark:bg-background-dark flex gap-8">
            {/* Client Grid */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="flex items-center justify-between mb-8 shrink-0">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">Gestão de Clientes</h1>
                        <p className="text-slate-500 dark:text-slate-400">Gerencie e visualize o histórico completo das suas clientes.</p>
                    </div>
                </div>

                <div className="mb-6 shrink-0">
                    <ClientSearch initialQuery={q} />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 overflow-y-auto pb-4 pr-2">
                    {clients.map(client => {
                        const lastAppointment = client.appointments[0];
                        const isSelected = searchParams.clientId === client.id;

                        return (
                            <Link href={`/crm/clientes?${new URLSearchParams({ ...searchParams, clientId: client.id }).toString()}`} key={client.id} className={`p-5 bg-white dark:bg-slate-800 rounded-xl border ${isSelected ? 'border-primary shadow-md' : 'border-primary/5 hover:border-primary/20 shadow-sm'} flex flex-col gap-4 transition-all cursor-pointer`}>
                                <div className="flex justify-between items-start">
                                    <div className="flex gap-4 items-center">
                                        <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-slate-500 font-bold text-xl uppercase shrink-0">
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
                                            {lastAppointment ? lastAppointment.serviceOption.service.name : '-'}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}

                    {clients.length === 0 && (
                        <div className="col-span-full py-12 text-center text-slate-500">
                            Nenhuma cliente encontrada.
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex justify-center mt-6 gap-2 shrink-0">
                        {page > 1 && (
                            <Link href={`/crm/clientes?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() }).toString()}`} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                                Anterior
                            </Link>
                        )}
                        <span className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg">Página {page} de {totalPages}</span>
                        {page < totalPages && (
                            <Link href={`/crm/clientes?${new URLSearchParams({ ...searchParams, page: (page + 1).toString() }).toString()}`} className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700">
                                Próxima
                            </Link>
                        )}
                    </div>
                )}
            </div>

            {/* Client Details Sidebar */}
            <aside className="hidden lg:flex w-[400px] shrink-0 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-primary/10 overflow-hidden flex-col h-[calc(100vh-8rem)] sticky top-6">
                {!selectedClient ? (
                    <div className="p-6 bg-primary/5 border-b border-primary/10 text-center flex flex-col items-center justify-center h-full text-slate-500">
                        <span className="material-symbols-outlined text-4xl mb-4 opacity-50">group</span>
                        <p>Selecione uma cliente para ver os detalhes</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full">
                        <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center text-center">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-3xl uppercase mb-4">
                                {selectedClient.name.substring(0, 2)}
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedClient.name}</h2>
                            <p className="text-slate-500 dark:text-slate-400 mt-1">{selectedClient.phone}</p>
                            {selectedClient.email && <p className="text-slate-500 dark:text-slate-400 text-sm">{selectedClient.email}</p>}
                        </div>

                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div>
                                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider mb-4">Histórico de Agendamentos</h3>
                                {selectedClient.appointments.length === 0 ? (
                                    <p className="text-slate-500 text-sm">Nenhum agendamento encontrado.</p>
                                ) : (
                                    <div className="space-y-4">
                                        {selectedClient.appointments.map(app => (
                                            <div key={app.id} className="p-4 rounded-lg border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
                                                <div className="flex justify-between items-start mb-2">
                                                    <span className="font-semibold text-slate-800 dark:text-slate-200">{app.serviceOption.service.name} <span className="text-xs text-slate-500 font-normal">({app.serviceOption.type === 'APPLICATION' ? 'Aplicação' : 'Manutenção'})</span></span>
                                                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                                        {app.status}
                                                    </span>
                                                </div>
                                                <div className="text-sm text-slate-500 dark:text-slate-400 flex flex-col gap-1">
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">calendar_today</span> {format(new Date(app.startAt), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
                                                    <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {format(new Date(app.startAt), "HH:mm")}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </aside>
        </div>
    );
}
