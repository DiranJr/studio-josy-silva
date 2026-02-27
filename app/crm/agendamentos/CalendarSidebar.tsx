'use client';

import { format, addDays, startOfWeek, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function CalendarSidebar({ initialDate }: { initialDate: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [selectedDate, setSelectedDate] = useState(new Date(initialDate));

    // Start week on Sunday
    const startDate = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(startDate, i));

    const handleDateSelect = (date: Date) => {
        const formattedDate = format(date, 'yyyy-MM-dd');
        setSelectedDate(date);

        const params = new URLSearchParams(searchParams.toString());
        params.set('date', formattedDate);
        router.push(`/crm/agendamentos?${params.toString()}`);
    };

    const handlePrevWeek = () => {
        setSelectedDate(addDays(selectedDate, -7));
    };

    const handleNextWeek = () => {
        setSelectedDate(addDays(selectedDate, 7));
    };

    return (
        <div className="w-[320px] bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-primary/10 shrink-0 flex flex-col hidden lg:flex h-fit sticky top-6">
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-6">Calendário</h3>

            <div className="flex items-center justify-between mb-4">
                <button onClick={handlePrevWeek} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                    <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <h4 className="font-bold text-slate-800 dark:text-slate-200 capitalize">
                    {format(selectedDate, "MMMM yyyy", { locale: ptBR })}
                </h4>
                <button onClick={handleNextWeek} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-full transition-colors text-slate-500">
                    <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                    <div key={day} className="text-xs font-bold text-slate-400 py-2">{day}</div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {weekDays.map((day, idx) => {
                    const isSelected = isSameDay(day, selectedDate);
                    const isToday = isSameDay(day, new Date());

                    return (
                        <button
                            key={idx}
                            onClick={() => handleDateSelect(day)}
                            className={`
                                aspect-square flex items-center justify-center rounded-full text-sm font-medium transition-all
                                ${isSelected
                                    ? 'bg-primary text-white font-bold shadow-md shadow-primary/20 scale-110 z-10'
                                    : isToday
                                        ? 'text-primary font-bold border border-primary/30'
                                        : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                                }
                            `}
                        >
                            {format(day, 'd')}
                        </button>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-700">
                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Ir para data específica</label>
                <input
                    type="date"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm dark:text-white"
                    value={format(selectedDate, 'yyyy-MM-dd')}
                    onChange={(e) => {
                        if (e.target.value) {
                            handleDateSelect(new Date(e.target.value + 'T12:00:00'));
                        }
                    }}
                />
            </div>
        </div>
    );
}
