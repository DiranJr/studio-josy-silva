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
        <div style={{ maxWidth: 1000, margin: '0 auto', width: '100%' }}>
            <div className="crm-page-header">
                <h1 className="crm-page-title">Financeiro</h1>
                <p className="crm-page-subtitle">Controle de faturamento e agendamentos por período.</p>
            </div>

            {/* Period filter */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center' }}>
                {presetBtns.map(p => (
                    <button key={p.key} onClick={() => applyPreset(p.key)} className="crm-btn"
                        style={preset === p.key
                            ? { background: 'var(--primary)', color: 'white', border: 'none' }
                            : { background: 'white', border: '1px solid var(--border)', color: 'var(--text-mid)' }}>
                        {p.label}
                    </button>
                ))}

                {preset === "custom" && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.875rem' }}>
                        <input type="date" value={from} onChange={e => setFrom(e.target.value)} className="crm-input" style={{ width: 'auto' }} />
                        <span style={{ color: 'var(--text-light)' }}>até</span>
                        <input type="date" value={to} onChange={e => setTo(e.target.value)} className="crm-input" style={{ width: 'auto' }} />
                        <button onClick={load} className="crm-btn crm-btn-primary">Filtrar</button>
                    </div>
                )}

                <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="crm-input crm-select" style={{ marginLeft: 'auto', width: 'auto' }}>
                    <option value="">Todos os status</option>
                    <option value="CONFIRMED">Confirmados</option>
                    <option value="PENDING_PAYMENT">Pendentes</option>
                    <option value="CANCELLED">Cancelados</option>
                </select>
            </div>

            {/* Stat cards */}
            {stats && (
                <>
                    <div className="crm-stats-grid" style={{ marginBottom: 20 }}>
                        <StatCard icon="💰" label="Receita Total" value={fmtBRL(stats.totalRevenueCents)} sub={`Confirmados`} color="#EDE9FE" />
                        <StatCard icon="📅" label="Agendamentos" value={stats.confirmed.toString()} sub={`${stats.total} no total`} color="#DCFCE7" />
                        <StatCard icon="🏷️" label="Ticket Médio" value={fmtBRL(stats.averageTicketCents)} sub="Por serviço" color="#DBEAFE" />
                        <StatCard icon="🔒" label="Taxas Cobradas" value={fmtBRL(stats.totalReservations)} sub="Reservas" color="#FCE7F3" />
                    </div>

                    {/* By service */}
                    {stats.byService.length > 0 && (
                        <div className="crm-card" style={{ marginBottom: 20 }}>
                            <div className="crm-card-header"><span className="crm-card-title">Receita por Serviço</span></div>
                            <div>
                                {stats.byService.map((s, i) => {
                                    const maxRevenue = stats.byService[0]?.revenueCents || 1;
                                    const pct = Math.round((s.revenueCents / maxRevenue) * 100);
                                    return (
                                        <div key={i} style={{ padding: '12px 20px', borderBottom: '1px solid var(--border)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: '.875rem' }}>
                                                <span style={{ fontWeight: 600, color: 'var(--text-dark)' }}>{s.name}</span>
                                                <div style={{ display: 'flex', gap: 16 }}>
                                                    <span style={{ color: 'var(--text-light)' }}>{s.count} atend.</span>
                                                    <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{fmtBRL(s.revenueCents)}</span>
                                                </div>
                                            </div>
                                            <div style={{ height: 6, background: 'var(--border)', borderRadius: 100, overflow: 'hidden' }}>
                                                <div style={{ height: '100%', background: 'var(--primary)', borderRadius: 100, width: `${pct}%`, transition: 'width .3s' }} />
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
            <div className="crm-card">
                <div className="crm-card-header">
                    <span className="crm-card-title">Lista de Agendamentos</span>
                    <span style={{ fontSize: '.8rem', color: 'var(--text-light)' }}>{appointments.length} registros</span>
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
    return (
        <div className="crm-stat-card">
            <div className="crm-stat-top">
                <span className="crm-stat-label">{label}</span>
                <div className="crm-stat-icon" style={{ background: color }}>{icon}</div>
            </div>
            <div className="crm-stat-value" style={{ fontSize: '1.5rem' }}>{value}</div>
            <div className="crm-stat-delta">{sub}</div>
        </div>
    );
}
