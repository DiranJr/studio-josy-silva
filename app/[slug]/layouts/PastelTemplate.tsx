// ── Pastel Template: Soft shades, dreamy and delicate ──
export default function PastelTemplate({ sections, tenant, services, galleries }: any) {
    return (
        <main style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#FFF9FB', minHeight: '100vh' }}>
            <style>{`
                :root { --pastel-pink: #FFADED; --pastel-purple: #D4BFFF; --pastel-blue: #B3D9FF; --pastel-mint: #B3EFD8; --text: #4A3050; --text-mid: #7A5F80; }
                .pas-btn { background: #D4BFFF; color: #4A3050; padding: 12px 28px; border-radius: 50px; font-weight: 800; font-size: .875rem; text-decoration: none; display: inline-block; transition: background .2s; }
                .pas-btn:hover { background: #BFA3FF; }
                .pas-outline { background: transparent; border: 2px solid #D4BFFF; color: var(--text); }
                .pas-outline:hover { background: #D4BFFF; }
                .pas-card { background: white; border: 1.5px solid #F0E6FF; border-radius: 24px; padding: 28px; box-shadow: 0 4px 24px rgba(212,191,255,.15); transition: transform .2s, box-shadow .2s; }
                .pas-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(212,191,255,.25); }
                .pas-tag { background: linear-gradient(135deg, #FFADED, #D4BFFF); -webkit-background-clip: text; -webkit-text-fill-color: transparent; font-weight: 800; font-size: .78rem; letter-spacing: .1em; text-transform: uppercase; }
            `}</style>

            <header style={{ background: 'white', padding: '16px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '2px solid #F0E6FF' }}>
                <span style={{ fontWeight: 900, fontSize: '1.1rem', color: '#4A3050' }}>🌸 {tenant.name}</span>
                <nav style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                    <a href="#servicos" style={{ color: '#7A5F80', textDecoration: 'none', fontSize: '.82rem', fontWeight: 600 }}>Serviços</a>
                    <a href="#agendar" className="pas-btn" style={{ padding: '9px 22px', fontSize: '.82rem' }}>Agendar ✨</a>
                </nav>
            </header>

            {sections.map((section: any) => {
                const data = section.content;
                if (section.type === "banner") return (
                    <section key={section.id} style={{ padding: '80px 48px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
                        <div>
                            <span className="pas-tag" style={{ display: 'block', marginBottom: 20 }}>✨ Studio Premium</span>
                            <h1 style={{ fontSize: 'clamp(2.5rem,5vw,4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, color: '#4A3050', letterSpacing: '-1px' }}>
                                {data?.title || tenant.name}
                                <br />
                                <span style={{ background: 'linear-gradient(135deg,#FFADED,#D4BFFF)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>com amor</span>
                            </h1>
                            <p style={{ color: '#7A5F80', fontSize: '1rem', lineHeight: 1.8, maxWidth: 420, marginBottom: 36 }}>{data?.subtitle || tenant.siteSettings?.description}</p>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <a href="#agendar" className="pas-btn">Agendar Agora 💜</a>
                                <a href="#servicos" className="pas-btn pas-outline">Ver Serviços</a>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: -16, background: 'linear-gradient(135deg,#FFADED80,#D4BFFF80)', borderRadius: 32, zIndex: 0 }} />
                            <div style={{ position: 'absolute', top: -30, right: -20, width: 100, height: 100, background: 'radial-gradient(circle,#D4BFFF,transparent)', borderRadius: '50%', filter: 'blur(20px)' }} />
                            <img src={tenant.siteSettings?.banner || '/josy-silva.jpg'} alt={tenant.name} style={{ width: '100%', borderRadius: 24, position: 'relative', objectFit: 'cover', maxHeight: 500, zIndex: 1 }} />
                        </div>
                    </section>
                );
                if (section.type === "services") return (
                    <section key={section.id} id="servicos" style={{ padding: '80px 48px', background: 'linear-gradient(180deg,#FFF9FB,#F5F0FF)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 56 }}>
                            <span className="pas-tag">Especialidades</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4A3050', marginTop: 10, letterSpacing: '-1px' }}>{data?.title || 'Nossos Serviços'}</h2>
                            <p style={{ color: '#7A5F80', marginTop: 10, fontSize: '.95rem' }}>{data?.description || 'Cada procedimento feito com carinho e dedicação'}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
                            {services.map((s: any, i: number) => {
                                const bgs = ['#FFADED', '#D4BFFF', '#B3D9FF', '#B3EFD8', '#FFE4AD'];
                                return (
                                    <div key={s.id} className="pas-card">
                                        <div style={{ width: 48, height: 48, borderRadius: 16, background: bgs[i % bgs.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: 16 }}>
                                            {['💅', '🪷', '✨', '🌸', '💜'][i % 5]}
                                        </div>
                                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#4A3050', marginBottom: 6 }}>{s.name}</div>
                                        <div style={{ color: '#9B7FA8', fontSize: '.82rem', marginBottom: 16 }}>{s.options[0]?.durationMinutes} min</div>
                                        <div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#7C3AED', marginBottom: 16 }}>{s.options[0] ? `R$ ${(s.options[0].priceCents / 100).toFixed(2)}` : '—'}</div>
                                        <a href={`/${tenant.slug}/agendar`} className="pas-btn" style={{ fontSize: '.8rem', padding: '10px 22px' }}>Agendar</a>
                                    </div>
                                );
                            })}
                        </div>
                    </section>
                );
                if (section.type === "gallery") return (
                    <section key={section.id} style={{ padding: '80px 48px' }}>
                        <div style={{ textAlign: 'center', marginBottom: 40 }}>
                            <span className="pas-tag">Portfolio</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4A3050', marginTop: 10, letterSpacing: '-1px' }}>{data?.title || 'Nossos Trabalhos'}</h2>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 16 }}>
                            {galleries.map((g: any) => (
                                <div key={g.id} style={{ aspectRatio: '1', borderRadius: 20, overflow: 'hidden', border: '2px solid #F0E6FF' }}>
                                    <img src={g.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "cta") return (
                    <section key={section.id} style={{ margin: '0 48px 80px', background: 'linear-gradient(135deg,#FFADED,#D4BFFF)', borderRadius: 32, padding: '64px 48px', textAlign: 'center' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>💜</div>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#4A3050', marginBottom: 12, letterSpacing: '-1px' }}>{data?.title || 'Quer arrasar? Agenda!'}</h2>
                        <p style={{ color: '#6B4C7A', fontSize: '1rem', marginBottom: 32 }}>{data?.subtitle || 'Estamos aqui para te deixar ainda mais linda ✨'}</p>
                        <a href={`https://wa.me/${data?.whatsapp || tenant.siteSettings?.whatsapp}`} target="_blank" rel="noreferrer"
                            style={{ background: '#4A3050', color: 'white', padding: '15px 40px', borderRadius: 50, fontWeight: 900, fontSize: '1rem', textDecoration: 'none', display: 'inline-block' }}>
                            💬 {data?.buttonText || 'Agendar via WhatsApp'}
                        </a>
                    </section>
                );
                return null;
            })}
            <footer style={{ padding: '28px 48px', background: 'white', borderTop: '2px solid #F0E6FF', textAlign: 'center', color: '#9B7FA8', fontSize: '.8rem' }}>
                🌸 © {new Date().getFullYear()} {tenant.name} — Com amor e carinho
            </footer>
        </main>
    );
}
