import prisma from "@/lib/prisma";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ConfirmationPage({ searchParams }: { searchParams: { appointmentId?: string } }) {
    const { appointmentId } = searchParams;

    if (!appointmentId) {
        redirect("/");
    }

    const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: {
            serviceOption: { include: { service: true } },
            staff: true,
            client: true,
        },
    });

    if (!appointment) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 p-6">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Agendamento não encontrado</h1>
                    <Link href="/" className="text-primary hover:underline">Zvoltar para o início</Link>
                </div>
            </div>
        );
    }

    const startAt = new Date(appointment.startAt);

    return (
        <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-slate-100 antialiased min-h-screen flex flex-col relative overflow-x-hidden">
            {/* Header */}
            <header className="w-full bg-soft-pink dark:bg-primary/10 border-b border-primary/10 relative z-10">
                <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">auto_awesome</span>
                        </div>
                        <h1 className="text-primary text-xl font-bold tracking-tight">Studio Josy Silva</h1>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-grow flex items-center justify-center py-12 px-6 relative z-10">
                <div className="max-w-3xl w-full bg-white dark:bg-slate-900 rounded-xl shadow-xl shadow-primary/5 overflow-hidden border border-primary/5">
                    {/* Status Banner */}
                    <div className="p-10 text-center flex flex-col items-center border-b border-slate-50 dark:border-slate-800">
                        <div className="size-20 bg-secondary/30 dark:bg-primary/20 rounded-full flex items-center justify-center mb-6">
                            <span className="material-symbols-outlined text-primary text-4xl font-bold">check</span>
                        </div>
                        <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">Reserva Solicitada!</h2>
                        <p className="text-primary font-medium">Seu horário foi reservado no Studio.</p>
                    </div>

                    <div className="p-8 md:p-12 space-y-8">
                        {/* Details Section */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary/60 mt-1">content_cut</span>
                                    <div>
                                        <p className="text-sm font-semibold text-primary/70 uppercase tracking-wider mb-1">Serviço</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                            {appointment.serviceOption.service.name} <span className="font-normal text-sm">({appointment.serviceOption.type === 'APPLICATION' ? 'Aplicação' : 'Manutenção'})</span>
                                        </p>
                                        <p className="text-primary font-bold">R$ {(appointment.serviceOption.priceCents / 100).toFixed(2)}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary/60 mt-1">calendar_today</span>
                                    <div>
                                        <p className="text-sm font-semibold text-primary/70 uppercase tracking-wider mb-1">Data e Hora</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">
                                            {format(startAt, "dd 'de' MMMM, yyyy", { locale: ptBR })}
                                        </p>
                                        <p className="text-slate-600 dark:text-slate-400">Às {format(startAt, "HH:mm'h'")}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-6">
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary/60 mt-1">person</span>
                                    <div>
                                        <p className="text-sm font-semibold text-primary/70 uppercase tracking-wider mb-1">Profissional</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200">{appointment.staff.name}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <span className="material-symbols-outlined text-primary/60 mt-1">location_on</span>
                                    <div>
                                        <p className="text-sm font-semibold text-primary/70 uppercase tracking-wider mb-1">Localização</p>
                                        <p className="text-lg font-bold text-slate-800 dark:text-slate-200 leading-snug">Studio Josy Silva</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Notice Box */}
                        <div className="bg-secondary/10 dark:bg-primary/10 p-6 rounded-lg border border-primary/10">
                            <div className="flex gap-4 items-start">
                                <span className="material-symbols-outlined text-primary">info</span>
                                <div className="space-y-2">
                                    <p className="text-slate-800 dark:text-slate-200 font-bold leading-normal">
                                        Lembre-se: A Taxa de Reserva de R$ {(appointment.serviceOption.depositCents / 100).toFixed(2)} foi solicitada via Pix.
                                    </p>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm italic">
                                        Proibido acompanhantes/crianças no local.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-col md:flex-row gap-4 pt-4">
                            <Link href="/" className="flex-1 bg-primary hover:bg-primary/90 text-white font-bold py-4 px-8 rounded-full shadow-lg shadow-primary/25 transition-all flex items-center justify-center gap-2">
                                <span className="material-symbols-outlined">home</span>
                                Voltar ao Início
                            </Link>
                        </div>
                    </div>

                    {/* Footer/Bottom Info */}
                    <div className="bg-slate-50 dark:bg-slate-800/50 p-6 text-center">
                        <p className="text-slate-500 dark:text-slate-400 text-sm mt-3">
                            ID do Agendamento: #{appointment.id.substring(0, 8).toUpperCase()}
                        </p>
                    </div>
                </div>
            </main>

            {/* Aesthetic background elements */}
            <div className="fixed -top-24 -right-24 size-96 bg-primary/5 blur-3xl rounded-full pointer-events-none z-0"></div>
            <div className="fixed -bottom-24 -left-24 size-96 bg-secondary/20 blur-3xl rounded-full pointer-events-none z-0"></div>
        </div>
    );
}
