import Link from "next/link";
import "@/app/landing.css";

export default function Landing() {
    return (
        <div>
            {/* ─── HEADER ─────────────────────────────────────── */}
            <header className="lp-header">
                <div className="container lp-header-inner">
                    <a href="/" className="lp-logo">
                        <div className="lp-logo-icon">A</div>
                        Agenda<span>Pro</span>
                    </a>
                    <nav className="lp-nav">
                        <a href="#solution">Funcionalidades</a>
                        <a href="#how">Como funciona</a>
                        <a href="#pricing">Preços</a>
                    </nav>
                    <div className="lp-header-cta">
                        <Link href="/login" className="btn-ghost">Entrar</Link>
                        <Link href="/signup" className="btn-primary">Testar grátis</Link>
                    </div>
                </div>
            </header>

            {/* ─── HERO ───────────────────────────────────────── */}
            <section className="lp-hero">
                <div className="container">
                    <div className="badge">✨ Agenda + Site + CRM em um só lugar</div>

                    <h1>
                        Crie o site do seu salão e comece a receber{" "}
                        <em>agendamentos online</em> em minutos.
                    </h1>

                    <p>
                        Agenda online, site profissional e CRM completo para profissionais
                        de beleza — sem precisar de técnicos ou configurações difíceis.
                    </p>

                    <div className="lp-hero-ctas">
                        <Link href="/signup" className="btn-primary btn-primary-lg">
                            🚀 Testar grátis por 7 dias
                        </Link>
                        <a href="#how" className="btn-outline">
                            ▶ Ver como funciona
                        </a>
                    </div>
                    <p className="lp-hero-disclaimer">Sem cartão de crédito. Cancele quando quiser.</p>

                    {/* Mockup */}
                    <div className="lp-mockup">
                        <div className="lp-mockup-browser">
                            <div className="browser-bar">
                                <div className="browser-dots">
                                    <div className="browser-dot browser-dot-r" />
                                    <div className="browser-dot browser-dot-y" />
                                    <div className="browser-dot browser-dot-g" />
                                </div>
                                <div className="browser-url">
                                    studiojosy.<strong>agendapro.app</strong>
                                </div>
                            </div>
                            <div className="browser-body">
                                <div className="browser-left">
                                    <div>
                                        <h3>Studio Josy Silva</h3>
                                        <p>Extensões de Cílios · Volume Brasileiro</p>
                                    </div>
                                    <div className="browser-left-btns">
                                        <div className="mock-btn mock-btn-white">📅 Agendar horário</div>
                                        <div className="mock-btn mock-btn-outline">💬 WhatsApp</div>
                                    </div>
                                </div>
                                <div className="browser-right">
                                    <h4>Serviços</h4>
                                    {[
                                        ["Volume Brasileiro", "R$ 140"],
                                        ["Volume Egípcio", "R$ 130"],
                                        ["Design de Sobrancelha", "R$ 45"],
                                    ].map(([name, price]) => (
                                        <div key={name} className="service-row">
                                            <span className="service-row-name">{name}</span>
                                            <span className="service-row-price">{price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className="mockup-notification">
                            <span className="notif-icon">🔔</span>
                            <div>
                                <div className="notif-title">Novo agendamento!</div>
                                <div className="notif-sub">Ana Lima — Seg 10:00</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── SOCIAL PROOF BAR ───────────────────────────── */}
            <div className="lp-logos">
                <div className="container">
                    <p>Usado por profissionais em todo o Brasil</p>
                    <div className="logos-row">
                        {["Studio Josy ⭐⭐⭐⭐⭐", "Bianca Brow ⭐⭐⭐⭐⭐", "Nails by Mari ⭐⭐⭐⭐⭐", "Studio Camila ⭐⭐⭐⭐⭐"].map(n => (
                            <div key={n} className="logo-item">{n}</div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ─── PROBLEM ────────────────────────────────────── */}
            <section className="lp-problem">
                <div className="container">
                    <div className="section-label">😰 Você ainda sofre com isso?</div>
                    <h2>
                        Você perde clientes todos os dias<br />
                        <em>sem perceber.</em>
                    </h2>
                    <div className="problem-grid">
                        {[
                            ["❌", "Clientes esquecem o horário marcado no WhatsApp"],
                            ["❌", "Agenda no papel, sem histórico de clientes"],
                            ["❌", "Não tem site com serviços e preços"],
                            ["❌", "Perde agendamentos por falta de organização"],
                            ["❌", "Sem noção real do quanto fatura por mês"],
                            ["❌", "Dependente de indicações, sem presença online"],
                        ].map(([icon, text]) => (
                            <div key={text} className="problem-card">
                                <span className="problem-icon">{icon}</span>
                                <span className="problem-text">{text}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── SOLUTION ───────────────────────────────────── */}
            <section id="solution" className="lp-solution">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">✅ Com AgendaPro você tem</div>
                        <h2>
                            Tudo que você precisa,<br />
                            <em>em um só lugar.</em>
                        </h2>
                        <p>A solução completa para profissionais de beleza organizarem e crescerem seu negócio.</p>
                    </div>
                    <div className="features-grid">
                        {[
                            { icon: "📅", color: "#EDE9FE", title: "Agenda Online Automática", desc: "Clientes agendam pelo seu site 24h por dia. Sem você precisar responder mensagem por mensagem." },
                            { icon: "🌐", color: "#FCE7F3", title: "Site Profissional Incluso", desc: "Seu site entra no ar em minutos com seus serviços, preços e galeria de fotos. Tudo editável." },
                            { icon: "🔔", color: "#FEF3C7", title: "Lembretes Automáticos", desc: "Reduza faltas com confirmações automáticas para os seus clientes antes do horário." },
                            { icon: "📊", color: "#DCFCE7", title: "CRM Completo", desc: "Histórico de clientes, controle financeiro e relatórios — tudo em um painel simples e bonito." },
                        ].map(({ icon, color, title, desc }) => (
                            <div key={title} className="feature-card">
                                <div className="feature-icon-wrap" style={{ background: color }}>
                                    {icon}
                                </div>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── DIFFERENTIATOR ────────────────────────────── */}
            <section className="lp-diff">
                <div className="container">
                    <div className="diff-inner">
                        <div className="diff-text">
                            <div className="badge">🔥 Seu maior diferencial</div>
                            <h2>
                                Você ganha um site profissional{" "}
                                <em>automaticamente.</em>
                            </h2>
                            <p>
                                Ao criar sua conta, seu site já entra no ar com seus serviços e
                                preços. Edite textos, fotos e cores direto do seu painel — sem
                                designer ou desenvolvedor.
                            </p>
                            <div className="diff-checklist">
                                {[
                                    "Página com serviços, preços e galeria de fotos",
                                    "Botão de agendamento online integrado",
                                    "Botão de WhatsApp direto no site",
                                    "Link exclusivo: seunome.agendapro.app",
                                    "Editor visual em tempo real no seu painel",
                                ].map(item => (
                                    <div key={item} className="diff-check">
                                        <div className="check-circle">✓</div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="diff-visual">
                            <div className="ba-card">
                                <div className="ba-emoji">😰</div>
                                <div className="ba-label ba-label-before">Antes</div>
                                <div className="ba-desc">
                                    WhatsApp bagunçado, agenda no papel, sem site, sem organização.
                                    Perdendo clientes todo dia.
                                </div>
                            </div>
                            <div className="ba-arrow">↓</div>
                            <div className="ba-card ba-card-after">
                                <div className="ba-emoji">🚀</div>
                                <div className="ba-label ba-label-after">Depois do AgendaPro</div>
                                <div className="ba-desc">
                                    <span className="ba-url">studiojosy.agendapro.app</span><br />
                                    Site profissional + agenda online + CRM completo. Tudo automático!
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── HOW IT WORKS ───────────────────────────────── */}
            <section id="how" className="lp-how">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">⚡ Simples assim</div>
                        <h2>
                            Em 3 passos você está<br />
                            <em>recebendo agendamentos.</em>
                        </h2>
                    </div>
                    <div className="steps-row">
                        {[
                            { n: "1", icon: "👤", title: "Crie sua conta", desc: "Leva 2 minutos. Preencha seus dados básicos e já ganhe seu link exclusivo." },
                            { n: "2", icon: "✏️", title: "Monte seu site", desc: "Adicione serviços, preços e fotos pelo painel. Editor visual em tempo real." },
                            { n: "3", icon: "📅", title: "Receba agendamentos", desc: "Clientes marcam online no seu site. Você só aparece e atende." },
                        ].map(({ n, icon, title, desc }) => (
                            <div key={n} className="step-card">
                                <div className="step-num-wrap">
                                    <div className="step-icon">{icon}</div>
                                    <div className="step-badge">{n}</div>
                                </div>
                                <h3>{title}</h3>
                                <p>{desc}</p>
                            </div>
                        ))}
                    </div>
                    <div className="how-cta">
                        <Link href="/signup" className="btn-primary btn-primary-lg">
                            🚀 Criar minha conta grátis
                        </Link>
                    </div>
                </div>
            </section>

            {/* ─── TESTIMONIALS ───────────────────────────────── */}
            <section className="lp-testimonials">
                <div className="container">
                    <div className="section-header">
                        <h2>O que nossos clientes dizem</h2>
                    </div>
                    <div className="testimonials-grid">
                        {[
                            { name: "Studio Josy Silva", loc: "Belém, PA", text: "Meu salão ficou muito mais organizado. Meus clientes adoraram poder marcar pelo site — não fico mais perdendo tempo no WhatsApp.", init: "J" },
                            { name: "Bianca Brow Studio", loc: "São Paulo, SP", text: "Em menos de 1 semana já tinha clientes novos marcando pelo meu site. A agenda automática é incrível, economizo horas todo dia.", init: "B" },
                            { name: "Studio Maria Nails", loc: "Rio de Janeiro, RJ", text: "Nunca imaginei ter um site profissional tão rápido. O CRM me ajuda a ver o quanto estou faturando e a planejar melhor.", init: "M" },
                        ].map(({ name, loc, text, init }) => (
                            <div key={name} className="testimonial-card">
                                <div className="stars">★★★★★</div>
                                <p className="testimonial-text">"{text}"</p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">{init}</div>
                                    <div>
                                        <div className="author-name">{name}</div>
                                        <div className="author-loc">{loc}</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── PRICING ────────────────────────────────────── */}
            <section id="pricing" className="lp-pricing">
                <div className="container">
                    <div className="section-header">
                        <div className="badge">💰 Preço simples</div>
                        <h2>Um plano. <em>Sem surpresas.</em></h2>
                        <p>7 dias grátis. Cancele quando quiser.</p>
                    </div>
                    <div className="pricing-card">
                        <div className="pricing-badge">✨ Mais popular</div>
                        <div className="pricing-plan">Plano Profissional</div>
                        <div className="pricing-price">R$49</div>
                        <div className="pricing-period">/mês</div>
                        <div className="pricing-annual">ou R$490/ano (economize 2 meses)</div>
                        <ul className="pricing-list">
                            <li>Site profissional completo</li>
                            <li>Agenda online ilimitada</li>
                            <li>CRM de clientes e financeiro</li>
                            <li>Até 1.000 agendamentos/mês</li>
                            <li>Link exclusivo do seu salão</li>
                            <li>Editor visual do site</li>
                            <li>Suporte via WhatsApp</li>
                        </ul>
                        <Link href="/signup" className="pricing-cta">Começar agora grátis 🚀</Link>
                        <div className="pricing-disclaimer">Sem cartão de crédito. Cancele quando quiser.</div>
                    </div>
                </div>
            </section>

            {/* ─── CTA FINAL ──────────────────────────────────── */}
            <section className="lp-cta">
                <div className="container">
                    <div style={{ fontSize: "3.5rem", marginBottom: "24px" }}>🚀</div>
                    <h2>
                        Comece hoje e transforme a forma<br />
                        <em>que você agenda seus clientes.</em>
                    </h2>
                    <p>Centenas de profissionais já usam o AgendaPro. Você pode ser a próxima.</p>
                    <Link href="/signup" className="btn-primary btn-primary-lg">
                        👤 Criar conta grátis
                    </Link>
                    <p className="lp-cta-note">Sem cartão de crédito · 7 dias grátis · Cancele quando quiser</p>
                </div>
            </section>

            {/* ─── FOOTER ─────────────────────────────────────── */}
            <footer className="lp-footer">
                <div className="container lp-footer-inner">
                    <a href="/" className="lp-footer-logo">
                        A Agenda<span>Pro</span>
                    </a>
                    <p className="lp-footer-copy">© 2026 AgendaPro. Todos os direitos reservados.</p>
                    <div className="lp-footer-links">
                        <Link href="/login">Entrar</Link>
                        <Link href="/signup">Cadastrar</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
