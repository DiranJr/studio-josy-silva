// ── Minimal Template: Clean white/black, high contrast, magazine style ──
export default function MinimalTemplate({ sections, tenant, services, galleries }: any) {
    const brand = tenant.name;
    return (
        <main style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", background: 'white', color: '#111', minHeight: '100vh' }}>
            <style>{`
                .min-btn { background: #111; color: white; padding: 12px 32px; font-size: .85rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; text-decoration: none; display: inline-block; transition: background .2s; }
                .min-btn:hover { background: #333; }
                .min-btn-outline { background: transparent; border: 2px solid #111; color: #111; }
                .min-btn-outline:hover { background: #111; color: white; }
                .min-divider { height: 1px; background: #111; margin: 0; }
                .min-tag { font-size: .65rem; font-weight: 800; letter-spacing: .18em; text-transform: uppercase; color: #888; }
            `}</style>

            <header style={{ borderBottom: '1px solid #111', padding: '18px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '1.1rem', fontWeight: 900, letterSpacing: '.05em', textTransform: 'uppercase' }}>{brand}</span>
                <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                    <a href="#servicos" style={{ fontSize: '.82rem', textDecoration: 'none', color: '#111', fontWeight: 600 }}>Serviços</a>
                    <a href="#galeria" style={{ fontSize: '.82rem', textDecoration: 'none', color: '#111', fontWeight: 600 }}>Galeria</a>
                    <a href="#agendar" className="min-btn" style={{ padding: '8px 20px' }}>Agendar</a>
                </nav>
            </header>

            {sections.map((section: any) => {
                const data = section.content;
                if (section.type === "banner") return (
                    <section key={section.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '90vh' }}>
                        <div style={{ padding: '80px 64px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <span className="min-tag" style={{ marginBottom: 24 }}>— Studio de Beleza</span>
                            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5.5rem)', fontWeight: 900, lineHeight: 1.0, letterSpacing: '-2px', marginBottom: 28, textTransform: 'uppercase' }}>
                                {(data?.title || brand).split(' ').map((w: string, i: number) => <span key={i} style={{ display: 'block' }}>{w}</span>)}
                            </h1>
                            <p style={{ color: '#555', fontSize: '1rem', lineHeight: 1.7, maxWidth: 380, marginBottom: 40 }}>{data?.subtitle || tenant.siteSettings?.description}</p>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <a href="#agendar" className="min-btn">Agendar Agora</a>
                                <a href="#servicos" className="min-btn min-btn-outline">Ver Serviços</a>
                            </div>
                        </div>
                        <div style={{ background: '#f5f5f5', overflow: 'hidden' }}>
                            <img src={tenant.siteSettings?.banner || '/josy-silva.jpg'} alt={brand} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', filter: 'grayscale(20%)' }} />
                        </div>
                    </section>
                );
                if (section.type === "services") return (
                    <section key={section.id} id="servicos" style={{ padding: '100px 64px', borderTop: '1px solid #111' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 60 }}>
                            <div>
                                <span className="min-tag">Especialidades</span>
                                <h2 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1px', textTransform: 'uppercase', marginTop: 8 }}>{data?.title || 'Serviços'}</h2>
                            </div>
                            <a href={`/${tenant.slug}/agendar`} className="min-btn">Agendar →</a>
                        </div>
                        {services.map((s: any, i: number) => (
                            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '28px 0', borderTop: `1px solid ${i === 0 ? '#111' : '#e5e5e5'}` }}>
                                <div>
                                    <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>{s.name}</div>
                                    <div style={{ color: '#777', fontSize: '.875rem' }}>{s.options[0]?.durationMinutes} min</div>
                                </div>
                                <div style={{ fontWeight: 900, fontSize: '1.3rem' }}>{s.options[0] ? `R$ ${(s.options[0].priceCents / 100).toFixed(2)}` : '—'}</div>
                            </div>
                        ))}
                    </section>
                );
                if (section.type === "gallery") return (
                    <section key={section.id} id="galeria" style={{ padding: '80px 64px', background: '#f9f9f9' }}>
                        <span className="min-tag" style={{ display: 'block', marginBottom: 16 }}>Portfolio</span>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-1px', textTransform: 'uppercase', marginBottom: 40 }}>{data?.title || 'Nossos Trabalhos'}</h2>
                        <div style={{ columns: '3 300px', gap: 8 }}>
                            {galleries.map((g: any) => (
                                <img key={g.id} src={g.imageUrl} alt="" style={{ width: '100%', marginBottom: 8, display: 'block', filter: 'grayscale(10%)' }} />
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "cta") return (
                    <section key={section.id} style={{ padding: '80px 64px', borderTop: '2px solid #111', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                            <span className="min-tag">Pronto para começar?</span>
                            <h2 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1px', textTransform: 'uppercase', marginTop: 8 }}>{data?.title || 'Agende Seu Horário'}</h2>
                        </div>
                        <a href={`https://wa.me/${data?.whatsapp || tenant.siteSettings?.whatsapp}`} target="_blank" rel="noreferrer" className="min-btn" style={{ fontSize: '1rem', padding: '16px 48px' }}>
                            WhatsApp →
                        </a>
                    </section>
                );
                return null;
            })}
            <footer style={{ padding: '24px 64px', borderTop: '1px solid #e5e5e5', display: 'flex', justifyContent: 'space-between', fontSize: '.75rem', color: '#999' }}>
                <span>© {new Date().getFullYear()} {brand}</span>
                <span>Todos os direitos reservados</span>
            </footer>
        </main>
    );
}
