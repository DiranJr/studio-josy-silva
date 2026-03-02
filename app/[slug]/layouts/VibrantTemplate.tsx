// ── Vibrant Template: Bold gradients, energetic, Gen-Z aesthetic ──
export default function VibrantTemplate({ sections, tenant, services, galleries }: any) {
    return (
        <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#0a0a0a', color: 'white', minHeight: '100vh' }}>
            <style>{`
                @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
                .vib-btn { background: linear-gradient(135deg, #FF3CAC, #784BA0, #2B86C5); color: white; padding: 14px 32px; border-radius: 50px; font-weight: 800; font-size: .9rem; text-decoration: none; display: inline-block; position: relative; }
                .vib-btn::before { content:''; position:absolute; inset:-2px; background:linear-gradient(135deg,#FF3CAC,#784BA0,#2B86C5); border-radius:50px; z-index:-1; filter:blur(8px); opacity:.6; }
                .vib-ghost { background:transparent; border:2px solid rgba(255,255,255,.3); color:white; padding:14px 32px; border-radius:50px; font-weight:700; text-decoration:none; display:inline-block; backdrop-filter:blur(8px); }
                .vib-card { background:linear-gradient(135deg,rgba(255,255,255,.05),rgba(255,255,255,.02)); border:1px solid rgba(255,255,255,.1); border-radius:20px; padding:28px; backdrop-filter:blur(10px); transition:transform .2s,border-color .2s; }
                .vib-card:hover { transform:translateY(-4px); border-color:rgba(255,60,172,.4); }
                .vib-tag { background:linear-gradient(135deg,#FF3CAC,#784BA0); -webkit-background-clip:text; -webkit-text-fill-color:transparent; font-weight:900; font-size:.85rem; letter-spacing:.08em; text-transform:uppercase; }
            `}</style>

            {/* Animated background blobs */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', zIndex: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', top: '-20%', left: '-10%', width: '60vw', height: '60vw', background: 'radial-gradient(circle, rgba(255,60,172,.25), transparent 70%)', animation: 'float 8s ease-in-out infinite' }} />
                <div style={{ position: 'absolute', bottom: '-20%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, rgba(43,134,197,.2), transparent 70%)', animation: 'float 10s ease-in-out infinite reverse' }} />
            </div>

            <header style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backdropFilter: 'blur(20px)', background: 'rgba(10,10,10,.7)', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                <span style={{ fontWeight: 900, fontSize: '1.1rem', background: 'linear-gradient(135deg,#FF3CAC,#784BA0,#2B86C5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{tenant.name}</span>
                <a href="#agendar" className="vib-btn" style={{ padding: '10px 24px', fontSize: '.82rem' }}>Agendar ✨</a>
            </header>

            <div style={{ position: 'relative', zIndex: 1 }}>
                {sections.map((section: any) => {
                    const data = section.content;
                    if (section.type === "banner") return (
                        <section key={section.id} style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '120px 48px 80px', gap: 60 }}>
                            <div style={{ flex: 1 }}>
                                <span className="vib-tag" style={{ display: 'block', marginBottom: 20 }}>✨ Premium Studio</span>
                                <h1 style={{ fontSize: 'clamp(3rem,6vw,5rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-1px' }}>
                                    {data?.title || tenant.name}
                                    <br />
                                    <span style={{ background: 'linear-gradient(135deg,#FF3CAC,#784BA0,#2B86C5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>sem igual</span>
                                </h1>
                                <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '1.1rem', lineHeight: 1.7, maxWidth: 440, marginBottom: 40 }}>{data?.subtitle || tenant.siteSettings?.description}</p>
                                <div style={{ display: 'flex', gap: 16 }}>
                                    <a href="#agendar" className="vib-btn">Agendar Agora 🚀</a>
                                    <a href="#servicos" className="vib-ghost">Ver Serviços</a>
                                </div>
                            </div>
                            <div style={{ flex: '0 0 400px', position: 'relative' }}>
                                <div style={{ position: 'absolute', inset: -20, background: 'linear-gradient(135deg,rgba(255,60,172,.4),rgba(43,134,197,.4))', borderRadius: '50%', filter: 'blur(40px)' }} />
                                <img src={tenant.siteSettings?.banner || '/josy-silva.jpg'} alt={tenant.name} style={{ width: '100%', borderRadius: 24, position: 'relative', objectFit: 'cover', maxHeight: 520 }} />
                            </div>
                        </section>
                    );
                    if (section.type === "services") return (
                        <section key={section.id} id="servicos" style={{ padding: '80px 48px' }}>
                            <div style={{ textAlign: 'center', marginBottom: 56 }}>
                                <span className="vib-tag">Especialidades</span>
                                <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginTop: 8 }}>{data?.title || 'Nossos Serviços'}</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
                                {services.map((s: any) => (
                                    <div key={s.id} className="vib-card">
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 6 }}>{s.name}</div>
                                        <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.85rem', marginBottom: 16 }}>{s.description || s.options[0]?.durationMinutes + ' min'}</div>
                                        <div style={{ fontWeight: 900, fontSize: '1.2rem', background: 'linear-gradient(135deg,#FF3CAC,#784BA0)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: 16 }}>
                                            {s.options[0] ? `R$ ${(s.options[0].priceCents / 100).toFixed(2)}` : '—'}
                                        </div>
                                        <a href={`/${tenant.slug}/agendar`} className="vib-btn" style={{ fontSize: '.78rem', padding: '10px 20px' }}>Agendar</a>
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                    if (section.type === "gallery") return (
                        <section key={section.id} style={{ padding: '80px 48px' }}>
                            <div style={{ textAlign: 'center', marginBottom: 40 }}>
                                <span className="vib-tag">Portfolio</span>
                                <h2 style={{ fontSize: '2.8rem', fontWeight: 900, marginTop: 8 }}>{data?.title || 'Nossos Trabalhos'}</h2>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                                {galleries.map((g: any) => (
                                    <div key={g.id} style={{ aspectRatio: '1', borderRadius: 16, overflow: 'hidden', border: '1px solid rgba(255,60,172,.2)' }}>
                                        <img src={g.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    </div>
                                ))}
                            </div>
                        </section>
                    );
                    if (section.type === "cta") return (
                        <section key={section.id} style={{ margin: '0 48px 80px', borderRadius: 32, background: 'linear-gradient(135deg,rgba(255,60,172,.15),rgba(43,134,197,.15))', border: '1px solid rgba(255,255,255,.1)', padding: '80px 48px', textAlign: 'center', backdropFilter: 'blur(20px)' }}>
                            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 16 }}>{data?.title || 'Pronta para arrasar? 💅'}</h2>
                            <p style={{ color: 'rgba(255,255,255,.6)', fontSize: '1.1rem', marginBottom: 36 }}>{data?.subtitle}</p>
                            <a href={`https://wa.me/${data?.whatsapp || tenant.siteSettings?.whatsapp}`} target="_blank" rel="noreferrer" className="vib-btn" style={{ fontSize: '1.05rem', padding: '16px 48px' }}>
                                Fale comigo no WhatsApp 🤙
                            </a>
                        </section>
                    );
                    return null;
                })}
            </div>
            <footer style={{ position: 'relative', zIndex: 1, padding: '32px 48px', borderTop: '1px solid rgba(255,255,255,.08)', textAlign: 'center', color: 'rgba(255,255,255,.3)', fontSize: '.8rem' }}>
                © {new Date().getFullYear()} {tenant.name} — Feito com ❤️
            </footer>
        </main>
    );
}
