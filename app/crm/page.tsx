import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export const dynamic = "force-dynamic";

const statusLabel: Record<string, { label: string; cls: string }> = {
    CONFIRMED: { label: "Confirmado", cls: "crm-badge crm-badge-confirmed" },
    PENDING_PAYMENT: { label: "Aguard. Pix", cls: "crm-badge crm-badge-pending" },
    DONE: { label: "Concluído", cls: "crm-badge crm-badge-done" },
    CANCELLED: { label: "Cancelado", cls: "crm-badge crm-badge-cancelled" },
};

export default async function CRMDashboard() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const appointmentsToday = await prisma.appointment.findMany({
        where: { startAt: { gte: today, lt: tomorrow }, status: { in: ["PENDING_PAYMENT", "CONFIRMED", "DONE"] } },
        include: { serviceOption: { include: { service: true } } },
    });

    const estimatedRevenueCents = appointmentsToday.reduce((t, a) => t + a.serviceOption.priceCents, 0);
    const estimatedRevenue = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(estimatedRevenueCents / 100);
    const totalClients = await prisma.client.count();

    const upcoming = await prisma.appointment.findMany({
        where: { startAt: { gte: new Date() }, status: { in: ["CONFIRMED", "PENDING_PAYMENT"] } },
        orderBy: { startAt: "asc" },
        take: 8,
        include: { client: true, serviceOption: { include: { service: true } } },
    });

    return (
        <>
            {/* Page header */}
            <div className="crm-page-header">
                <h1 className="crm-page-title">Dashboard</h1>
                <p className="crm-page-subtitle">Visão geral do seu negócio hoje, {format(new Date(), "d 'de' MMMM", { locale: ptBR })}.</p>
            </div>

            {/* Stats */}
            <div className="crm-stats-grid">
                <div className="crm-stat-card">
                    <div className="crm-stat-top">
                        <span className="crm-stat-label">Agendamentos hoje</span>
                        <div className="crm-stat-icon" style={{ background: "#EDE9FE" }}>📅</div>
                    </div>
                    <div className="crm-stat-value">{appointmentsToday.length}</div>
                    <div className="crm-stat-delta">Total do dia atual</div>
                </div>

                <div className="crm-stat-card">
                    <div className="crm-stat-top">
                        <span className="crm-stat-label">Faturamento Est.</span>
                        <div className="crm-stat-icon" style={{ background: "#DCFCE7" }}>💰</div>
                    </div>
                    <div className="crm-stat-value" style={{ fontSize: "1.4rem" }}>{estimatedRevenue}</div>
                    <div className="crm-stat-delta">Receita estimada hoje</div>
                </div>

                <div className="crm-stat-card">
                    <div className="crm-stat-top">
                        <span className="crm-stat-label">Total de Clientes</span>
                        <div className="crm-stat-icon" style={{ background: "#FCE7F3" }}>👥</div>
                    </div>
                    <div className="crm-stat-value">{totalClients}</div>
                    <div className="crm-stat-delta">Clientes cadastrados</div>
                </div>

                <div className="crm-stat-card">
                    <div className="crm-stat-top">
                        <span className="crm-stat-label">Próximos</span>
                        <div className="crm-stat-icon" style={{ background: "#FEF9C3" }}>🔔</div>
                    </div>
                    <div className="crm-stat-value">{upcoming.length}</div>
                    <div className="crm-stat-delta">Agendamentos futuros</div>
                </div>
            </div>

            {/* Upcoming appointments table */}
            <div className="crm-card">
                <div className="crm-card-header">
                    <span className="crm-card-title">Próximos Agendamentos</span>
                    <a href="/crm/agendamentos" className="crm-card-action">Ver todos →</a>
                </div>

                {upcoming.length === 0 ? (
                    <div className="crm-empty">
                        <div className="crm-empty-icon">📭</div>
                        <div className="crm-empty-title">Nenhum agendamento futuro</div>
                        <div className="crm-empty-desc">Quando clientes agendarem pelo seu site, eles aparecerão aqui.</div>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table className="crm-table">
                            <thead>
                                <tr>
                                    <th>Cliente</th>
                                    <th>Serviço</th>
                                    <th>Data/Hora</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {upcoming.map((app) => {
                                    const st = statusLabel[app.status] ?? { label: app.status, cls: "crm-badge" };
                                    return (
                                        <tr key={app.id}>
                                            <td>
                                                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                                    <div className="crm-user-avatar" style={{ width: 32, height: 32, fontSize: ".75rem" }}>
                                                        {app.client.name.substring(0, 1).toUpperCase()}
                                                    </div>
                                                    <strong style={{ fontWeight: 600 }}>{app.client.name}</strong>
                                                </div>
                                            </td>
                                            <td>
                                                {app.serviceOption.service.name}
                                                <div style={{ fontSize: ".75rem", color: "var(--text-light)", marginTop: 2 }}>
                                                    {app.serviceOption.type === "APPLICATION" ? "Aplicação" : "Manutenção"}
                                                </div>
                                            </td>
                                            <td style={{ whiteSpace: "nowrap" }}>
                                                {format(new Date(app.startAt), "dd/MM 'às' HH:mm", { locale: ptBR })}
                                            </td>
                                            <td>
                                                <span className={st.cls}>{st.label}</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </>
    );
}
