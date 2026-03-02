"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

const SECTION_LABELS: Record<string, string> = {
    banner: '🖼️ Banner Principal',
    services: '✂️ Serviços',
    gallery: '🖼️ Galeria',
    cta: '📲 Chamada para Ação',
}

const ALL_TEMPLATES = [
    { id: 'beauty', name: 'Beauty', emoji: '🌸', desc: 'Rosa suave, clássico salão', bg: '#FFF0F5', accent: '#E879A0' },
    { id: 'nails', name: 'Nails', emoji: '💅', desc: 'Rosa sofisticado, card flutuante', bg: '#FFF0F5', accent: '#FB7185' },
    { id: 'brow', name: 'Brow', emoji: '🪮', desc: 'Minimalista neutro', bg: '#F5F5F5', accent: '#6B7280' },
    { id: 'elegant', name: 'Elegant', emoji: '✨', desc: 'Escuro + dourado, luxo', bg: '#1A1A2E', accent: '#D4AF37' },
    { id: 'minimal', name: 'Minimal', emoji: '◼', desc: 'Branco + preto, magazine', bg: '#FFFFFF', accent: '#111111' },
    { id: 'vibrant', name: 'Vibrant', emoji: '🌈', desc: 'Gradientes neon, energia', bg: '#0A0A0A', accent: '#FF3CAC' },
    { id: 'botanical', name: 'Botanical', emoji: '🌿', desc: 'Verde natural, spa', bg: '#E8F5E2', accent: '#2D4A22' },
    { id: 'retro', name: 'Retro', emoji: '🍂', desc: 'Marrom, tipografia vintage', bg: '#F7F0E6', accent: '#8B4513' },
    { id: 'modern', name: 'Modern', emoji: '⚡', desc: 'Cinza escuro + roxo neon', bg: '#0F1117', accent: '#7C3AED' },
    { id: 'pastel', name: 'Pastel', emoji: '🩷', desc: 'Pastéis suaves, delicado', bg: '#FFF9FB', accent: '#D4BFFF' },
]

type SiteData = {
    slug: string
    title: string
    description: string
    whatsapp: string | null
    instagram: string | null
    salonPhone: string | null
    salonAddress: string | null
    banner: string | null
    layout?: string
}

export default function MeuSitePage() {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    const [data, setData] = useState<SiteData | null>(null)
    const [form, setForm] = useState<SiteData | null>(null)
    const [sections, setSections] = useState<any[]>([])
    const [editingSection, setEditingSection] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [saveMsg, setSaveMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
    const [slugError, setSlugError] = useState('')
    const [activeTab, setActiveTab] = useState<'info' | 'templates' | 'blocos'>('templates')
    const [currentLayout, setCurrentLayout] = useState('beauty')
    const [layoutSaving, setLayoutSaving] = useState(false)

    const load = useCallback(async () => {
        setLoading(true)
        const headers = {}
        try {
            const [siteRes, sectionsRes] = await Promise.all([
                fetch('/api/crm/site', { credentials: 'include', headers }),
                fetch('/api/crm/sections', { credentials: 'include', headers }),
            ])
            if (siteRes.ok) {
                const d = await siteRes.json()
                setData(d)
                setForm(d)
                if (d.layout) setCurrentLayout(d.layout)
            }
            if (sectionsRes.ok) {
                setSections(await sectionsRes.json())
            }
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { load() }, [load])

    const refreshPreview = (sectionsData: any[]) => {
        if (iframeRef.current?.contentWindow) {
            iframeRef.current.contentWindow.postMessage({ type: 'UPDATE_ALL_SECTIONS', sections: sectionsData }, '*')
        }
    }

    function set(field: keyof SiteData, value: string) {
        setForm(f => f ? { ...f, [field]: value } : f)
        if (field === 'slug') {
            if (!/^[a-z0-9-]*$/.test(value)) setSlugError('Apenas letras minúsculas, números e hífens.')
            else setSlugError('')
        }
    }

    async function save() {
        if (!form || slugError) return
        setSaving(true)
        setSaveMsg(null)
                const res = await fetch('/api/crm/site', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  },
            body: JSON.stringify(form)
        })
        setSaving(false)
        if (res.ok) {
            const d = await res.json()
            setData(d)
            setForm(d)
            setSaveMsg({ type: 'ok', text: '✓ Configurações salvas!' })
            setTimeout(() => { if (iframeRef.current) iframeRef.current.src = `/${d.slug}?_=${Date.now()}` }, 800)
        } else {
            const err = await res.json()
            setSaveMsg({ type: 'err', text: err.error || 'Erro ao salvar.' })
        }
        setTimeout(() => setSaveMsg(null), 4000)
    }

    async function applyTemplate(layoutId: string) {
        setLayoutSaving(true)
                const res = await fetch('/api/crm/layout', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json',  },
            body: JSON.stringify({ layout: layoutId })
        })
        setLayoutSaving(false)
        if (res.ok) {
            setCurrentLayout(layoutId)
            // Notify iframe to switch template instantly
            iframeRef.current?.contentWindow?.postMessage({ type: 'UPDATE_LAYOUT', layout: layoutId }, '*')
            // Also do a full reload after 1s so server-rendered data re-fetches
            setTimeout(() => {
                if (iframeRef.current && form?.slug) iframeRef.current.src = `/${form.slug}?_=${Date.now()}`
            }, 1200)
        }
    }

    // Section management
    const moveSection = async (idx: number, dir: 'up' | 'down') => {
        if (dir === 'up' && idx === 0) return
        if (dir === 'down' && idx === sections.length - 1) return
        const next = [...sections]
        const swap = dir === 'up' ? idx - 1 : idx + 1;
        [next[idx], next[swap]] = [next[swap], next[idx]]
        setSections(next)
        await fetch('/api/crm/sections', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  },
            body: JSON.stringify(next.map((s, i) => ({ id: s.id, order: i })))
        })
        refreshPreview(next)
    }

    const toggleSection = async (sec: any) => {
        const updated = sections.map(s => s.id === sec.id ? { ...s, active: !s.active } : s)
        setSections(updated)
        await fetch('/api/crm/sections', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  },
            body: JSON.stringify({ id: sec.id, active: !sec.active })
        })
        refreshPreview(updated)
    }

    const saveSection = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingSection) return
        await fetch('/api/crm/sections', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json',  },
            body: JSON.stringify({ id: editingSection.id, content: editingSection.content })
        })
        setEditingSection(null)
        await load()
    }

    const changeContent = (field: string, value: string) => {
        const updated = { ...editingSection, content: { ...editingSection.content, [field]: value } }
        setEditingSection(updated)
        iframeRef.current?.contentWindow?.postMessage({ type: 'UPDATE_SECTION', section: updated }, '*')
    }

    if (loading) return (
        <div className="crm-empty"><div className="crm-empty-icon">⏳</div><div className="crm-empty-title">Carregando...</div></div>
    )

    const slug = form?.slug || ''
    const previewUrl = slug ? `/${slug}` : null

    return (
        <div style={{ display: 'flex', height: 'calc(100vh - 60px)', overflow: 'hidden', gap: 0, background: '#F1F5F9' }}>

            {/* ── Left panel ── */}
            <div style={{ width: 380, background: 'white', borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', overflow: 'hidden', flexShrink: 0 }}>

                {/* Header */}
                <div style={{ padding: '14px 18px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 800, fontSize: '.95rem', color: 'var(--text-dark)' }}>🌐 Editor do Meu Site</div>
                    {slug && (
                        <div style={{ marginTop: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 6, padding: '5px 9px', fontSize: '.73rem', color: 'var(--text-mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                /{slug} · <strong style={{ color: 'var(--primary)' }}>{ALL_TEMPLATES.find(t => t.id === currentLayout)?.name}</strong>
                            </div>
                            <a href={`/${slug}`} target="_blank" rel="noreferrer" className="crm-btn crm-btn-ghost" style={{ padding: '5px 10px', fontSize: '.72rem' }}>↗</a>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'white' }}>
                    {([['info', '⚙️ Info'], ['templates', '🎨 Templates'], ['blocos', '📋 Blocos']] as const).map(([tab, label]) => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            flex: 1, padding: '10px 4px', border: 'none', cursor: 'pointer', fontSize: '.75rem', fontWeight: 600,
                            background: activeTab === tab ? 'white' : 'var(--bg)',
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-mid)',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                        }}>
                            {label}
                        </button>
                    ))}
                </div>

                {/* Content area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: activeTab === 'templates' ? 14 : 18 }}>

                    {/* ── INFO TAB ── */}
                    {activeTab === 'info' && form && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                            <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: '12px 14px', marginBottom: 18 }}>
                                <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>🔗 URL do seu site</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'white', border: `1.5px solid ${slugError ? '#EF4444' : 'var(--border)'}`, borderRadius: 8, overflow: 'hidden' }}>
                                    <span style={{ padding: '7px 8px', fontSize: '.75rem', color: 'var(--text-light)', background: 'var(--bg)', borderRight: '1px solid var(--border)', flexShrink: 0 }}>agendapro.com/</span>
                                    <input value={form.slug} onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))} placeholder="seu-salao"
                                        style={{ flex: 1, border: 'none', outline: 'none', padding: '7px 9px', fontSize: '.875rem', fontWeight: 600, color: 'var(--primary)', background: 'transparent', fontFamily: 'monospace' }} />
                                </div>
                                {slugError && <div style={{ fontSize: '.7rem', color: '#EF4444', marginTop: 3 }}>{slugError}</div>}
                            </div>

                            <div className="crm-form-group">
                                <label className="crm-label">Nome do salão</label>
                                <input className="crm-input" value={form.title} onChange={e => set('title', e.target.value)} />
                            </div>
                            <div className="crm-form-group">
                                <label className="crm-label">Descrição / Slogan</label>
                                <textarea className="crm-input crm-textarea" value={form.description} onChange={e => set('description', e.target.value)} rows={3} />
                            </div>
                            <div className="crm-form-group">
                                <label className="crm-label">📱 WhatsApp (com DDI)</label>
                                <input className="crm-input" value={form.whatsapp || ''} onChange={e => set('whatsapp', e.target.value)} placeholder="5591999999999" />
                            </div>
                            <div className="crm-form-group">
                                <label className="crm-label">📷 Instagram</label>
                                <input className="crm-input" value={form.instagram || ''} onChange={e => set('instagram', e.target.value)} placeholder="@seusalao" />
                            </div>
                            <div className="crm-form-group">
                                <label className="crm-label">📞 Telefone</label>
                                <input className="crm-input" value={form.salonPhone || ''} onChange={e => set('salonPhone', e.target.value)} />
                            </div>
                            <div className="crm-form-group">
                                <label className="crm-label">📍 Endereço</label>
                                <input className="crm-input" value={form.salonAddress || ''} onChange={e => set('salonAddress', e.target.value)} />
                            </div>
                            {saveMsg && (
                                <div style={{ padding: '9px 12px', borderRadius: 8, marginBottom: 10, fontSize: '.8rem', fontWeight: 600, background: saveMsg.type === 'ok' ? '#DCFCE7' : '#FEE2E2', color: saveMsg.type === 'ok' ? '#15803D' : '#991B1B' }}>
                                    {saveMsg.text}
                                </div>
                            )}
                            <button onClick={save} disabled={saving || !!slugError} className="crm-btn crm-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: '.9rem' }}>
                                {saving ? 'Salvando...' : '💾 Salvar'}
                            </button>
                        </div>
                    )}

                    {/* ── TEMPLATES TAB ── */}
                    {activeTab === 'templates' && (
                        <div>
                            <div style={{ fontSize: '.75rem', color: 'var(--text-mid)', marginBottom: 14, lineHeight: 1.5 }}>
                                Escolha o visual do seu site. Clique em um template para aplicá-lo instantaneamente.
                            </div>
                            {layoutSaving && (
                                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '8px 12px', borderRadius: 8, fontSize: '.78rem', fontWeight: 700, marginBottom: 12 }}>
                                    ⏳ Aplicando template...
                                </div>
                            )}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                                {ALL_TEMPLATES.map(tpl => {
                                    const isActive = currentLayout === tpl.id
                                    return (
                                        <button key={tpl.id} onClick={() => applyTemplate(tpl.id)} disabled={layoutSaving} style={{
                                            border: `2px solid ${isActive ? 'var(--primary)' : 'var(--border)'}`,
                                            borderRadius: 12, overflow: 'hidden', cursor: 'pointer',
                                            background: 'white', padding: 0, textAlign: 'left',
                                            transform: isActive ? 'scale(1.01)' : 'scale(1)',
                                            boxShadow: isActive ? '0 0 0 3px var(--primary-light)' : 'none',
                                            transition: 'all .2s'
                                        }}>
                                            {/* Color preview */}
                                            <div style={{ height: 64, background: tpl.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', position: 'relative' }}>
                                                {tpl.emoji}
                                                {isActive && (
                                                    <div style={{ position: 'absolute', top: 6, right: 6, background: 'var(--primary)', color: 'white', borderRadius: '50%', width: 20, height: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.6rem', fontWeight: 900 }}>✓</div>
                                                )}
                                                <div style={{ position: 'absolute', bottom: 6, left: 8, right: 8, height: 4, background: tpl.accent, borderRadius: 2, opacity: .7 }} />
                                            </div>
                                            {/* Label */}
                                            <div style={{ padding: '8px 10px' }}>
                                                <div style={{ fontWeight: 800, fontSize: '.8rem', color: isActive ? 'var(--primary)' : 'var(--text-dark)' }}>{tpl.name}</div>
                                                <div style={{ fontSize: '.68rem', color: 'var(--text-light)', marginTop: 1 }}>{tpl.desc}</div>
                                            </div>
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* ── BLOCOS TAB ── */}
                    {activeTab === 'blocos' && (
                        <div>
                            {!editingSection ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ fontSize: '.75rem', color: 'var(--text-mid)', marginBottom: 4 }}>Reordene, ative/desative e edite cada bloco do site.</div>
                                    {sections.map((sec, idx) => (
                                        <div key={sec.id} style={{
                                            background: sec.active ? 'white' : 'var(--bg)',
                                            border: '1.5px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '11px 13px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, opacity: sec.active ? 1 : 0.55
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '.6rem', padding: '2px 4px', opacity: idx === 0 ? .3 : 1 }}>▲</button>
                                                    <button onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '.6rem', padding: '2px 4px', opacity: idx === sections.length - 1 ? .3 : 1 }}>▼</button>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '.82rem', fontWeight: 700, color: 'var(--text-dark)' }}>{SECTION_LABELS[sec.type] || sec.type}</div>
                                                    <div style={{ fontSize: '.7rem', color: 'var(--text-light)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sec.content?.title}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 5 }}>
                                                <button onClick={() => setEditingSection(sec)} className="crm-btn crm-btn-ghost" style={{ padding: '4px 9px', fontSize: '.7rem' }}>✏️</button>
                                                <button onClick={() => toggleSection(sec)} style={{ padding: '4px 9px', fontSize: '.7rem', fontWeight: 700, background: sec.active ? '#FEE2E2' : '#DCFCE7', color: sec.active ? '#991B1B' : '#166534', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}>
                                                    {sec.active ? 'Off' : 'On'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    {sections.length === 0 && (
                                        <div className="crm-empty" style={{ padding: '24px 0' }}>
                                            <div className="crm-empty-icon">📄</div>
                                            <div className="crm-empty-title">Nenhum bloco</div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <button onClick={() => setEditingSection(null)} className="crm-btn crm-btn-ghost" style={{ width: '100%', justifyContent: 'center', marginBottom: 14 }}>← Voltar</button>
                                    <div style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>
                                        {SECTION_LABELS[editingSection.type] || editingSection.type}
                                    </div>
                                    <form onSubmit={saveSection} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                                        <div className="crm-form-group">
                                            <label className="crm-label">Título</label>
                                            <input className="crm-input" value={editingSection.content?.title || ''} onChange={e => changeContent('title', e.target.value)} />
                                        </div>
                                        {['banner', 'services', 'gallery'].includes(editingSection.type) && (
                                            <div className="crm-form-group">
                                                <label className="crm-label">Subtítulo</label>
                                                <textarea className="crm-input crm-textarea" value={editingSection.content?.subtitle || editingSection.content?.description || ''} onChange={e => changeContent(editingSection.type === 'banner' ? 'subtitle' : 'description', e.target.value)} rows={3} />
                                            </div>
                                        )}
                                        {editingSection.type === 'cta' && (
                                            <>
                                                <div className="crm-form-group">
                                                    <label className="crm-label">Texto do botão</label>
                                                    <input className="crm-input" value={editingSection.content?.buttonText || ''} onChange={e => changeContent('buttonText', e.target.value)} />
                                                </div>
                                                <div className="crm-form-group">
                                                    <label className="crm-label">WhatsApp</label>
                                                    <input className="crm-input" value={editingSection.content?.whatsapp || ''} onChange={e => changeContent('whatsapp', e.target.value)} placeholder="5591999999999" />
                                                </div>
                                            </>
                                        )}
                                        <button type="submit" className="crm-btn crm-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>✓ Salvar bloco</button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Right: Live Preview ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '16px 20px', gap: 10, overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '6px 16px', borderRadius: 100, border: '1px solid var(--border)', fontSize: '.75rem', fontWeight: 600, color: 'var(--text-mid)', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ width: 7, height: 7, background: '#22C55E', borderRadius: '50%', display: 'inline-block' }} />
                    Pré-visualização ao vivo
                    {slug && <span style={{ color: 'var(--text-light)', fontFamily: 'monospace' }}>· /{slug}</span>}
                    {<span style={{ color: 'var(--primary)', font: 'inherit' }}>· {ALL_TEMPLATES.find(t => t.id === currentLayout)?.emoji} {ALL_TEMPLATES.find(t => t.id === currentLayout)?.name}</span>}
                </div>

                {previewUrl ? (
                    <div style={{ flex: 1, width: '100%', maxWidth: 920, background: 'white', borderRadius: 14, overflow: 'hidden', border: '6px solid #1E293B', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
                        <div style={{ background: '#1E293B', height: 30, display: 'flex', alignItems: 'center', padding: '0 12px', gap: 6 }}>
                            {['#FC5F5A', '#FDBD2E', '#27C840'].map(c => <div key={c} style={{ width: 9, height: 9, borderRadius: '50%', background: c }} />)}
                            <div style={{ flex: 1, background: '#334155', borderRadius: 4, height: 14, margin: '0 8px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                                <span style={{ fontSize: '.6rem', color: '#94A3B8', fontFamily: 'monospace' }}>localhost:3000/{slug}</span>
                            </div>
                            <button onClick={() => { if (iframeRef.current) iframeRef.current.src = `/${slug}?_=${Date.now()}` }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '.75rem' }} title="Recarregar">↺</button>
                        </div>
                        <iframe ref={iframeRef} src={previewUrl} style={{ width: '100%', height: 'calc(100% - 30px)', border: 'none', background: 'white' }} title="Preview do site" />
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <div style={{ fontSize: '3rem' }}>🌐</div>
                        <div style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-dark)' }}>Configure o endereço do site</div>
                        <div style={{ fontSize: '.875rem', color: 'var(--text-mid)', textAlign: 'center', maxWidth: 320 }}>
                            Defina o slug na aba <strong>Info</strong> para ver o preview.
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
