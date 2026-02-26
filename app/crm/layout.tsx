"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CRMLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const isActive = (path: string) => {
        return pathname === path ? "bg-white/20 rounded-xl" : "text-white/90 hover:bg-white/10 rounded-xl";
    };

    return (
        <div className="flex h-screen overflow-hidden bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display">
            {/* Sidebar */}
            <aside className="w-64 bg-primary dark:bg-primary/80 flex flex-col shrink-0">
                <div className="p-6 flex items-center gap-3">
                    <div className="size-10 rounded-full bg-white flex items-center justify-center">
                        <span className="material-symbols-outlined text-primary text-2xl font-bold">spa</span>
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-white text-base font-bold leading-tight">Studio Josy</h1>
                        <p className="text-white/80 text-xs font-medium uppercase tracking-wider">CRM Management</p>
                    </div>
                </div>
                <nav className="flex-1 px-4 mt-4 space-y-1">
                    <Link href="/crm" className={`flex items-center gap-3 px-4 py-3 text-white transition-all ${isActive("/crm")}`}>
                        <span className="material-symbols-outlined fill-1">dashboard</span>
                        <span className="text-sm font-semibold">Dashboard</span>
                    </Link>
                    <Link href="/crm/agendamentos" className={`flex items-center gap-3 px-4 py-3 text-white transition-all ${isActive("/crm/agendamentos")}`}>
                        <span className="material-symbols-outlined">calendar_today</span>
                        <span className="text-sm font-medium">Agendamentos</span>
                    </Link>
                    <Link href="/crm/clientes" className={`flex items-center gap-3 px-4 py-3 text-white transition-all ${isActive("/crm/clientes")}`}>
                        <span className="material-symbols-outlined">group</span>
                        <span className="text-sm font-medium">Clientes</span>
                    </Link>
                    <Link href="/crm/servicos" className={`flex items-center gap-3 px-4 py-3 text-white transition-all ${isActive("/crm/servicos")}`}>
                        <span className="material-symbols-outlined">content_cut</span>
                        <span className="text-sm font-medium">Serviços</span>
                    </Link>
                    <Link href="/crm/financeiro" className={`flex items-center gap-3 px-4 py-3 text-white transition-all ${isActive("/crm/financeiro")}`}>
                        <span className="material-symbols-outlined">payments</span>
                        <span className="text-sm font-medium">Financeiro</span>
                    </Link>
                </nav>
                <div className="p-4 mt-auto">
                    <div className="bg-white/10 rounded-xl p-4">
                        <p className="text-white/70 text-xs font-medium mb-1">Logado como</p>
                        <p className="text-white text-sm font-bold">Josy Silva</p>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col min-w-0 bg-white dark:bg-background-dark overflow-y-auto">
                {/* Header */}
                <header className="h-16 flex items-center justify-between px-8 border-b border-slate-100 dark:border-slate-800 shrink-0 sticky top-0 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-4">
                        <h2 className="text-slate-800 dark:text-slate-100 text-lg font-bold">Olá, Josy Silva</h2>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="relative p-2 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg transition-colors">
                            <span className="material-symbols-outlined">notifications</span>
                            <span className="absolute top-2 right-2 size-2 bg-primary rounded-full border-2 border-white dark:border-background-dark"></span>
                        </button>
                        <div className="flex items-center gap-3 pl-4 border-l border-slate-100 dark:border-slate-800">
                            <div className="text-right">
                                <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-none">Josy Silva</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">Administradora</p>
                            </div>
                            <div className="size-9 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm">
                                JS
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                {children}
            </main>
        </div>
    );
}
