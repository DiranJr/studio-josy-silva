"use client"

import { useState, useEffect, useRef, useCallback } from 'react'

const SECTION_LABELS: Record<string, string> = {
    banner: '🖼️ Banner Principal',
    services: '✂️ Serviços',
    gallery: '🖼️ Galeria',
    cta: '📲 Chamada para Ação',
}

function getToken() {
    return typeof window !== 'undefined' ? localStorage.getItem('crm_token') || '' : ''
}

type SiteData = {
    slug: string
    title: string
    description: string
    whatsapp: string | null
    instagram: string | null
    salonPhone: string | null
    salonAddress: string | null
    banner: string | null
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
    const [activeTab, setActiveTab] = useState<'info' | 'blocos'>('info')

    const load = useCallback(async () => {
        setLoading(true)
        const token = getToken()
        const headers = { Authorization: `Bearer ${token}` }
        try {
            const [siteRes, sectionsRes] = await Promise.all([
                fetch('/api/crm/site', { headers }),
                fetch('/api/crm/sections', { headers }),
            ])
            if (siteRes.ok) {
                const d = await siteRes.json()
                setData(d)
                setForm(d)
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
        if (!form) return
        if (slugError) return
        setSaving(true)
        setSaveMsg(null)
        const token = getToken()
        const res = await fetch('/api/crm/site', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(form)
        })
        setSaving(false)
        if (res.ok) {
            const d = await res.json()
            setData(d)
            setForm(d)
            setSaveMsg({ type: 'ok', text: '✓ Configurações salvas!' })
            // Reload iframe after 800ms
            setTimeout(() => {
                if (iframeRef.current) iframeRef.current.src = `/${d.slug}?_=${Date.now()}`
            }, 800)
        } else {
            const err = await res.json()
            setSaveMsg({ type: 'err', text: err.error || 'Erro ao salvar.' })
        }
        setTimeout(() => setSaveMsg(null), 4000)
    }

    // Section management
    const moveSection = async (idx: number, dir: 'up' | 'down') => {
        if (dir === 'up' && idx === 0) return
        if (dir === 'down' && idx === sections.length - 1) return
        const next = [...sections]
        const swap = dir === 'up' ? idx - 1 : idx + 1;
        [next[idx], next[swap]] = [next[swap], next[idx]]
        setSections(next)
        const payload = next.map((s, i) => ({ id: s.id, order: i }))
        await fetch('/api/crm/sections', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify(payload)
        })
        refreshPreview(next)
    }

    const toggleSection = async (sec: any) => {
        const updated = sections.map(s => s.id === sec.id ? { ...s, active: !s.active } : s)
        setSections(updated)
        await fetch('/api/crm/sections', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ id: sec.id, active: !sec.active })
        })
        refreshPreview(updated)
    }

    const saveSection = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingSection) return
        const res = await fetch('/api/crm/sections', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${getToken()}` },
            body: JSON.stringify({ id: editingSection.id, content: editingSection.content })
        })
        if (res.ok) {
            setEditingSection(null)
            await load()
            refreshPreview(sections)
        }
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
                <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--text-dark)' }}>🌐 Editor do Meu Site</div>
                    <div style={{ fontSize: '.78rem', color: 'var(--text-mid)', marginTop: 3 }}>Configure as informações e seções da sua página.</div>

                    {slug && (
                        <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 10px', fontSize: '.75rem', color: 'var(--text-mid)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                agendapro.com/<strong style={{ color: 'var(--primary)' }}>{slug}</strong>
                            </div>
                            <a href={`/${slug}`} target="_blank" rel="noreferrer" className="crm-btn crm-btn-ghost" style={{ padding: '6px 12px', fontSize: '.75rem' }}>↗</a>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', background: 'white' }}>
                    {(['info', 'blocos'] as const).map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)} style={{
                            flex: 1, padding: '11px 8px', border: 'none', cursor: 'pointer', fontSize: '.82rem', fontWeight: 600,
                            background: activeTab === tab ? 'white' : 'var(--bg)',
                            color: activeTab === tab ? 'var(--primary)' : 'var(--text-mid)',
                            borderBottom: activeTab === tab ? '2px solid var(--primary)' : '2px solid transparent',
                            transition: 'color .15s, border-color .15s'
                        }}>
                            {tab === 'info' ? '⚙️ Informações' : '📋 Blocos do Site'}
                        </button>
                    ))}
                </div>

                {/* Content area */}
                <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

                    {/* ── INFO TAB ── */}
                    {activeTab === 'info' && form && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>

                            {/* Slug */}
                            <div style={{ background: 'var(--primary-light)', borderRadius: 'var(--radius-md)', padding: '14px 16px', marginBottom: 20 }}>
                                <div style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 8 }}>🔗 URL do seu site</div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 0, background: 'white', border: `1.5px solid ${slugError ? '#EF4444' : 'var(--border)'}`, borderRadius: 8, overflow: 'hidden' }}>
                                    <span style={{ padding: '8px 10px', fontSize: '.8rem', color: 'var(--text-light)', background: 'var(--bg)', borderRight: '1px solid var(--border)', flexShrink: 0 }}>agendapro.com/</span>
                                    <input
                                        value={form.slug}
                                        onChange={e => set('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        placeholder="seu-salao"
                                        style={{ flex: 1, border: 'none', outline: 'none', padding: '8px 10px', fontSize: '.875rem', fontWeight: 600, color: 'var(--primary)', background: 'transparent', fontFamily: 'monospace' }}
                                    />
                                </div>
                                {slugError && <div style={{ fontSize: '.72rem', color: '#EF4444', marginTop: 4 }}>{slugError}</div>}
                                <div style={{ fontSize: '.72rem', color: 'var(--text-light)', marginTop: 6 }}>Apenas letras minúsculas, números e hífens.</div>
                            </div>

                            <div className="crm-form-group">
                                <label className="crm-label">Nome do salão</label>
                                <input className="crm-input" value={form.title} onChange={e => set('title', e.target.value)} placeholder="Studio Josy Silva" />
                            </div>

                            <div className="crm-form-group">
                                <label className="crm-label">Descrição / Slogan</label>
                                <textarea className="crm-input crm-textarea" value={form.description} onChange={e => set('description', e.target.value)} placeholder="Especialistas em realçar sua beleza natural..." rows={3} />
                            </div>

                            <div className="crm-form-group">
                                <label className="crm-label">📱 WhatsApp (com DDI)</label>
                                <input className="crm-input" value={form.whatsapp || ''} onChange={e => set('whatsapp', e.target.value)} placeholder="5591999999999" />
                                <div style={{ fontSize: '.72rem', color: 'var(--text-light)', marginTop: 4 }}>Ex: 5591999999999 (55 = Brasil)</div>
                            </div>

                            <div className="crm-form-group">
                                <label className="crm-label">📷 Instagram</label>
                                <input className="crm-input" value={form.instagram || ''} onChange={e => set('instagram', e.target.value)} placeholder="@seusalao" />
                            </div>

                            <div className="crm-form-group">
                                <label className="crm-label">📞 Telefone do salão</label>
                                <input className="crm-input" value={form.salonPhone || ''} onChange={e => set('salonPhone', e.target.value)} placeholder="(91) 98888-0000" />
                            </div>

                            <div className="crm-form-group">
                                <label className="crm-label">📍 Endereço</label>
                                <input className="crm-input" value={form.salonAddress || ''} onChange={e => set('salonAddress', e.target.value)} placeholder="Rua das Flores, 123 — Belém/PA" />
                            </div>

                            {saveMsg && (
                                <div style={{ padding: '10px 14px', borderRadius: 8, marginBottom: 12, fontSize: '.82rem', fontWeight: 600, background: saveMsg.type === 'ok' ? '#DCFCE7' : '#FEE2E2', color: saveMsg.type === 'ok' ? '#15803D' : '#991B1B' }}>
                                    {saveMsg.text}
                                </div>
                            )}

                            <button onClick={save} disabled={saving || !!slugError} className="crm-btn crm-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12, fontSize: '.9rem', borderRadius: 'var(--radius-md)' }}>
                                {saving ? 'Salvando...' : '💾 Salvar Configurações'}
                            </button>
                        </div>
                    )}

                    {/* ── BLOCOS TAB ── */}
                    {activeTab === 'blocos' && (
                        <div>
                            {!editingSection ? (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                                    <div style={{ fontSize: '.78rem', color: 'var(--text-mid)', marginBottom: 4 }}>Reordene, ative/desative e edite o conteúdo de cada bloco.</div>
                                    {sections.map((sec, idx) => (
                                        <div key={sec.id} style={{
                                            background: sec.active ? 'white' : 'var(--bg)',
                                            border: '1.5px solid var(--border)',
                                            borderRadius: 'var(--radius-md)',
                                            padding: '12px 14px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8,
                                            opacity: sec.active ? 1 : 0.55
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                                    <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '.65rem', padding: '2px 4px', opacity: idx === 0 ? .3 : 1 }}>▲</button>
                                                    <button onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-light)', fontSize: '.65rem', padding: '2px 4px', opacity: idx === sections.length - 1 ? .3 : 1 }}>▼</button>
                                                </div>
                                                <div>
                                                    <div style={{ fontSize: '.83rem', fontWeight: 700, color: 'var(--text-dark)' }}>{SECTION_LABELS[sec.type] || sec.type}</div>
                                                    <div style={{ fontSize: '.72rem', color: 'var(--text-light)', marginTop: 1, maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sec.content?.title}</div>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <button onClick={() => setEditingSection(sec)} className="crm-btn crm-btn-ghost" style={{ padding: '5px 10px', fontSize: '.72rem' }}>✏️</button>
                                                <button onClick={() => toggleSection(sec)} className="crm-btn" style={{ padding: '5px 10px', fontSize: '.72rem', fontWeight: 700, background: sec.active ? '#FEE2E2' : '#DCFCE7', color: sec.active ? '#991B1B' : '#166534', border: 'none', cursor: 'pointer', borderRadius: 'var(--radius-sm)' }}>
                                                    {sec.active ? 'Off' : 'On'}
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    {sections.length === 0 && (
                                        <div className="crm-empty" style={{ padding: '32px 0' }}>
                                            <div className="crm-empty-icon">📄</div>
                                            <div className="crm-empty-title">Nenhum bloco encontrado</div>
                                            <div className="crm-empty-desc">Os blocos são criados automaticamente no primeiro acesso.</div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div>
                                    <button onClick={() => setEditingSection(null)} className="crm-btn crm-btn-ghost" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>← Voltar</button>
                                    <div style={{ fontSize: '.72rem', fontWeight: 700, color: 'var(--primary)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 14 }}>
                                        {SECTION_LABELS[editingSection.type] || editingSection.type}
                                    </div>
                                    <form onSubmit={saveSection} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                                        <div className="crm-form-group">
                                            <label className="crm-label">Título do bloco</label>
                                            <input className="crm-input" value={editingSection.content?.title || ''} onChange={e => changeContent('title', e.target.value)} />
                                        </div>

                                        {['banner', 'services', 'gallery'].includes(editingSection.type) && (
                                            <div className="crm-form-group">
                                                <label className="crm-label">Subtítulo / Descrição</label>
                                                <textarea className="crm-input crm-textarea"
                                                    value={editingSection.content?.subtitle || editingSection.content?.description || ''}
                                                    onChange={e => changeContent(editingSection.type === 'banner' ? 'subtitle' : 'description', e.target.value)}
                                                    rows={3} />
                                            </div>
                                        )}

                                        {editingSection.type === 'cta' && (
                                            <>
                                                <div className="crm-form-group">
                                                    <label className="crm-label">Texto do botão</label>
                                                    <input className="crm-input" value={editingSection.content?.buttonText || ''} onChange={e => changeContent('buttonText', e.target.value)} />
                                                </div>
                                                <div className="crm-form-group">
                                                    <label className="crm-label">Número WhatsApp</label>
                                                    <input className="crm-input" value={editingSection.content?.whatsapp || ''} onChange={e => changeContent('whatsapp', e.target.value)} placeholder="5591999999999" />
                                                </div>
                                            </>
                                        )}

                                        <button type="submit" className="crm-btn crm-btn-primary" style={{ width: '100%', justifyContent: 'center', padding: 12 }}>
                                            ✓ Salvar bloco
                                        </button>
                                    </form>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── Right: Live Preview ── */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 24px', gap: 12, overflow: 'hidden' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'white', padding: '7px 18px', borderRadius: 100, border: '1px solid var(--border)', fontSize: '.78rem', fontWeight: 600, color: 'var(--text-mid)', boxShadow: 'var(--shadow-sm)' }}>
                    <span style={{ width: 8, height: 8, background: '#22C55E', borderRadius: '50%', display: 'inline-block' }} />
                    Pré-visualização ao vivo
                    {slug && <span style={{ color: 'var(--text-light)' }}>· /{slug}</span>}
                </div>

                {previewUrl ? (
                    <div style={{ flex: 1, width: '100%', maxWidth: 900, background: 'white', borderRadius: 16, overflow: 'hidden', border: '6px solid #1E293B', boxShadow: '0 20px 60px rgba(0,0,0,.15)' }}>
                        <div style={{ background: '#1E293B', height: 32, display: 'flex', alignItems: 'center', padding: '0 14px', gap: 6 }}>
                            {['#FC5F5A', '#FDBD2E', '#27C840'].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                            <div style={{ flex: 1, background: '#334155', borderRadius: 4, height: 16, margin: '0 8px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
                                <span style={{ fontSize: '.65rem', color: '#94A3B8', fontFamily: 'monospace' }}>localhost:3000/{slug}</span>
                            </div>
                            <button onClick={() => { if (iframeRef.current) iframeRef.current.src = `/${slug}?_=${Date.now()}` }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94A3B8', fontSize: '.8rem', padding: '2px 6px' }} title="Recarregar">↺</button>
                        </div>
                        <iframe
                            ref={iframeRef}
                            src={previewUrl}
                            style={{ width: '100%', height: 'calc(100% - 32px)', border: 'none', background: 'white' }}
                            title="Preview do site"
                        />
                    </div>
                ) : (
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
                        <div style={{ fontSize: '3rem' }}>🌐</div>
                        <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-dark)' }}>Configure o endereço do seu site</div>
                        <div style={{ fontSize: '.875rem', color: 'var(--text-mid)', textAlign: 'center', maxWidth: 340 }}>
                            Defina o <strong>slug</strong> na aba "Informações" ao lado para ativar a pré-visualização do seu site.
                        </div>
                        <div style={{ background: 'var(--primary-light)', border: '1.5px solid var(--primary)', borderRadius: 'var(--radius-md)', padding: '12px 20px', fontSize: '.82rem', color: 'var(--primary)', fontWeight: 600 }}>
                            ← Preencha o campo "URL do seu site" e salve
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
