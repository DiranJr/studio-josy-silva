"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    format, addMonths, subMonths, startOfMonth, endOfMonth,
    eachDayOfInterval, isSameDay, isBefore, startOfDay,
    getDay, parseISO
} from "date-fns";
import { ptBR } from "date-fns/locale";

const WEEKDAYS = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];
const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

type DayConfig = { weekday: number; active: boolean; startTime: string; endTime: string };
type Block = { id: string; startAt: string; endAt: string; reason?: string };

function getToken() {
    return typeof window !== "undefined" ? localStorage.getItem("crm_token") || "" : "";
}

export default function ConfiguracoesPage() {
    const router = useRouter();
    const [staffId, setStaffId] = useState<string | null>(null);
    const [days, setDays] = useState<DayConfig[]>(
        WEEKDAYS.map((_, i) => ({
            weekday: i,
            active: i >= 1 && i <= 5,
            startTime: "09:00",
            endTime: i === 6 ? "13:00" : "18:00",
        }))
    );
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Calendar state
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [blockedDates, setBlockedDates] = useState<Block[]>([]);
    const [blockReason, setBlockReason] = useState("");
    const [blockSaving, setBlockSaving] = useState(false);

    const today = startOfDay(new Date());

    const loadStaffAndHours = useCallback(async () => {
        const token = getToken();
        const staffRes = await fetch("/api/crm/staff", { headers: { Authorization: `Bearer ${token}` } });
        if (staffRes.status === 403 || staffRes.status === 401) { router.push("/login"); return; }
        if (staffRes.ok) {
            const staffList = await staffRes.json();
            if (staffList.length > 0) setStaffId(staffList[0].id);
        }

        const res = await fetch("/api/crm/working-hours", { headers: { Authorization: `Bearer ${token}` } });
        if (!res.ok) return;
        const existing: { weekday: number; startTime: string; endTime: string }[] = await res.json();

        if (existing.length > 0) {
            setDays(WEEKDAYS.map((_, i) => {
                const found = existing.find(h => h.weekday === i);
                return { weekday: i, active: !!found, startTime: found?.startTime || "09:00", endTime: found?.endTime || "18:00" };
            }));
        }
    }, [router]);

    const loadBlocks = useCallback(async () => {
        const year = calendarMonth.getFullYear();
        const month = calendarMonth.getMonth() + 1;
        const res = await fetch(`/api/crm/blocks?year=${year}&month=${month}`, {
            headers: { Authorization: `Bearer ${getToken()}` }
        });
        if (res.ok) setBlockedDates(await res.json());
    }, [calendarMonth]);

    useEffect(() => { loadStaffAndHours(); }, [loadStaffAndHours]);
    useEffect(() => { loadBlocks(); }, [loadBlocks]);

    function toggle(weekday: number) {
        setDays(prev => prev.map(d => d.weekday === weekday ? { ...d, active: !d.active } : d));
    }

    function updateTime(weekday: number, field: "startTime" | "endTime", value: string) {
        setDays(prev => prev.map(d => d.weekday === weekday ? { ...d, [field]: value } : d));
    }

    async function saveHours() {
        if (!staffId) return alert("Profissional não encontrado.");
        setSaving(true);
        const res = await fetch("/api/crm/working-hours", {
            method: "PUT",
            headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ staffId, hours: days }),
        });
        setSaving(false);
        if (res.ok) { setSaved(true); setTimeout(() => setSaved(false), 3000); }
    }

    function isBlocked(day: Date) {
        return blockedDates.some(b => isSameDay(parseISO(b.startAt), day));
    }

    function isWorkday(day: Date) {
        const wd = getDay(day);
        return days.find(d => d.weekday === wd)?.active ?? false;
    }

    async function toggleBlock(day: Date) {
        if (isBefore(day, today)) return; // can't block past dates
        if (!staffId) return;

        const existingBlock = blockedDates.find(b => isSameDay(parseISO(b.startAt), day));

        if (existingBlock) {
            // Remove block
            setBlockSaving(true);
            await fetch(`/api/crm/blocks?id=${existingBlock.id}`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${getToken()}` }
            });
            setBlockSaving(false);
        } else {
            // Add block
            setBlockSaving(true);
            await fetch("/api/crm/blocks", {
                method: "POST",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
                body: JSON.stringify({
                    staffId,
                    startAt: day.toISOString(),
                    endAt: day.toISOString(),
                    reason: blockReason || "Folga",
                })
            });
            setBlockSaving(false);
        }

        await loadBlocks();
    }

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(calendarMonth),
        end: endOfMonth(calendarMonth),
    });

    const startOffset = getDay(startOfMonth(calendarMonth));

    return (
        <div className="p-8 max-w-5xl mx-auto w-full space-y-8">
            <div>
                <h1 className="text-2xl font-extrabold text-slate-800">Configurações de Atendimento</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Defina dias da semana, horários e datas específicas. Reflete imediatamente na agenda pública.
                </p>
            </div>

            {/* ─── Weekly Schedule ─── */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-slate-700">📅 Dias e Horários Semanais</h2>
                    <p className="text-xs text-slate-400 mt-0.5">Horários recorrentes toda semana.</p>
                </div>

                <div className="divide-y divide-slate-50">
                    {days.map((day) => (
                        <div key={day.weekday} className={`flex flex-col sm:flex-row sm:items-center gap-4 px-6 py-4 transition-colors ${!day.active ? "opacity-50" : ""}`}>
                            <div className="flex items-center gap-3 w-36">
                                <button
                                    onClick={() => toggle(day.weekday)}
                                    className={`relative inline-flex w-11 h-6 items-center rounded-full transition-colors ${day.active ? "bg-primary" : "bg-slate-300"}`}
                                >
                                    <span className={`inline-block w-4 h-4 bg-white rounded-full shadow transition-transform ${day.active ? "translate-x-6" : "translate-x-1"}`} />
                                </button>
                                <span className="font-semibold text-slate-700 text-sm">{WEEKDAYS[day.weekday]}</span>
                            </div>

                            {day.active ? (
                                <div className="flex items-center gap-3 text-sm">
                                    <input type="time" value={day.startTime}
                                        onChange={e => updateTime(day.weekday, "startTime", e.target.value)}
                                        className="border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                    <span className="text-slate-400">até</span>
                                    <input type="time" value={day.endTime}
                                        onChange={e => updateTime(day.weekday, "endTime", e.target.value)}
                                        className="border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/30" />
                                </div>
                            ) : (
                                <span className="text-slate-400 text-sm italic">Fechado</span>
                            )}
                        </div>
                    ))}
                </div>

                <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                    {saved && (
                        <span className="flex items-center gap-2 text-green-600 font-semibold text-sm">
                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                            Salvo com sucesso!
                        </span>
                    )}
                    <div className="ml-auto">
                        <button onClick={saveHours} disabled={saving}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-xl font-bold hover:bg-primary/90 disabled:opacity-50 transition-colors">
                            {saving
                                ? <><span className="material-symbols-outlined text-[18px] animate-spin">sync</span> Salvando...</>
                                : <><span className="material-symbols-outlined text-[18px]">save</span> Salvar Horários</>
                            }
                        </button>
                    </div>
                </div>
            </div>

            {/* ─── Specific Date Blocker / Calendar ─── */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                    <h2 className="font-bold text-slate-700">🚫 Datas Específicas de Folga</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                        Clique em datas futuras para bloqueá-las (folgas, feriados). Clique novamente para desbloquear.
                    </p>
                </div>

                <div className="p-6">
                    {/* Reason input */}
                    <div className="mb-4 flex items-center gap-3">
                        <label className="text-sm font-semibold text-slate-600 w-32 shrink-0">Motivo (opcional):</label>
                        <input
                            value={blockReason}
                            onChange={e => setBlockReason(e.target.value)}
                            placeholder="ex: Feriado, Férias..."
                            className="flex-1 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30"
                        />
                    </div>

                    {/* Calendar nav */}
                    <div className="flex items-center justify-between mb-4">
                        <button onClick={() => setCalendarMonth(m => subMonths(m, 1))}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-slate-500">chevron_left</span>
                        </button>
                        <h3 className="font-bold text-slate-700 capitalize">
                            {format(calendarMonth, "MMMM yyyy", { locale: ptBR })}
                        </h3>
                        <button onClick={() => setCalendarMonth(m => addMonths(m, 1))}
                            className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <span className="material-symbols-outlined text-slate-500">chevron_right</span>
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 mb-2">
                        {WEEKDAYS_SHORT.map(d => (
                            <div key={d} className="text-center text-xs font-bold text-slate-400 uppercase tracking-wider py-2">{d}</div>
                        ))}
                    </div>

                    {/* Calendar grid */}
                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: startOffset }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}

                        {daysInMonth.map(day => {
                            const isPast = isBefore(day, today);
                            const blocked = isBlocked(day);
                            const worksToday = isWorkday(day);
                            const isToday = isSameDay(day, today);

                            let cellClass = "relative flex flex-col items-center justify-center h-12 rounded-xl text-sm font-semibold transition-all ";

                            if (isPast) {
                                cellClass += "text-slate-300 cursor-not-allowed ";
                            } else if (blocked) {
                                cellClass += "bg-red-500 text-white cursor-pointer hover:bg-red-600 ";
                            } else if (worksToday) {
                                cellClass += "bg-green-50 text-green-700 cursor-pointer hover:bg-green-100 border border-green-200 ";
                            } else {
                                cellClass += "bg-slate-50 text-slate-400 cursor-pointer hover:bg-slate-100 ";
                            }

                            if (isToday) cellClass += "ring-2 ring-primary ring-offset-1 ";

                            return (
                                <button
                                    key={day.toISOString()}
                                    disabled={isPast || blockSaving}
                                    onClick={() => toggleBlock(day)}
                                    className={cellClass}
                                    title={blocked ? "Clique para desbloquear" : worksToday ? "Dia de trabalho — clique para bloquear" : "Clique para bloquear"}
                                >
                                    <span>{format(day, "d")}</span>
                                    {blocked && (
                                        <span className="text-[8px] font-bold uppercase mt-0.5 leading-none">folga</span>
                                    )}
                                    {!blocked && worksToday && (
                                        <span className="w-1 h-1 bg-green-400 rounded-full mt-0.5" />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Legend */}
                    <div className="flex gap-6 mt-5 pt-4 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-4 h-4 rounded bg-green-100 border border-green-200" />
                            Dia de trabalho
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-4 h-4 rounded bg-red-500" />
                            Bloqueado (folga)
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-500">
                            <div className="w-4 h-4 rounded bg-slate-100" />
                            Não trabalha (sem expediente)
                        </div>
                    </div>
                </div>
            </div>

            {/* Blocked list */}
            {blockedDates.length > 0 && (
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
                    <div className="px-6 py-4 border-b border-slate-100 bg-slate-50">
                        <h2 className="font-bold text-slate-700">Folgas deste mês</h2>
                    </div>
                    <div className="divide-y divide-slate-50">
                        {blockedDates.map(b => (
                            <div key={b.id} className="flex items-center justify-between px-6 py-3">
                                <div>
                                    <p className="font-semibold text-slate-700 text-sm capitalize">
                                        {format(parseISO(b.startAt), "EEEE, dd 'de' MMMM", { locale: ptBR })}
                                    </p>
                                    {b.reason && <p className="text-xs text-slate-400">{b.reason}</p>}
                                </div>
                                <button
                                    onClick={async () => {
                                        setBlockSaving(true);
                                        await fetch(`/api/crm/blocks?id=${b.id}`, {
                                            method: "DELETE", headers: { Authorization: `Bearer ${getToken()}` }
                                        });
                                        setBlockSaving(false);
                                        await loadBlocks();
                                    }}
                                    className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 font-bold"
                                >
                                    Remover
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
