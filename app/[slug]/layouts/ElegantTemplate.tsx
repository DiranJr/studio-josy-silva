import Banner from "../templates/Banner";
import Services from "../templates/Services";
import Gallery from "../templates/Gallery";
import CTA from "../templates/CTA";

// ── Elegant Dark ─────────────────────────────────────────────────────
// Deep charcoal + gold tones. Softer luxury look.
export default function ElegantTemplate({ sections, tenant, services, galleries }: any) {
    return (
        <main style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #0d0d1a 100%)', minHeight: '100vh', color: 'white', fontFamily: "'Playfair Display', Georgia, serif" }}>
            <style>{`
                .elegant-accent { color: #d4af37; }
                .elegant-btn { background: linear-gradient(135deg, #d4af37, #b8962e); color: #1a1a2e; font-weight: 800; padding: 14px 32px; border-radius: 4px; text-decoration: none; display: inline-block; letter-spacing: .05em; text-transform: uppercase; font-size: .85rem; }
                .elegant-section { padding: 80px 24px; }
                .elegant-divider { width: 60px; height: 2px; background: #d4af37; margin: 16px auto; }
                .elegant-card { background: rgba(255,255,255,.04); border: 1px solid rgba(212,175,55,.2); border-radius: 8px; padding: 28px; }
                .elegant-tag { background: rgba(212,175,55,.15); color: #d4af37; font-size: .7rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; padding: 4px 12px; border-radius: 2px; display: inline-block; margin-bottom: 20px; }
            `}</style>

            {/* Header */}
            <header style={{ padding: '20px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(212,175,55,.15)' }}>
                <div style={{ fontWeight: 900, fontSize: '1.2rem', letterSpacing: '.1em', textTransform: 'uppercase' }}>
                    <span className="elegant-accent">✦</span> {tenant.name} <span className="elegant-accent">✦</span>
                </div>
                <a href="#agendar" className="elegant-btn" style={{ fontSize: '.75rem', padding: '10px 24px' }}>Agendar</a>
            </header>

            {sections.map((section: any) => {
                const data = section.content;
                if (section.type === "banner") return (
                    <section key={section.id} style={{ padding: '80px 40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center', maxWidth: 1200, margin: '0 auto' }}>
                        <div>
                            <span className="elegant-tag">✦ Studio Premium</span>
                            <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 900, lineHeight: 1.1, marginBottom: 20, letterSpacing: '-.01em' }}>
                                {data?.title || tenant.name}
                                <br /><span className="elegant-accent">da beleza</span>
                            </h1>
                            <p style={{ fontSize: '1.05rem', color: 'rgba(255,255,255,.65)', marginBottom: 36, lineHeight: 1.8 }}>{data?.subtitle || tenant.siteSettings?.description}</p>
                            <div style={{ display: 'flex', gap: 16 }}>
                                <a href="#agendar" className="elegant-btn">Agendar Horário</a>
                                <a href="#servicos" style={{ color: '#d4af37', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 8, fontSize: '.9rem' }}>Ver Serviços →</a>
                            </div>
                        </div>
                        <div style={{ position: 'relative' }}>
                            <div style={{ position: 'absolute', inset: -10, background: 'linear-gradient(135deg, #d4af37, transparent)', borderRadius: 16, opacity: .15 }} />
                            <img src={tenant.siteSettings?.banner || '/josy-silva.jpg'} alt={tenant.name} style={{ width: '100%', borderRadius: 12, objectFit: 'cover', maxHeight: 520, filter: 'brightness(.9) contrast(1.1)' }} />
                        </div>
                    </section>
                );
                if (section.type === "services") return (
                    <section key={section.id} id="servicos" className="elegant-section" style={{ background: 'rgba(255,255,255,.02)' }}>
                        <div style={{ textAlign: 'center', marginBottom: 60, maxWidth: 600, margin: '0 auto 60px' }}>
                            <span className="elegant-tag">Especialidades</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: 'white' }}>{data?.title || 'Nossos Procedimentos'}</h2>
                            <div className="elegant-divider" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20, maxWidth: 1100, margin: '0 auto' }}>
                            {services.map((s: any) => (
                                <div key={s.id} className="elegant-card">
                                    <div className="elegant-accent" style={{ fontSize: '1.5rem', marginBottom: 10 }}>✦</div>
                                    <div style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>{s.name}</div>
                                    <div style={{ color: 'rgba(255,255,255,.5)', fontSize: '.85rem', marginBottom: 16 }}>{s.description}</div>
                                    {s.options[0] && <div className="elegant-accent" style={{ fontWeight: 800 }}>R$ {(s.options[0].priceCents / 100).toFixed(2)}</div>}
                                    <a href={`/${tenant.slug}/agendar`} className="elegant-btn" style={{ marginTop: 16, padding: '10px 20px', fontSize: '.75rem', display: 'inline-block' }}>Agendar</a>
                                </div>
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "gallery") return (
                    <section key={section.id} className="elegant-section">
                        <div style={{ textAlign: 'center', marginBottom: 50 }}>
                            <span className="elegant-tag">Portfólio</span>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900 }}>{data?.title || 'Nossos Trabalhos'}</h2>
                            <div className="elegant-divider" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, maxWidth: 1100, margin: '0 auto' }}>
                            {galleries.map((g: any) => (
                                <div key={g.id} style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 8, border: '1px solid rgba(212,175,55,.15)' }}>
                                    <img src={g.imageUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'brightness(.9)' }} />
                                </div>
                            ))}
                        </div>
                    </section>
                );
                if (section.type === "cta") return (
                    <section key={section.id} style={{ background: 'linear-gradient(135deg, #d4af37, #b8962e)', padding: '80px 24px', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#1a1a2e', marginBottom: 16 }}>{data?.title || 'Reserve seu momento de beleza'}</h2>
                        <p style={{ color: '#1a1a2e', fontSize: '1.1rem', marginBottom: 36, opacity: .75 }}>{data?.subtitle}</p>
                        <a href={`https://wa.me/${data?.whatsapp || tenant.siteSettings?.whatsapp}`} target="_blank" rel="noreferrer"
                            style={{ background: '#1a1a2e', color: '#d4af37', padding: '16px 40px', borderRadius: 4, fontWeight: 900, fontSize: '1rem', textDecoration: 'none', letterSpacing: '.06em', textTransform: 'uppercase', display: 'inline-block' }}>
                            {data?.buttonText || 'Agendar via WhatsApp'}
                        </a>
                    </section>
                );
                return null;
            })}
            <footer style={{ padding: '40px 24px', textAlign: 'center', borderTop: '1px solid rgba(212,175,55,.1)', color: 'rgba(255,255,255,.35)', fontSize: '.8rem' }}>
                © {new Date().getFullYear()} {tenant.name} — Todos os direitos reservados
            </footer>
        </main>
    );
}
