import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import CalendarSidebar from "./CalendarSidebar";
import AppointmentActions from "./AppointmentActions";

export const dynamic = "force-dynamic";

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
    CONFIRMED: { label: "✓ Confirmado", cls: "crm-badge crm-badge-confirmed" },
    PENDING_PAYMENT: { label: "⏳ Aguard. Pix", cls: "crm-badge crm-badge-pending" },
    DONE: { label: "✔ Concluído", cls: "crm-badge crm-badge-done" },
    CANCELLED: { label: "✕ Cancelado", cls: "crm-badge crm-badge-cancelled" },
};

export default async function CRMAppointments({ searchParams }: { searchParams: { date?: string } }) {
    const queryDateStr = searchParams.date || new Date().toISOString();
    const queryDate = new Date(queryDateStr);
    const startOfDay = new Date(queryDate.getFullYear(), queryDate.getMonth(), queryDate.getDate());
    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(startOfDay.getDate() + 1);

    const appointments = await prisma.appointment.findMany({
        where: { startAt: { gte: startOfDay, lt: endOfDay } },
        include: { client: true, serviceOption: { include: { service: true } } },
        orderBy: { startAt: 'asc' }
    });

    const dayLabel = format(startOfDay, "EEEE, d 'de' MMMM", { locale: ptBR });

    return (
        <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 116px)', overflow: 'hidden' }}>

            {/* Main: appointment list */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
                <div className="crm-page-header" style={{ marginBottom: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="crm-page-title">Agendamentos</h1>
                            <p className="crm-page-subtitle" style={{ textTransform: 'capitalize' }}>{dayLabel}</p>
                        </div>
                        <button className="crm-btn crm-btn-primary">+ Novo agendamento</button>
                    </div>
                </div>

                <div className="crm-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    <div className="crm-card-header">
                        <span className="crm-card-title">
                            {appointments.length > 0 ? `${appointments.length} agendamento${appointments.length > 1 ? 's' : ''}` : 'Sem agendamentos'}
                        </span>
                    </div>

                    <div style={{ flex: 1, overflowY: 'auto', padding: '8px 0' }}>
                        {appointments.length === 0 ? (
                            <div className="crm-empty">
                                <div className="crm-empty-icon">📭</div>
                                <div className="crm-empty-title">Nenhum agendamento para este dia</div>
                                <div className="crm-empty-desc">Navegue pelo calendário para ver outros dias.</div>
                            </div>
                        ) : (
                            appointments.map(app => {
                                const st = STATUS_MAP[app.status] ?? { label: app.status, cls: "crm-badge" };
                                const timeStr = format(new Date(app.startAt), "HH:mm");
                                const dur = app.serviceOption.durationMinutes;
                                return (
                                    <div key={app.id} style={{
                                        display: 'flex',
                                        gap: 16,
                                        padding: '14px 20px',
                                        borderBottom: '1px solid var(--border)',
                                        alignItems: 'flex-start',
                                    }}>
                                        {/* Time column */}
                                        <div style={{ width: 64, textAlign: 'center', flexShrink: 0, borderRight: '1px solid var(--border)', paddingRight: 16 }}>
                                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-dark)', lineHeight: 1 }}>{timeStr}</div>
                                            <div style={{ fontSize: '.72rem', color: 'var(--text-light)', marginTop: 4 }}>{dur} min</div>
                                        </div>

                                        {/* Info */}
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, flexWrap: 'wrap' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--text-dark)' }}>{app.client.name}</div>
                                                    <div style={{ fontSize: '.82rem', color: 'var(--text-mid)', marginTop: 2 }}>
                                                        {app.serviceOption.service.name} · {app.serviceOption.type === 'APPLICATION' ? 'Aplicação' : 'Manutenção'}
                                                    </div>
                                                    {app.client.phone && (
                                                        <div style={{ fontSize: '.78rem', color: 'var(--text-light)', marginTop: 2 }}>📞 {app.client.phone}</div>
                                                    )}
                                                </div>
                                                <span className={st.cls}>{st.label}</span>
                                            </div>
                                            <div style={{ marginTop: 10 }}>
                                                <AppointmentActions appointmentId={app.id} currentStatus={app.status} />
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {/* Calendar sidebar */}
            <div style={{ width: 280, flexShrink: 0 }}>
                <CalendarSidebar initialDate={startOfDay.toISOString()} />
            </div>
        </div>
    );
}
