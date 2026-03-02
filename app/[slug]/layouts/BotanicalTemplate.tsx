// ── Botanical Template: Natural greens, organic feel, spa/wellness ──
export default function BotanicalTemplate({ sections, tenant, services, galleries }: any) {
    return (
        <main style={{ fontFamily: "'Georgia', 'Playfair Display', serif", background: '#FAFAF7', color: '#2D4A22', minHeight: '100vh' }}>
            <style>{`
                .bot-btn { background: #2D4A22; color: #F5F0E8; padding: 13px 30px; border-radius: 50px; font-weight: 700; font-size: .875rem; text-decoration: none; display: inline-block; font-family: inherit; letter-spacing: .03em; transition: background .2s; }
                .bot-btn:hover { background: #3d6130; }
                .bot-outline { background: transparent; border: 2px solid #2D4A22; color: #2D4A22; }
                .bot-green-light { background: #E8F5E2; }
                .bot-tag { color: #5A8A44; font-size: .75rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; font-family: 'Inter', sans-serif; }
                .bot-card { background: white; border: 1px solid #D6E8CC; border-radius: 20px; padding: 28px; }
                .bot-leaf { font-size: 1.5rem; display: block; margin-bottom: 10px; }
            `}</style>

            <header style={{ background: '#F5F0E8', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #D6E8CC' }}>
                <div>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#2D4A22' }}>🌿 {tenant.name}</span>
                </div>
                <nav style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
                    <a href="#servicos" style={{ color: '#2D4A22', textDecoration: 'none', fontSize: '.875rem', fontWeight: 600, fontFamily: 'Inter, sans-serif' }}>Serviços</a>
                    <a href="#agendar" className="bot-btn" style={{ padding: '10px 24px', fontSize: '.82rem' }}>Agendar →</a>
                </nav>
            </header>

            {sections.map((section: any) => {
                const data = section.content;
                if (section.type === "banner") return (
                    <section key={section.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '90vh', alignItems: 'center' }}>
                        <div style={{ padding: '80px 64px' }}>
                            <span className="bot-tag" style={{ display: 'block', marginBottom: 20 }}>🌿 Studio Natural</span>
                            <h1 style={{ fontSize: 'clamp(2.5rem,5vw,4.5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 24, color: '#2D4A22' }}>
                                {data?.title || tenant.name}
                                <br />
                                <em style={{ color: '#5A8A44', fontStyle: 'italic' }}>em harmonia</em>
                            </h1>
                            <p style={{ color: '#4a6b3a', fontSize: '1rem', lineHeight: 1.8, maxWidth: 420, marginBottom: 36 }}>{data?.subtitle || tenant.siteSettings?.description}</p>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <a href="#agendar" className="bot-btn">Marcar Horário</a>
                                <a href="#servicos" className="bot-btn bot-outline">Serviços</a>
                            </div>
                        </div>
                        <div style={{ position: 'relative', height: '100%', background: '#E8F5E2', overflow: 'hidden' }}>
                            <div style={{ position: 'absolute', top: 40, right: 40, fontSize: '6rem', opacity: .15, transform: 'rotate(30deg)' }}>🌿</div>
                            <div style={{ position: 'absolute', bottom: 40, left: 20, fontSize: '4rem', opacity: .1, transform: 'rotate(-20deg)' }}>🍃</div>
                            <img src={tenant.siteSettings?.banner || '/josy-silva.jpg'} alt={tenant.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                        </div>
                    </section>
                );
                if (section.type === "services") return (
                    <section key={section.id} id="servicos" style={{ padding: '80px 48px', background: '#F5F0E8' }}>
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <span className="bot-tag">🌱 Especialidades</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2D4A22', marginTop: 8 }}>{data?.title || 'Nossos Procedimentos'}</h2>
                            <div style={{ width: 60, height: 2, background: '#5A8A44', margin: '16px auto 0' }} />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                            {services.map((s: any) => (
                                <div key={s.id} className="bot-card">
                                    <span className="bot-leaf">🪷</span>
                                    <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#2D4A22', marginBottom: 6 }}>{s.name}</div>
                                    <div style={{ color: '#6a8a5a', fontSize: '.85rem', marginBottom: 16, lineHeight: 1.6 }}>{s.description || 'Procedimento exclusivo para realçar sua beleza natural'}</div>
                                    <div style={{ fontWeight: 800, color: '#5A8A44', fontSize: '1.1rem', marginBottom: 14 }}>{s.options[0] ? `R$ ${(s.options[0].priceCents / 100).toFixed(2)}` : '—'}</div>
                                    <a href={`/${tenant.slug}/agendar`} className="bot-btn" style={{ fontSize: '.8rem', padding: '10px 22px' }}>Agendar</a>
                                </div>
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "gallery") return (
                    <section key={section.id} style={{ padding: '80px 48px' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <span className="bot-tag">🌸 Portfolio</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#2D4A22', marginTop: 8 }}>{data?.title || 'Nossos Trabalhos'}</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 16 }}>
                            {galleries.map((g: any) => (
                                <div key={g.id} style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '1' }}>
                                    <img src={g.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "cta") return (
                    <section key={section.id} style={{ background: '#2D4A22', padding: '80px 48px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🌿</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F5F0E8', marginBottom: 16 }}>{data?.title || 'Reserve seu momento'}</h2>
                        <p style={{ color: 'rgba(245,240,232,.7)', fontSize: '1.05rem', marginBottom: 36 }}>{data?.subtitle || 'Cuide-se com quem entende de beleza natural'}</p>
                        <a href={`https://wa.me/${data?.whatsapp || tenant.siteSettings?.whatsapp}`} target="_blank" rel="noreferrer"
                            style={{ background: '#5A8A44', color: '#F5F0E8', padding: '16px 40px', borderRadius: 50, fontWeight: 800, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
                            📱 {data?.buttonText || 'Agendamento via WhatsApp'}
                        </a>
                    </section>
                );
                return null;
            })}
            <footer style={{ padding: '32px 48px', background: '#F5F0E8', borderTop: '1px solid #D6E8CC', textAlign: 'center', color: '#6a8a5a', fontSize: '.8rem', fontFamily: 'Inter, sans-serif' }}>
                🌿 © {new Date().getFullYear()} {tenant.name} — Realçando sua beleza natural
            </footer>
        </main>
    );
}
