"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import "@/app/crm/crm.css";

const navLinks = [
    { href: "/crm", icon: "📊", label: "Dashboard" },
    { href: "/crm/agendamentos", icon: "📅", label: "Agendamentos" },
    { href: "/crm/clientes", icon: "👥", label: "Clientes" },
    { href: "/crm/servicos", icon: "✂️", label: "Serviços" },
    { href: "/crm/financeiro", icon: "💰", label: "Financeiro" },
    { href: "/crm/site", icon: "🌐", label: "Meu Site" },
    { href: "/crm/configuracoes", icon: "⚙️", label: "Configurações" },
];

export default function CRMLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const getTitle = () => {
        const link = navLinks.find(l => l.href === pathname);
        return link ? link.label : "Dashboard";
    };

    return (
        <div className="crm-shell">
            {/* ── SIDEBAR ── */}
            <aside className="crm-sidebar">
                <a href="/" className="crm-sidebar-logo">
                    <div className="crm-sidebar-logo-icon">A</div>
                    <div className="crm-sidebar-logo-name">
                        Agenda<span>Pro</span>
                    </div>
                </a>

                <div className="crm-sidebar-label">Menu</div>

                <nav className="crm-nav">
                    {navLinks.map(({ href, icon, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={`crm-nav-link${pathname === href ? " active" : ""}`}
                        >
                            <span className="crm-nav-icon">{icon}</span>
                            {label}
                        </Link>
                    ))}
                </nav>

                <div className="crm-sidebar-user">
                    <div className="crm-user-avatar">A</div>
                    <div>
                        <div className="crm-user-name">Admin</div>
                        <div className="crm-user-role">Administrador</div>
                    </div>
                </div>
            </aside>

            {/* ── MAIN ── */}
            <main className="crm-main">
                {/* Topbar */}
                <header className="crm-topbar">
                    <div className="crm-topbar-title">{getTitle()}</div>
                    <div className="crm-topbar-actions">
                        <button className="crm-topbar-btn" title="Notificações">
                            🔔
                            <span className="crm-topbar-notif-dot" />
                        </button>
                        <div className="crm-topbar-user">
                            <div className="crm-topbar-user-info">
                                <div className="crm-topbar-user-name">Admin</div>
                                <div className="crm-topbar-user-role">Administrador</div>
                            </div>
                            <div className="crm-topbar-avatar">A</div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <div className="crm-page">
                    {children}
                </div>
            </main>
        </div>
    );
}
