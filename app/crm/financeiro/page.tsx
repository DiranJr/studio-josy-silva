"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { format, subDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

type Stat = {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    totalRevenueCents: number;
    totalReservations: number;
    averageTicketCents: number;
    byService: { name: string; count: number; revenueCents: number }[];
};

type Appointment = {
    id: string;
    startAt: string;
    status: string;
    client: { name: string; phone: string };
    serviceOption: { type: string; priceCents: number; service: { name: string } };
};

function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("crm_token") || "" : "";
}

function fmtBRL(cents: number) {
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function fmtDate(d: string) {
    return format(new Date(d), "dd/MM/yyyy HH:mm", { locale: ptBR });
}

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
    CONFIRMED: { label: "Confirmado", cls: "bg-green-100 text-green-700" },
    PENDING_PAYMENT: { label: "Pendente Taxa", cls: "bg-yellow-100 text-yellow-700" },
    CANCELLED: { label: "Cancelado", cls: "bg-red-100 text-red-700" },
};

type Preset = "week" | "month" | "lastMonth" | "custom";

export default function FinanceiroPage() {
    const router = useRouter();
    const [stats, setStats] = useState<Stat | null>(null);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [preset, setPreset] = useState<Preset>("month");
    const [from, setFrom] = useState(format(startOfMonth(new Date()), "yyyy-MM-dd"));
    const [to, setTo] = useState(format(endOfMonth(new Date()), "yyyy-MM-dd"));
    const [statusFilter, setStatusFilter] = useState("");

    const load = useCallback(async () => {
        setLoading(true);
        const params = new URLSearchParams({ from, to });
        if (statusFilter) params.append("status", statusFilter);

        const res = await fetch(`/api/crm/financeiro?${params}`, {
            headers: { Authorization: `Bearer ${getToken()}` },
        });
        if (res.status === 401 || res.status === 403) { router.push("/login"); return; }
        const data = await res.json();
        setStats(data.stats);
        setAppointments(data.appointments);
        setLoading(false);
    }, [from, to, statusFilter, router]);

    useEffect(() => { load(); }, [load]);

    function applyPreset(p: Preset) {
        const now = new Date();
        setPreset(p);
        if (p === "week") { setFrom(format(startOfWeek(now, { locale: ptBR }), "yyyy-MM-dd")); setTo(format(endOfWeek(now, { locale: ptBR }), "yyyy-MM-dd")); }
        if (p === "month") { setFrom(format(startOfMonth(now), "yyyy-MM-dd")); setTo(format(endOfMonth(now), "yyyy-MM-dd")); }
        if (p === "lastMonth") {
            const last = new Date(now.getFullYear(), now.getMonth() - 1, 1);
            setFrom(format(startOfMonth(last), "yyyy-MM-dd")); setTo(format(endOfMonth(last), "yyyy-MM-dd"));
        }
    }

    const presetBtns: { key: Preset; label: string }[] = [
        { key: "week", label: "Esta semana" },
        { key: "month", label: "Este mês" },
        { key: "lastMonth", label: "Mês passado" },
        { key: "custom", label: "Personalizado" },
    ];

    return (
        <div className="p-8 max-w-6xl mx-auto w-full">
            <div className="mb-8">
                <h1 className="text-2xl font-extrabold text-slate-800">Financeiro</h1>
                <p className="text-slate-500 text-sm mt-1">Controle de faturamento e agendamentos.</p>
            </div>

            {/* Period filter */}
            <div className="flex flex-wrap gap-3 mb-6 items-center">
                {presetBtns.map(p => (
                    <button key={p.key} onClick={() => applyPreset(p.key)}
                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${preset === p.key ? "bg-primary text-white" : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"}`}>
                        {p.label}
                    </button>
                ))}

                {preset === "custom" && (
                    <div className="flex items-center gap-2 text-sm">
                        <input type="date" value={from} onChange={e => setFrom(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        <span className="text-slate-400">até</span>
                        <input type="date" value={to} onChange={e => setTo(e.target.value)}
                            className="border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                        <button onClick={load} className="bg-primary text-white px-4 py-2 rounded-xl font-bold">Filtrar</button>
                    </div>
                )}

                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
                    className="ml-auto border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none">
                    <option value="">Todos os status</option>
                    <option value="CONFIRMED">Confirmados</option>
                    <option value="PENDING_PAYMENT">Pendentes</option>
                    <option value="CANCELLED">Cancelados</option>
                </select>
            </div>

            {/* Stat cards */}
            {stats && (
                <>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard icon="payments" label="Receita Total" value={fmtBRL(stats.totalRevenueCents)} sub={`Confirmados`} color="primary" />
                        <StatCard icon="calendar_check" label="Agendamentos" value={stats.confirmed.toString()} sub={`${stats.total} no total`} color="green" />
                        <StatCard icon="receipt" label="Ticket Médio" value={fmtBRL(stats.averageTicketCents)} sub="Por serviço" color="blue" />
                        <StatCard icon="lock" label="Taxas Cobradas" value={fmtBRL(stats.totalReservations)} sub="Reservas" color="purple" />
                    </div>

                    {/* By service */}
                    {stats.byService.length > 0 && (
                        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm mb-6 overflow-hidden">
                            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                                <h2 className="font-bold text-slate-700">Receita por Serviço</h2>
                            </div>
                            <div className="divide-y divide-slate-50">
                                {stats.byService.map((s, i) => {
                                    const maxRevenue = stats.byService[0]?.revenueCents || 1;
                                    const pct = Math.round((s.revenueCents / maxRevenue) * 100);
                                    return (
                                        <div key={i} className="px-6 py-4">
                                            <div className="flex justify-between mb-1.5">
                                                <span className="text-sm font-semibold text-slate-700">{s.name}</span>
                                                <div className="flex gap-4 text-sm">
                                                    <span className="text-slate-400">{s.count} atend.</span>
                                                    <span className="font-bold text-slate-800">{fmtBRL(s.revenueCents)}</span>
                                                </div>
                                            </div>
                                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${pct}%` }} />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}

            {/* Appointments table */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
                    <h2 className="font-bold text-slate-700">Lista de Agendamentos</h2>
                    <span className="text-sm text-slate-500">{appointments.length} registros</span>
                </div>
                {loading ? (
                    <div className="p-8 text-center text-slate-400">Carregando...</div>
                ) : appointments.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">Nenhum agendamento no período.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="border-b border-slate-100">
                                <tr className="text-left text-xs font-bold text-slate-400 uppercase tracking-wider">
                                    <th className="px-6 py-3">Data</th>
                                    <th className="px-6 py-3">Cliente</th>
                                    <th className="px-6 py-3">Serviço</th>
                                    <th className="px-6 py-3">Valor</th>
                                    <th className="px-6 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {appointments.map(app => {
                                    const st = STATUS_LABELS[app.status] || { label: app.status, cls: "bg-slate-100 text-slate-600" };
                                    return (
                                        <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-slate-700">{fmtDate(app.startAt)}</td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-800">{app.client.name}</p>
                                                <p className="text-slate-400 text-xs">{app.client.phone}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-slate-700">{app.serviceOption.service.name}</p>
                                                <p className="text-xs text-slate-400">{app.serviceOption.type === "APPLICATION" ? "Aplicação" : "Manutenção"}</p>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-800">{fmtBRL(app.serviceOption.priceCents)}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold px-3 py-1 rounded-full ${st.cls}`}>{st.label}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, sub, color }: { icon: string; label: string; value: string; sub: string; color: string }) {
    const colors: Record<string, string> = {
        primary: "bg-primary/10 text-primary",
        green: "bg-green-100 text-green-600",
        blue: "bg-blue-100 text-blue-600",
        purple: "bg-purple-100 text-purple-600",
    };
    return (
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-5">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${colors[color]}`}>
                <span className="material-symbols-outlined text-[20px]">{icon}</span>
            </div>
            <p className="text-2xl font-extrabold text-slate-800">{value}</p>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-0.5">{label}</p>
            <p className="text-xs text-slate-400 mt-1">{sub}</p>
        </div>
    );
}
