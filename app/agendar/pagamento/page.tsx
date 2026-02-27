"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

function PaymentClient() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const serviceOptionId = searchParams.get("serviceOptionId");
    const dateStr = searchParams.get("date");
    const timeStr = searchParams.get("time");

    const [serviceOption, setServiceOption] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (!serviceOptionId || !dateStr || !timeStr) {
            router.push("/");
            return;
        }

        fetch("/api/public/services")
            .then((res) => res.json())
            .then((data) => {
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
    }, [serviceOptionId, dateStr, timeStr, router]);

    const handleConfirm = async () => {
        if (!name || !phone) {
            alert("Por favor, preencha o nome e telefone.");
            return;
        }

        setIsSubmitting(true);
        try {
            const startAt = new Date(`${dateStr}T${timeStr}:00`);

            // We need an endpoint POST /api/public/appointments
            // I'll assume we send: client: {name, phone, email}, serviceOptionId, startAt
            const res = await fetch("/api/public/appointments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    client: { name, phone, email },
                    serviceOptionId,
                    startAt: startAt.toISOString(),
                }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || "Erro ao agendar");
            }

            const data = await res.json();
            // Redirect to confirmation specifying the appointment ID or just success
            router.push(`/agendar/confirmacao?appointmentId=${data.appointment.id}`);
        } catch (error: any) {
            console.error(error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
    if (!serviceOption) return null;

    return (
        <div className="bg-background-light dark:bg-background-dark min-h-screen text-slate-900 dark:text-slate-100 flex flex-col font-display">
            <header className="w-full bg-primary/10 border-b border-primary/20 px-6 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <h1 className="text-primary font-extrabold text-xl tracking-tight uppercase">Studio Josy Silva</h1>
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[20px] shadow-xl shadow-primary/10 border border-primary/10 overflow-hidden">
                    <div className="p-8 text-center border-b border-primary/5">
                        <h2 className="text-slate-900 dark:text-slate-50 text-3xl font-extrabold tracking-tight mb-4">Finalizar Agendamento</h2>
                        <div className="bg-primary/5 inline-block px-6 py-3 rounded-full border border-primary/10 mb-4">
                            <p className="text-primary text-sm md:text-base font-semibold">
                                {serviceOption.service.name} <span className="font-normal">({serviceOption.type === 'APPLICATION' ? 'Aplicação' : 'Manutenção'})</span> — <span className="font-bold">Sinal: R$ {(serviceOption.depositCents / 100).toFixed(2)}</span>
                            </p>
                        </div>
                        <p className="text-sm text-neutral-dark/70 dark:text-slate-400">
                            {format(parseISO(dateStr as string), "dd 'de' MMMM", { locale: ptBR })} às {timeStr}
                        </p>
                    </div>

                    <div className="p-8 space-y-6">
                        <div className="space-y-4">
                            <h3 className="text-lg font-bold">Seus Dados</h3>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Nome Completo *</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    className="w-full border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
                                    placeholder="Ex: Maria Silva"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Telefone / WhatsApp *</label>
                                <input
                                    type="tel"
                                    value={phone}
                                    onChange={e => setPhone(e.target.value)}
                                    className="w-full border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
                                    placeholder="(11) 99999-9999"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">E-mail (opcional)</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full border-gray-300 dark:border-slate-700 dark:bg-slate-800 rounded-lg shadow-sm focus:border-primary focus:ring-primary"
                                    placeholder="exemplo@email.com"
                                />
                            </div>
                        </div>

                        <div className="border-t border-primary/10 pt-6">
                            <h3 className="text-lg font-bold mb-4">Pagamento do Sinal via Pix</h3>
                            <div className="flex flex-col items-center">
                                <div className="p-4 bg-white border-2 border-primary/20 rounded-2xl shadow-sm mb-6">
                                    <div className="w-48 h-48 bg-slate-100 flex items-center justify-center relative overflow-hidden rounded-lg">
                                        <div className="absolute inset-0 opacity-10 bg-primary"></div>
                                        <span className="material-symbols-outlined text-primary text-9xl">qr_code_2</span>
                                    </div>
                                </div>
                                <div className="text-center max-w-sm space-y-4">
                                    <button className="w-full bg-primary/10 hover:bg-primary/20 text-primary font-bold py-3 rounded-full flex items-center justify-center gap-3 transition-colors">
                                        <span className="material-symbols-outlined">content_copy</span>
                                        <span>Copiar Código Pix</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-primary/5 p-4 rounded-xl border border-primary/10">
                            <span className="material-symbols-outlined text-primary mt-0.5">verified_user</span>
                            <div className="space-y-1">
                                <p className="text-sm font-bold">Instruções Importantes</p>
                                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                                    O agendamento será registrado. Por favor, realize o pagamento para garantirmos o seu horário.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 pt-0">
                        <button
                            onClick={handleConfirm}
                            disabled={isSubmitting}
                            className={`w-full text-white text-lg font-bold py-5 rounded-full transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:shadow-lg hover:shadow-primary/40 hover:-translate-y-0.5'
                                }`}
                        >
                            <span>{isSubmitting ? 'Confirmando...' : 'Confirmar Agendamento'}</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default function PaymentPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Carregando...</div>}>
            <PaymentClient />
        </Suspense>
    );
}
