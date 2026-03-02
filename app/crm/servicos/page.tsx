"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";

type ServiceOption = {
    id: string;
    type: "APPLICATION" | "MAINTENANCE";
    durationMinutes: number;
    priceCents: number;
    depositCents: number;
    active: boolean;
};

type Service = {
    id: string;
    name: string;
    description: string | null;
    category: string;
    active: boolean;
    options: ServiceOption[];
};

function fmtBRL(cents: number) {
    return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}



export default function ServicosPage() {
    const router = useRouter();
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [form, setForm] = useState({
        name: "", description: "", category: "Cilios",
        applicationDurationMinutes: 120, applicationPriceCents: 0, applicationDepositCents: 0,
        includesMaintenance: true,
        maintenanceDurationMinutes: 90, maintenancePriceCents: 0, maintenanceDepositCents: 0,
    });

    const load = useCallback(async () => {
        const res = await fetch("/api/crm/services", {
            credentials: 'include',
        });
        if (res.status === 401 || res.status === 403) { router.push("/login"); return; }
        setServices(await res.json());
        setLoading(false);
    }, [router]);

    useEffect(() => { load(); }, [load]);

    async function updateOption(serviceId: string, optionId: string, data: Partial<ServiceOption>) {
        setSavingId(optionId);
        await fetch(`/api/crm/services/${serviceId}/options/${optionId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        });
        await load();
        setSavingId(null);
    }

    async function toggleService(service: Service) {
        setSavingId(service.id);
        await fetch(`/api/crm/services/${service.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ active: !service.active }),
        });
        await load();
        setSavingId(null);
    }

    async function createService() {
        const payload = {
            ...form,
            applicationPriceCents: Math.round(form.applicationPriceCents),
            applicationDepositCents: Math.round(form.applicationDepositCents),
            maintenancePriceCents: Math.round(form.maintenancePriceCents),
            maintenanceDepositCents: Math.round(form.maintenanceDepositCents),
        };
        const res = await fetch("/api/crm/services", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (res.ok) { setShowModal(false); await load(); }
    }

    if (loading) return (
        <div className="crm-empty">
            <div className="crm-empty-icon">⏳</div>
            <div className="crm-empty-title">Carregando serviços...</div>
        </div>
    );

    return (
        <div style={{ maxWidth: 860, margin: '0 auto', width: '100%' }}>
            <div className="crm-page-header">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h1 className="crm-page-title">Serviços</h1>
                        <p className="crm-page-subtitle">Edite preços e horários — reflete imediatamente no seu site.</p>
                    </div>
                    <button onClick={() => setShowModal(true)} className="crm-btn crm-btn-primary">
                        + Novo Serviço
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {services.map((service) => (
                    <div key={service.id} className="crm-card" style={{ opacity: service.active ? 1 : 0.6 }}>
                        <div className="crm-card-header">
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <span style={{ width: 10, height: 10, borderRadius: '50%', background: service.active ? '#22C55E' : '#CBD5E1', display: 'inline-block', flexShrink: 0 }} />
                                <div>
                                    <div className="crm-card-title">{service.name}</div>
                                    <div style={{ fontSize: '.75rem', color: 'var(--text-light)', marginTop: 2 }}>{service.category}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleService(service)}
                                disabled={savingId === service.id}
                                className="crm-btn"
                                style={service.active
                                    ? { background: '#FEE2E2', color: '#991B1B' }
                                    : { background: '#DCFCE7', color: '#166534' }
                                }>
                                {savingId === service.id ? '...' : service.active ? 'Desativar' : 'Ativar'}
                            </button>
                        </div>
                        <div>
                            {service.options.map((opt) => (
                                <OptionRow
                                    key={opt.id}
                                    option={opt}
                                    saving={savingId === opt.id}
                                    onSave={(data: Partial<ServiceOption>) => updateOption(service.id, opt.id, data)}
                                    onToggle={() => updateOption(service.id, opt.id, { active: !opt.active })}
                                />
                            ))}
                        </div>
                    </div>
                ))}

                {services.length === 0 && (
                    <div className="crm-empty">
                        <div className="crm-empty-icon">✂️</div>
                        <div className="crm-empty-title">Nenhum serviço cadastrado</div>
                        <div className="crm-empty-desc">Clique em "Novo Serviço" para adicionar.</div>
                    </div>
                )}
            </div>

            {/* Create modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,.5)', padding: 16, backdropFilter: 'blur(4px)' }}>
                    <div style={{ background: 'white', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-lg)', width: '100%', maxWidth: 520, overflow: 'hidden' }}>
                        <div style={{ padding: '18px 24px', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-dark)' }}>Novo Serviço</div>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.2rem', color: 'var(--text-light)' }}>✕</button>
                        </div>
                        <div style={{ padding: '20px 24px', maxHeight: '65vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 14 }}>
                            <div className="crm-form-group">
                                <label className="crm-label">Nome do Serviço</label>
                                <input className="crm-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Volume Brasileiro" />
                            </div>
                            <div className="crm-form-group">
                                <label className="crm-label">Descrição</label>
                                <input className="crm-input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                            </div>
                            <div className="crm-form-group">
                                <label className="crm-label">Categoria</label>
                                <select className="crm-input crm-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                    <option value="Cilios">Cílios</option>
                                    <option value="Sobrancelha">Sobrancelha</option>
                                    <option value="Outros">Outros</option>
                                </select>
                            </div>

                            <div style={{ background: '#EDE9FE', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                                <div style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 10 }}>✨ Aplicação</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                    <Field label="Duração (min)" type="number" value={form.applicationDurationMinutes} onChange={v => setForm(f => ({ ...f, applicationDurationMinutes: Number(v) }))} />
                                    <Field label="Valor (R$)" type="number" value={form.applicationPriceCents / 100} onChange={v => setForm(f => ({ ...f, applicationPriceCents: Number(v) * 100 }))} />
                                    <Field label="Taxa Reserva (R$)" type="number" value={form.applicationDepositCents / 100} onChange={v => setForm(f => ({ ...f, applicationDepositCents: Number(v) * 100 }))} />
                                </div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <input type="checkbox" id="hasMaintenance" checked={form.includesMaintenance} onChange={e => setForm(f => ({ ...f, includesMaintenance: e.target.checked }))} style={{ accentColor: 'var(--primary)', width: 16, height: 16 }} />
                                <label htmlFor="hasMaintenance" style={{ fontSize: '.875rem', fontWeight: 600, color: 'var(--text-dark)', cursor: 'pointer' }}>Incluir opção de Manutenção</label>
                            </div>

                            {form.includesMaintenance && (
                                <div style={{ background: '#F5F3FF', borderRadius: 'var(--radius-md)', padding: '14px 16px' }}>
                                    <div style={{ fontSize: '.82rem', fontWeight: 800, color: 'var(--primary)', marginBottom: 10 }}>🔄 Manutenção</div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                                        <Field label="Duração (min)" type="number" value={form.maintenanceDurationMinutes} onChange={v => setForm(f => ({ ...f, maintenanceDurationMinutes: Number(v) }))} />
                                        <Field label="Valor (R$)" type="number" value={form.maintenancePriceCents / 100} onChange={v => setForm(f => ({ ...f, maintenancePriceCents: Number(v) * 100 }))} />
                                        <Field label="Taxa Reserva (R$)" type="number" value={form.maintenanceDepositCents / 100} onChange={v => setForm(f => ({ ...f, maintenanceDepositCents: Number(v) * 100 }))} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div style={{ display: 'flex', gap: 10, padding: '14px 24px', borderTop: '1px solid var(--border)' }}>
                            <button onClick={() => setShowModal(false)} className="crm-btn crm-btn-ghost" style={{ flex: 1, justifyContent: 'center' }}>Cancelar</button>
                            <button onClick={createService} className="crm-btn crm-btn-primary" style={{ flex: 1, justifyContent: 'center' }}>Criar Serviço</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

function Field({ label, type, value, onChange }: { label: string; type: string; value: any; onChange: (v: string) => void }) {
    return (
        <div>
            <label className="crm-label">{label}</label>
            <input type={type} className="crm-input" value={value} onChange={e => onChange(e.target.value)} step={type === "number" ? "0.01" : undefined} />
        </div>
    );
}

function OptionRow({ option, saving, onSave, onToggle }: {
    option: ServiceOption; saving: boolean;
    onSave: (data: Partial<ServiceOption>) => void;
    onToggle: () => void;
}) {
    const [price, setPrice] = useState((option.priceCents / 100).toFixed(2));
    const [duration, setDuration] = useState(option.durationMinutes.toString());
    const [deposit, setDeposit] = useState((option.depositCents / 100).toFixed(2));
    const [editing, setEditing] = useState(false);

    function save() {
        onSave({ priceCents: Math.round(parseFloat(price) * 100), durationMinutes: parseInt(duration), depositCents: Math.round(parseFloat(deposit) * 100) });
        setEditing(false);
    }

    const isApp = option.type === "APPLICATION";
    const tagBg = isApp ? '#EDE9FE' : '#F5F3FF';
    const tagColor = isApp ? 'var(--primary)' : '#7E22CE';
    const label = isApp ? '✨ Aplicação' : '🔄 Manutenção';

    return (
        <div style={{ padding: '12px 20px', borderBottom: '1px solid var(--bg)', display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', background: option.active ? 'white' : 'var(--bg)', opacity: option.active ? 1 : 0.65 }}>
            <span style={{ background: tagBg, color: tagColor, fontSize: '.72rem', fontWeight: 700, padding: '4px 12px', borderRadius: 100, flexShrink: 0 }}>{label}</span>

            {editing ? (
                <div style={{ display: 'flex', gap: 10, flex: 1, flexWrap: 'wrap' }}>
                    <div style={{ minWidth: 80 }}>
                        <div style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>Duração (min)</div>
                        <input type="number" className="crm-input" value={duration} onChange={e => setDuration(e.target.value)} style={{ padding: '6px 10px', fontSize: '.82rem' }} />
                    </div>
                    <div style={{ minWidth: 80 }}>
                        <div style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>Valor (R$)</div>
                        <input type="number" className="crm-input" value={price} onChange={e => setPrice(e.target.value)} step="0.01" style={{ padding: '6px 10px', fontSize: '.82rem' }} />
                    </div>
                    <div style={{ minWidth: 80 }}>
                        <div style={{ fontSize: '.65rem', fontWeight: 700, color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '.06em', marginBottom: 3 }}>Taxa (R$)</div>
                        <input type="number" className="crm-input" value={deposit} onChange={e => setDeposit(e.target.value)} step="0.01" style={{ padding: '6px 10px', fontSize: '.82rem' }} />
                    </div>
                </div>
            ) : (
                <div style={{ display: 'flex', gap: 20, flex: 1, alignItems: 'center', fontSize: '.875rem' }}>
                    <span style={{ color: 'var(--text-mid)' }}>{duration} min</span>
                    <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>R$ {price}</span>
                    {parseFloat(deposit) > 0 && <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Taxa: R$ {deposit}</span>}
                </div>
            )}

            <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                {editing ? (
                    <>
                        <button onClick={() => setEditing(false)} className="crm-btn crm-btn-ghost" style={{ fontSize: '.78rem', padding: '5px 10px' }}>Cancelar</button>
                        <button onClick={save} disabled={saving} className="crm-btn crm-btn-primary" style={{ fontSize: '.78rem', padding: '5px 12px' }}>
                            {saving ? '...' : 'Salvar'}
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setEditing(true)} className="crm-btn crm-btn-ghost" style={{ fontSize: '.78rem', padding: '5px 10px' }}>✏️ Editar</button>
                        <button onClick={onToggle} disabled={saving} className="crm-btn" style={{ fontSize: '.78rem', padding: '5px 10px', background: option.active ? '#FEE2E2' : '#DCFCE7', color: option.active ? '#991B1B' : '#166534' }}>
                            {option.active ? 'Off' : 'On'}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
