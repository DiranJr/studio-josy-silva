"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, isBefore, startOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";

function BookingClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const serviceOptionId = searchParams.get("serviceOptionId");

    const [serviceOption, setServiceOption] = useState<any>(null);
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableSlots, setAvailableSlots] = useState<string[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Fetch service Option details
    useEffect(() => {
        if (!serviceOptionId) {
            router.push("/");
            return;
        }

        fetch("/api/public/services")
            .then((res) => res.json())
            .then((data) => {
                // Find the specific option inside the services
                let foundOption = null;
                for (const s of data) {
                    if (s.options) {
                        const opt = s.options.find((o: any) => o.id === serviceOptionId);
                        if (opt) {
                            foundOption = { ...opt, service: s };
                            break;
                        }
                    }
                }

                if (foundOption) {
                    setServiceOption(foundOption);
                } else {
                    router.push("/");
                }
                setLoading(false);
            });
    }, [serviceOptionId, router]);

    // Fetch availability when date changes
    useEffect(() => {
        if (!selectedDate || !serviceOptionId) return;

        const dateStr = format(selectedDate, "yyyy-MM-dd");
        setAvailableSlots([]);
        setSelectedSlot(null);

        fetch(`/api/public/availability?serviceOptionId=${serviceOptionId}&date=${dateStr}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.availableSlots) {
                    setAvailableSlots(data.availableSlots);
                }
            })
            .catch(console.error);
    }, [selectedDate, serviceOptionId]);

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

    const handleConfirm = () => {
        if (!selectedDate || !selectedSlot) return;

        const dateStr = format(selectedDate, "yyyy-MM-dd");
        // store in localStorage or URL
        router.push(`/agendar/pagamento?serviceOptionId=${serviceOptionId}&date=${dateStr}&time=${selectedSlot}`);
    };

    const today = startOfDay(new Date());

    if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    if (!serviceOption) return null;

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 min-h-screen flex flex-col">
            <header className="w-full bg-primary-soft dark:bg-background-dark border-b border-primary/10 px-6 py-4 lg:px-20">
                <div className="max-w-6xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg text-white flex items-center justify-center">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <h1 className="text-xl font-bold text-neutral-dark dark:text-slate-100 tracking-tight">Studio Josy Silva</h1>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-primary/20 border-2 border-primary overflow-hidden">
                        <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCR9ct3ixLawOF6H3aB_KY4kTR2sYOLBiS0-5caaCi4PJS6uJKZPYLR-WVGWwV03NUNn1sBMAvuUY-9RFuk4pxulpGPo_UFx0Alpb6PQT4Z7EO29mTufAmNZ7IN04xe2vaiNXYAfeDddMCc_0rRiHc1BK3ckS_SFDJ6vnGiNvNbqpmZk-a-vh6UehmFdUqe4Yet1nbkjI9RaBPGZf1ezVI5PsbmdplEcmJacTM532coKEFtePRQKPpaUUVvkX-0SiY77f9nn7QGtqFi" alt="User profile" />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex items-center justify-center p-4 lg:p-10">
                <div className="max-w-5xl w-full bg-white dark:bg-slate-900 rounded-[20px] shadow-xl shadow-primary/5 overflow-hidden border border-primary/5 flex flex-col">
                    <div className="px-8 pt-8 pb-4">
                        <h2 className="text-3xl font-extrabold text-neutral-dark dark:text-slate-100">Escolha de Data e Horário</h2>
                        <p className="text-primary/70 dark:text-primary-light/70 mt-1">Selecione o melhor momento para realçar sua beleza</p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-0 lg:divide-x divide-primary/10">
                        {/* Calendar */}
                        <div className="flex-1 p-8">
                            <div className="flex items-center justify-between mb-6">
                                <button onClick={prevMonth} className="p-2 hover:bg-primary-soft rounded-full transition-colors text-primary">
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>
                                <h3 className="text-lg font-bold text-neutral-dark dark:text-slate-100 capitalize">
                                    {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
                                </h3>
                                <button onClick={nextMonth} className="p-2 hover:bg-primary-soft rounded-full transition-colors text-primary">
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-7 gap-2">
                                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(day => (
                                    <div key={day} className="h-10 flex items-center justify-center text-xs font-bold uppercase tracking-wider text-primary/40">
                                        {day}
                                    </div>
                                ))}

                                {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                                    <div key={`offset-${i}`} className="h-12 w-full"></div>
                                ))}

                                {daysInMonth.map((day) => {
                                    const isPast = isBefore(day, today);
                                    const isSelected = selectedDate && isSameDay(day, selectedDate);

                                    return (
                                        <div key={day.toISOString()} className="h-12 w-full flex items-center justify-center">
                                            <button
                                                disabled={isPast}
                                                onClick={() => setSelectedDate(day)}
                                                className={`h-10 w-10 flex items-center justify-center text-sm font-medium rounded-full transition-colors ${isPast ? 'text-primary/30 cursor-not-allowed' :
                                                    isSelected ? 'bg-primary text-white shadow-md shadow-primary/30 font-bold' :
                                                        'hover:bg-primary-soft cursor-pointer text-neutral-dark dark:text-slate-100'
                                                    }`}
                                            >
                                                {format(day, "d")}
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Slots */}
                        <div className="flex-1 p-8 flex flex-col">
                            <h3 className="text-lg font-bold text-neutral-dark dark:text-slate-100 mb-6">
                                {selectedDate ? `Horários Disponíveis (${format(selectedDate, "dd/MM")})` : "Selecione uma data"}
                            </h3>

                            <div className="grid grid-cols-2 gap-4">
                                {selectedDate && availableSlots.length === 0 ? (
                                    <p className="col-span-2 text-sm text-neutral-dark/60">Sem horários disponíveis para este dia.</p>
                                ) : (
                                    availableSlots.map((slot) => (
                                        <button
                                            key={slot}
                                            onClick={() => setSelectedSlot(slot)}
                                            className={`py-3 px-6 rounded-full font-semibold transition-colors text-center ${selectedSlot === slot
                                                ? 'bg-primary text-white shadow-md shadow-primary/30 font-bold'
                                                : 'border border-primary-light text-primary hover:bg-primary-soft'
                                                }`}
                                        >
                                            {slot}
                                        </button>
                                    ))
                                )}
                            </div>

                            <div className="mt-auto pt-8">
                                <div className="bg-primary-soft/50 dark:bg-primary/5 p-4 rounded-xl border border-primary/10">
                                    <p className="text-sm text-primary/60 dark:text-primary-light/60 uppercase font-bold tracking-widest mb-1">Resumo do Agendamento</p>
                                    <p className="text-neutral-dark dark:text-slate-100 font-bold text-lg">
                                        {serviceOption.service.name} <span className="text-sm font-normal text-primary">({serviceOption.type === 'APPLICATION' ? 'Aplicação' : 'Manutenção'})</span>
                                    </p>
                                    <div className="flex justify-between items-center mt-1">
                                        <span className="text-neutral-dark/70 dark:text-slate-400 font-medium">
                                            Data e Hora: {selectedDate && selectedSlot ? `${format(selectedDate, "dd MMM", { locale: ptBR })} às ${selectedSlot}` : '-'}
                                        </span>
                                        <span className="text-primary font-extrabold text-xl">
                                            R$ {(serviceOption.priceCents / 100).toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-primary-soft/30 dark:bg-background-dark/50 px-8 py-6 flex flex-col md:flex-row items-center justify-between border-t border-primary/10 gap-4">
                        <div className="flex items-center gap-2 text-neutral-dark dark:text-slate-300">
                            <span className="material-symbols-outlined text-primary">info</span>
                            <span className="font-medium text-sm">
                                Sinal de R$ {(serviceOption.depositCents / 100).toFixed(2)} necessário para confirmação.
                            </span>
                        </div>
                        <button
                            onClick={handleConfirm}
                            disabled={!selectedDate || !selectedSlot}
                            className={`w-full md:w-auto font-bold py-4 px-10 rounded-full transition-all flex items-center justify-center gap-2 ${!selectedDate || !selectedSlot
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-primary hover:bg-primary/90 text-white transform hover:scale-[1.02] shadow-lg shadow-primary/20'
                                }`}
                        >
                            Confirmar Dia e Horário
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </main>

            <footer className="mt-auto py-8 text-center border-t border-primary/5">
                <p className="text-sm text-primary/40 dark:text-primary-light/20">© 2026 Studio Josy Silva. Todos os direitos reservados.</p>
            </footer>
        </div>
    );
}

export default function BookingPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando formulário...</div>}>
            <BookingClient />
        </Suspense>
    );
}
