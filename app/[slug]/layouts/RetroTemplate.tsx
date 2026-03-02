// ── Retro Template: Earthy tones, vintage typography, warm feel ──
export default function RetroTemplate({ sections, tenant, services, galleries }: any) {
    return (
        <main style={{ fontFamily: "'Georgia', serif", background: '#F7F0E6', color: '#3D2B1F', minHeight: '100vh' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&display=swap');
                .ret-title { font-family: 'Playfair Display', Georgia, serif; }
                .ret-btn { background: #8B4513; color: #F7F0E6; padding: 13px 32px; border-radius: 4px; font-weight: 700; font-size: .875rem; text-decoration: none; display: inline-block; letter-spacing: .05em; border: 2px solid #8B4513; transition: all .2s; font-family: inherit; }
                .ret-btn:hover { background: transparent; color: #8B4513; }
                .ret-outline { background: transparent; color: #8B4513; border-color: #8B4513; }
                .ret-outline:hover { background: #8B4513; color: #F7F0E6; }
                .ret-tag { font-family: 'Georgia', serif; font-style: italic; color: #8B4513; font-size: .9rem; }
                .ret-card { background: #FDF6EC; border: 1.5px solid #D4B896; border-radius: 4px; padding: 28px; }
                .ret-section-line { border: none; height: 1px; background: linear-gradient(90deg, transparent, #8B4513, transparent); margin: 0 auto; max-width: 200px; }
            `}</style>

            {/* Decorative top bar */}
            <div style={{ height: 6, background: 'repeating-linear-gradient(90deg, #8B4513 0, #8B4513 10px, #F7F0E6 10px, #F7F0E6 20px)' }} />

            <header style={{ background: '#F7F0E6', padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #8B4513' }}>
                <div style={{ textAlign: 'center', flex: 1 }}>
                    <div className="ret-title" style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '.05em', color: '#3D2B1F' }}>{tenant.name}</div>
                    <div style={{ fontSize: '.7rem', letterSpacing: '.2em', textTransform: 'uppercase', color: '#8B4513', marginTop: 2 }}>Est. Studio de Beleza</div>
                </div>
                <a href="#agendar" className="ret-btn" style={{ position: 'absolute', right: 48 }}>Agendar</a>
            </header>

            {sections.map((section: any) => {
                const data = section.content;
                if (section.type === "banner") return (
                    <section key={section.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', minHeight: '85vh', alignItems: 'center' }}>
                        <div style={{ background: '#EDE0CC', overflow: 'hidden', position: 'relative', height: '100%' }}>
                            <img src={tenant.siteSettings?.banner || '/josy-silva.jpg'} alt={tenant.name} style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', filter: 'sepia(20%) brightness(.95)' }} />
                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, transparent, rgba(247,240,230,.3))' }} />
                        </div>
                        <div style={{ padding: '60px 64px' }}>
                            <span className="ret-tag">✦ Bem-vinda ao</span>
                            <h1 className="ret-title" style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 900, lineHeight: 1.08, margin: '12px 0 24px', color: '#3D2B1F' }}>
                                {data?.title || tenant.name}
                            </h1>
                            <hr className="ret-section-line" style={{ margin: '0 0 24px', maxWidth: '100%' }} />
                            <p style={{ color: '#6B4C3A', fontSize: '1rem', lineHeight: 1.8, marginBottom: 36 }}>{data?.subtitle || tenant.siteSettings?.description}</p>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <a href="#agendar" className="ret-btn">Marcar Horário</a>
                                <a href="#servicos" className="ret-btn ret-outline">Nossos Serviços</a>
                            </div>
                        </div>
                    </section>
                );
                if (section.type === "services") return (
                    <section key={section.id} id="servicos" style={{ padding: '80px 48px', background: '#FDF6EC', borderTop: '2px solid #8B4513' }}>
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <span className="ret-tag">— Especialidades —</span>
                            <h2 className="ret-title" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3D2B1F', marginTop: 8 }}>{data?.title || 'Nossos Serviços'}</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                            {services.map((s: any) => (
                                <div key={s.id} className="ret-card">
                                    <div className="ret-title" style={{ fontSize: '1.15rem', fontWeight: 900, color: '#3D2B1F', marginBottom: 6 }}>{s.name}</div>
                                    <div className="ret-tag" style={{ fontSize: '.8rem', display: 'block', marginBottom: 12 }}>{s.options[0]?.durationMinutes} min · {s.category}</div>
                                    <hr className="ret-section-line" style={{ margin: '0 0 16px', maxWidth: '40%', marginLeft: 0 }} />
                                    <div style={{ fontWeight: 800, color: '#8B4513', fontSize: '1.2rem', marginBottom: 16 }}>{s.options[0] ? `R$ ${(s.options[0].priceCents / 100).toFixed(2)}` : '—'}</div>
                                    <a href={`/${tenant.slug}/agendar`} className="ret-btn" style={{ fontSize: '.8rem', padding: '10px 22px' }}>Reservar</a>
                                </div>
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "gallery") return (
                    <section key={section.id} style={{ padding: '80px 48px', borderTop: '2px solid #8B4513' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <span className="ret-tag">— Galeria —</span>
                            <h2 className="ret-title" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#3D2B1F', marginTop: 8 }}>{data?.title || 'Nossos Trabalhos'}</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                            {galleries.map((g: any) => (
                                <div key={g.id} style={{ aspectRatio: '1', overflow: 'hidden' }}>
                                    <img src={g.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'sepia(15%)', transition: 'transform .3s' }} />
                                </div>
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "cta") return (
                    <section key={section.id} style={{ background: '#3D2B1F', padding: '80px 48px', textAlign: 'center', borderTop: '6px solid #8B4513' }}>
                        <span className="ret-tag" style={{ color: '#D4B896', display: 'block', marginBottom: 12 }}>— Reserve seu Horário —</span>
                        <h2 className="ret-title" style={{ fontSize: '2.5rem', fontWeight: 900, color: '#F7F0E6', marginBottom: 16 }}>{data?.title || 'Agende sua visita'}</h2>
                        <p style={{ color: 'rgba(247,240,230,.65)', fontSize: '1rem', marginBottom: 36 }}>{data?.subtitle}</p>
                        <a href={`https://wa.me/${data?.whatsapp || tenant.siteSettings?.whatsapp}`} target="_blank" rel="noreferrer" className="ret-btn" style={{ background: '#8B4513', borderColor: '#8B4513', color: '#F7F0E6', fontSize: '1rem', padding: '15px 40px' }}>
                            {data?.buttonText || '📱 Agendar via WhatsApp'}
                        </a>
                    </section>
                );
                return null;
            })}
            <div style={{ height: 6, background: 'repeating-linear-gradient(90deg, #8B4513 0, #8B4513 10px, #F7F0E6 10px, #F7F0E6 20px)' }} />
        </main>
    );
}
