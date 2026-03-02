// ── Modern Template: Dark slate with neon purple/cyan accents ──
export default function ModernTemplate({ sections, tenant, services, galleries }: any) {
    return (
        <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#0F1117', color: '#E2E8F0', minHeight: '100vh' }}>
            <style>{`
                .mod-btn { background: transparent; border: 1.5px solid #7C3AED; color: #A78BFA; padding: 12px 28px; border-radius: 6px; font-weight: 700; font-size: .875rem; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: all .2s; letter-spacing: .02em; }
                .mod-btn:hover { background: #7C3AED; color: white; }
                .mod-btn-filled { background: #7C3AED; color: white; border-color: #7C3AED; }
                .mod-btn-filled:hover { background: #6D28D9; }
                .mod-card { background: #1A1D27; border: 1px solid #2D3148; border-radius: 12px; padding: 24px; transition: border-color .2s; }
                .mod-card:hover { border-color: #7C3AED; }
                .mod-glow { box-shadow: 0 0 60px rgba(124,58,237,.3); }
                .mod-accent { color: #A78BFA; }
            `}</style>

            <header style={{ position: 'sticky', top: 0, zIndex: 50, background: 'rgba(15,17,23,.9)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #1e2130', padding: '14px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 28, height: 28, background: '#7C3AED', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '.7rem', color: 'white' }}>
                        {tenant.name[0]}
                    </div>
                    <span style={{ fontWeight: 800, fontSize: '1rem', letterSpacing: '-.02em' }}>{tenant.name}</span>
                </div>
                <nav style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <a href="#servicos" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '.82rem', fontWeight: 600 }}>Serviços</a>
                    <a href="#galeria" style={{ color: '#94A3B8', textDecoration: 'none', fontSize: '.82rem', fontWeight: 600 }}>Galeria</a>
                    <a href="#agendar" className="mod-btn mod-btn-filled" style={{ padding: '8px 20px', fontSize: '.82rem' }}>Agendar</a>
                </nav>
            </header>

            {sections.map((section: any) => {
                const data = section.content;
                if (section.type === "banner") return (
                    <section key={section.id} style={{ padding: '100px 64px 80px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
                        <div>
                            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(124,58,237,.15)', border: '1px solid rgba(124,58,237,.3)', borderRadius: 4, padding: '5px 12px', fontSize: '.72rem', fontWeight: 700, color: '#A78BFA', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 24 }}>
                                ⚡ Premium Studio
                            </div>
                            <h1 style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
                                {data?.title || tenant.name}
                                <br />
                                <span className="mod-accent">redefinido</span>
                            </h1>
                            <p style={{ color: '#94A3B8', fontSize: '1rem', lineHeight: 1.7, maxWidth: 400, marginBottom: 36 }}>{data?.subtitle || tenant.siteSettings?.description}</p>
                            <div style={{ display: 'flex', gap: 12 }}>
                                <a href="#agendar" className="mod-btn mod-btn-filled">→ Agendar Agora</a>
                                <a href="#servicos" className="mod-btn">Ver Serviços</a>
                            </div>
                            <div style={{ marginTop: 48, display: 'flex', gap: 32 }}>
                                {[['500+', 'Clientes'], ['98%', 'Satisfação'], ['5★', 'Avaliação']].map(([n, l]) => (
                                    <div key={l}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#A78BFA' }}>{n}</div>
                                        <div style={{ fontSize: '.72rem', color: '#64748B', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.08em' }}>{l}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div className="mod-glow" style={{ borderRadius: 20, overflow: 'hidden', border: '1px solid #2D3148' }}>
                                <img src={tenant.siteSettings?.banner || '/josy-silva.jpg'} alt={tenant.name} style={{ width: '100%', objectFit: 'cover', maxHeight: 520 }} />
                            </div>
                        </div>
                    </section>
                );
                if (section.type === "services") return (
                    <section key={section.id} id="servicos" style={{ padding: '80px 64px', borderTop: '1px solid #1e2130' }}>
                        <div style={{ marginBottom: 48 }}>
                            <div style={{ color: '#7C3AED', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>// Especialidades</div>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px' }}>{data?.title || 'O que oferecemos'}</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 16 }}>
                            {services.map((s: any) => (
                                <div key={s.id} className="mod-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                        <span style={{ fontWeight: 800, fontSize: '1rem' }}>{s.name}</span>
                                        <span style={{ fontSize: '.7rem', fontWeight: 700, color: '#7C3AED', background: 'rgba(124,58,237,.1)', padding: '3px 8px', borderRadius: 4 }}>{s.category}</span>
                                    </div>
                                    <div style={{ fontSize: '.82rem', color: '#64748B', marginBottom: 16, lineHeight: 1.5 }}>{s.options[0]?.durationMinutes} min</div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontWeight: 900, fontSize: '1.2rem', color: '#A78BFA' }}>{s.options[0] ? `R$ ${(s.options[0].priceCents / 100).toFixed(2)}` : '—'}</span>
                                        <a href={`/${tenant.slug}/agendar`} className="mod-btn" style={{ fontSize: '.75rem', padding: '6px 14px' }}>Agendar →</a>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "gallery") return (
                    <section key={section.id} id="galeria" style={{ padding: '80px 64px', borderTop: '1px solid #1e2130' }}>
                        <div style={{ color: '#7C3AED', fontSize: '.72rem', fontWeight: 700, letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>// Portfolio</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: 40 }}>{data?.title || 'Nossos Trabalhos'}</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 8 }}>
                            {galleries.map((g: any) => (
                                <div key={g.id} style={{ aspectRatio: '1', borderRadius: 8, overflow: 'hidden', border: '1px solid #1e2130' }}>
                                    <img src={g.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.9)', transition: 'filter .2s' }} />
                                </div>
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "cta") return (
                    <section key={section.id} style={{ margin: '0 64px 80px', borderRadius: 16, border: '1px solid #7C3AED', background: 'linear-gradient(135deg,rgba(124,58,237,.1),rgba(109,40,217,.05))', padding: '64px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 32 }}>
                        <div>
                            <h2 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px', marginBottom: 8 }}>{data?.title || 'Pronta para começar?'}</h2>
                            <p style={{ color: '#94A3B8', fontSize: '.95rem' }}>{data?.subtitle}</p>
                        </div>
                        <a href={`https://wa.me/${data?.whatsapp || tenant.siteSettings?.whatsapp}`} target="_blank" rel="noreferrer" className="mod-btn mod-btn-filled" style={{ fontSize: '1rem', padding: '14px 36px' }}>
                            → {data?.buttonText || 'Falar no WhatsApp'}
                        </a>
                    </section>
                );
                return null;
            })}
            <footer style={{ padding: '28px 64px', borderTop: '1px solid #1e2130', display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: '#334155' }}>
                <span>© {new Date().getFullYear()} {tenant.name}</span>
                <span className="mod-accent">Todos os direitos reservados</span>
            </footer>
        </main>
    );
}
