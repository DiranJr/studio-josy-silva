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

function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("crm_token") || "" : "";
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
            headers: { Authorization: `Bearer ${getToken()}` },
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
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(data),
        });
        await load();
        setSavingId(null);
    }

    async function toggleService(service: Service) {
        setSavingId(service.id);
        await fetch(`/api/crm/services/${service.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
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
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(payload),
        });
        if (res.ok) { setShowModal(false); await load(); }
    }

    if (loading) return <div className="flex-1 flex items-center justify-center text-slate-400">Carregando...</div>;

    return (
        <div className="p-8 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-extrabold text-slate-800">Gerenciar Serviços</h1>
                    <p className="text-slate-500 text-sm mt-1">Edite preços e horários em tempo real — reflete imediatamente na homepage.</p>
                </div>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-xl font-bold hover:bg-primary/90 transition-colors"
                >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Novo Serviço
                </button>
            </div>

            <div className="space-y-6">
                {services.map((service) => (
                    <div key={service.id} className={`bg-white border rounded-2xl shadow-sm overflow-hidden ${!service.active ? "opacity-60" : ""}`}>
                        {/* Service header */}
                        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
                            <div className="flex items-center gap-3">
                                <span className={`inline-block w-2.5 h-2.5 rounded-full ${service.active ? "bg-green-400" : "bg-slate-300"}`} />
                                <div>
                                    <h2 className="font-bold text-slate-800">{service.name}</h2>
                                    <p className="text-xs text-slate-500">{service.category}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => toggleService(service)}
                                disabled={savingId === service.id}
                                className={`text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${service.active
                                    ? "bg-red-50 text-red-600 hover:bg-red-100"
                                    : "bg-green-50 text-green-600 hover:bg-green-100"
                                    }`}
                            >
                                {savingId === service.id ? "..." : service.active ? "Desativar" : "Ativar"}
                            </button>
                        </div>

                        {/* Options */}
                        <div className="divide-y divide-slate-50">
                            {service.options.map((opt) => (
                                <OptionRow
                                    key={opt.id}
                                    option={opt}
                                    saving={savingId === opt.id}
                                    onSave={(data) => updateOption(service.id, opt.id, data)}
                                    onToggle={() => updateOption(service.id, opt.id, { active: !opt.active })}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* Create modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden">
                        <div className="px-6 pt-6 pb-4 border-b border-slate-100">
                            <h2 className="text-xl font-extrabold text-slate-800">Novo Serviço</h2>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nome do Serviço</label>
                                    <input className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</label>
                                    <input className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                                        value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Categoria</label>
                                    <select className="mt-1 w-full border border-slate-200 rounded-xl px-4 py-2.5 text-slate-800 focus:outline-none"
                                        value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                                        <option value="Cilios">Cílios</option>
                                        <option value="Outros">Outros</option>
                                    </select>
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-xl p-4">
                                <p className="font-bold text-blue-700 mb-3 text-sm">✨ Aplicação</p>
                                <div className="grid grid-cols-3 gap-3">
                                    <Field label="Duração (min)" type="number" value={form.applicationDurationMinutes}
                                        onChange={v => setForm(f => ({ ...f, applicationDurationMinutes: Number(v) }))} />
                                    <Field label="Valor (R$)" type="number" value={form.applicationPriceCents / 100}
                                        onChange={v => setForm(f => ({ ...f, applicationPriceCents: Number(v) * 100 }))} />
                                    <Field label="Taxa Reserva (R$)" type="number" value={form.applicationDepositCents / 100}
                                        onChange={v => setForm(f => ({ ...f, applicationDepositCents: Number(v) * 100 }))} />
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input type="checkbox" id="hasMaintenance" checked={form.includesMaintenance}
                                    onChange={e => setForm(f => ({ ...f, includesMaintenance: e.target.checked }))}
                                    className="accent-primary w-4 h-4" />
                                <label htmlFor="hasMaintenance" className="text-sm font-semibold text-slate-700">Incluir opção de Manutenção</label>
                            </div>

                            {form.includesMaintenance && (
                                <div className="bg-purple-50 rounded-xl p-4">
                                    <p className="font-bold text-purple-700 mb-3 text-sm">🔄 Manutenção</p>
                                    <div className="grid grid-cols-3 gap-3">
                                        <Field label="Duração (min)" type="number" value={form.maintenanceDurationMinutes}
                                            onChange={v => setForm(f => ({ ...f, maintenanceDurationMinutes: Number(v) }))} />
                                        <Field label="Valor (R$)" type="number" value={form.maintenancePriceCents / 100}
                                            onChange={v => setForm(f => ({ ...f, maintenancePriceCents: Number(v) * 100 }))} />
                                        <Field label="Taxa Reserva (R$)" type="number" value={form.maintenanceDepositCents / 100}
                                            onChange={v => setForm(f => ({ ...f, maintenanceDepositCents: Number(v) * 100 }))} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3 px-6 py-4 border-t border-slate-100">
                            <button onClick={() => setShowModal(false)}
                                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50">
                                Cancelar
                            </button>
                            <button onClick={createService}
                                className="flex-1 py-2.5 rounded-xl bg-primary text-white font-bold hover:bg-primary/90">
                                Criar Serviço
                            </button>
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
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-1">{label}</label>
            <input type={type} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={value} onChange={e => onChange(e.target.value)} step={type === "number" ? "0.01" : undefined} />
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
        onSave({
            priceCents: Math.round(parseFloat(price) * 100),
            durationMinutes: parseInt(duration),
            depositCents: Math.round(parseFloat(deposit) * 100),
        });
        setEditing(false);
    }

    const label = option.type === "APPLICATION" ? "✨ Aplicação" : "🔄 Manutenção";
    const color = option.type === "APPLICATION" ? "text-blue-700 bg-blue-50" : "text-purple-700 bg-purple-50";

    return (
        <div className={`px-6 py-4 flex flex-col sm:flex-row sm:items-center gap-4 ${!option.active ? "bg-slate-50 opacity-60" : ""}`}>
            <span className={`text-xs font-bold px-3 py-1 rounded-full w-fit ${color}`}>{label}</span>

            {editing ? (
                <div className="flex flex-wrap gap-3 flex-1">
                    <InputField label="Duração (min)" value={duration} onChange={setDuration} />
                    <InputField label="Valor (R$)" value={price} onChange={setPrice} />
                    <InputField label="Taxa Reserva (R$)" value={deposit} onChange={setDeposit} />
                </div>
            ) : (
                <div className="flex flex-wrap gap-6 flex-1 text-sm">
                    <span className="text-slate-500">{duration} min</span>
                    <span className="font-bold text-slate-800">R$ {price}</span>
                    {parseFloat(deposit) > 0 && <span className="text-primary font-semibold">Taxa: R$ {deposit}</span>}
                </div>
            )}

            <div className="flex gap-2 shrink-0">
                {editing ? (
                    <>
                        <button onClick={() => setEditing(false)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">Cancelar</button>
                        <button onClick={save} disabled={saving} className="text-xs px-4 py-1.5 rounded-lg bg-primary text-white font-bold hover:bg-primary/90 disabled:opacity-50">
                            {saving ? "Salvando..." : "Salvar"}
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={() => setEditing(true)} className="text-xs px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50">
                            <span className="material-symbols-outlined text-[14px]">edit</span>
                        </button>
                        <button onClick={onToggle} disabled={saving}
                            className={`text-xs px-3 py-1.5 rounded-lg font-bold ${option.active ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"}`}>
                            {option.active ? "Off" : "On"}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

function InputField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
    return (
        <div>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">{label}</label>
            <input className="mt-0.5 w-24 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={value} onChange={e => onChange(e.target.value)} type="number" step="0.01" />
        </div>
    );
}
