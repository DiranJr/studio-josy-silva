import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import ClientSearch from "./ClientSearch";

export const dynamic = "force-dynamic";

export default async function CRMClients({ searchParams }: { searchParams: { q?: string, page?: string, clientId?: string } }) {
    const q = searchParams.q || "";
    const page = parseInt(searchParams.page || "1", 10);
    const pageSize = 12;
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
                },
                _count: { select: { appointments: true } }
            },
            orderBy: { name: 'asc' },
            skip, take: pageSize,
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

    const STATUS_LABELS: Record<string, string> = {
        CONFIRMED: 'Confirmado', PENDING_PAYMENT: 'Aguard. Pix', DONE: 'Concluído', CANCELLED: 'Cancelado'
    };
    const STATUS_CLS: Record<string, string> = {
        CONFIRMED: 'crm-badge crm-badge-confirmed', PENDING_PAYMENT: 'crm-badge crm-badge-pending',
        DONE: 'crm-badge crm-badge-done', CANCELLED: 'crm-badge crm-badge-cancelled',
    };

    return (
        <div style={{ display: 'flex', gap: 20, height: 'calc(100vh - 116px)', overflow: 'hidden' }}>

            {/* Client list */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <div className="crm-page-header">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <h1 className="crm-page-title">Clientes</h1>
                            <p className="crm-page-subtitle">{totalItems} cliente{totalItems !== 1 ? 's' : ''} cadastrado{totalItems !== 1 ? 's' : ''}</p>
                        </div>
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <ClientSearch initialQuery={q} />
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 12, paddingBottom: 16 }}>
                        {clients.map(client => {
                            const lastApp = client.appointments[0];
                            const isSelected = searchParams.clientId === client.id;
                            return (
                                <Link
                                    key={client.id}
                                    href={`/crm/clientes?${new URLSearchParams({ ...searchParams, clientId: client.id }).toString()}`}
                                    style={{ textDecoration: 'none' }}
                                >
                                    <div style={{
                                        background: 'white',
                                        border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                                        borderRadius: 'var(--radius-lg)',
                                        padding: 16,
                                        cursor: 'pointer',
                                        transition: 'border-color .15s',
                                        boxShadow: isSelected ? 'var(--shadow-primary)' : 'var(--shadow-sm)',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                                            <div className="crm-user-avatar" style={{ width: 40, height: 40, fontSize: '.9rem', flexShrink: 0 }}>
                                                {client.name.substring(0, 1).toUpperCase()}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{ fontWeight: 700, fontSize: '.9rem', color: 'var(--text-dark)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{client.name}</div>
                                                <div style={{ fontSize: '.78rem', color: 'var(--text-light)', marginTop: 1 }}>{client.phone}</div>
                                            </div>
                                        </div>
                                        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 10, display: 'flex', justifyContent: 'space-between', fontSize: '.78rem' }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.05em', fontSize: '.68rem', marginBottom: 2 }}>Último serviço</div>
                                                <div style={{ fontWeight: 600, color: 'var(--text-dark)' }}>
                                                    {lastApp ? format(new Date(lastApp.startAt), "dd/MM/yyyy") : '—'}
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'right' }}>
                                                <div style={{ fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.05em', fontSize: '.68rem', marginBottom: 2 }}>Atendimentos</div>
                                                <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{client._count.appointments}</div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })}
                        {clients.length === 0 && (
                            <div style={{ gridColumn: '1/-1' }}>
                                <div className="crm-empty">
                                    <div className="crm-empty-icon">👥</div>
                                    <div className="crm-empty-title">Nenhum cliente encontrado</div>
                                    <div className="crm-empty-desc">Tente outro nome ou deixe o campo de busca vazio para ver todos.</div>
                                </div>
                            </div>
                        )}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, padding: '12px 0' }}>
                            {page > 1 && (
                                <Link href={`/crm/clientes?${new URLSearchParams({ ...searchParams, page: (page - 1).toString() }).toString()}`} className="crm-btn crm-btn-ghost">← Anterior</Link>
                            )}
                            <span className="crm-btn" style={{ background: 'var(--primary-light)', color: 'var(--primary)', cursor: 'default', border: 'none' }}>Pág. {page} / {totalPages}</span>
                            {page < totalPages && (
                                <Link href={`/crm/clientes?${new URLSearchParams({ ...searchParams, page: (page + 1).toString() }).toString()}`} className="crm-btn crm-btn-ghost">Próxima →</Link>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Client details panel */}
            <div style={{ width: 320, flexShrink: 0 }}>
                <div className="crm-card" style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                    {!selectedClient ? (
                        <div className="crm-empty" style={{ padding: '40px 20px' }}>
                            <div className="crm-empty-icon">👤</div>
                            <div className="crm-empty-title">Selecione um cliente</div>
                            <div className="crm-empty-desc">Clique em um cliente para ver o histórico completo.</div>
                        </div>
                    ) : (
                        <>
                            <div style={{ padding: 20, textAlign: 'center', borderBottom: '1px solid var(--border)', background: 'var(--bg)' }}>
                                <div className="crm-user-avatar" style={{ width: 56, height: 56, fontSize: '1.2rem', margin: '0 auto 12px' }}>
                                    {selectedClient.name.substring(0, 1).toUpperCase()}
                                </div>
                                <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)' }}>{selectedClient.name}</div>
                                <div style={{ fontSize: '.82rem', color: 'var(--text-mid)', marginTop: 4 }}>{selectedClient.phone}</div>
                                {selectedClient.email && <div style={{ fontSize: '.78rem', color: 'var(--text-light)', marginTop: 2 }}>{selectedClient.email}</div>}
                                <div style={{ marginTop: 10, fontSize: '.78rem', fontWeight: 700, color: 'var(--primary)' }}>
                                    {selectedClient.appointments.length} atendimento{selectedClient.appointments.length !== 1 ? 's' : ''}
                                </div>
                            </div>

                            <div style={{ flex: 1, overflowY: 'auto', padding: '12px 16px' }}>
                                <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Histórico</div>
                                {selectedClient.appointments.length === 0 ? (
                                    <p style={{ fontSize: '.82rem', color: 'var(--text-light)' }}>Nenhum agendamento encontrado.</p>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                        {selectedClient.appointments.map(app => (
                                            <div key={app.id} style={{ background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '10px 12px' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 6, marginBottom: 4 }}>
                                                    <div style={{ fontWeight: 600, fontSize: '.82rem', color: 'var(--text-dark)' }}>{app.serviceOption.service.name}</div>
                                                    <span className={STATUS_CLS[app.status] ?? 'crm-badge'} style={{ fontSize: '.65rem', padding: '3px 8px' }}>
                                                        {STATUS_LABELS[app.status] ?? app.status}
                                                    </span>
                                                </div>
                                                <div style={{ fontSize: '.75rem', color: 'var(--text-light)' }}>
                                                    {format(new Date(app.startAt), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
