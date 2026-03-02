"use client"

import { useState, useEffect, useRef } from 'react'

export default function SiteEditor() {
    const [sections, setSections] = useState<any[]>([])
    const [editingSection, setEditingSection] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState<any>(null)
    const iframeRef = useRef<HTMLIFrameElement>(null)

    // Load Tenant User to get the slug for the iframe
    useEffect(() => {
        const fetchUser = async () => {
            const res = await fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            if (res.ok) {
                const data = await res.json()
                setUser(data)
            }
        }
        fetchUser()
    }, [])

    const loadSections = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/crm/sections', {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            })
            if (res.ok) {
                const data = await res.json()
                setSections(data)
                return data
            }
        } finally {
            setLoading(false)
        }
        return []
    }

    useEffect(() => { loadSections() }, [])

    const refreshPreview = (sectionsData: any[]) => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'UPDATE_ALL_SECTIONS',
                sections: sectionsData
            }, '*')
        }
    }

    const moveSection = async (index: number, direction: 'up' | 'down') => {
        if (direction === 'up' && index === 0) return
        if (direction === 'down' && index === sections.length - 1) return

        const newSections = [...sections]
        const swapIndex = direction === 'up' ? index - 1 : index + 1

        // Swap
        const temp = newSections[index]
        newSections[index] = newSections[swapIndex]
        newSections[swapIndex] = temp

        // Update orders
        const payload = newSections.map((sec, i) => ({ id: sec.id, order: i }))

        // Optimistic UI update
        setSections(newSections)

        await fetch('/api/crm/sections', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(payload)
        })

        refreshPreview(newSections)
    }

    const toggleActive = async (section: any) => {
        const newActive = !section.active
        setSections(sections.map(s => s.id === section.id ? { ...s, active: newActive } : s))

        await fetch('/api/crm/sections', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id: section.id, active: newActive })
        })

        refreshPreview(sections.map(s => s.id === section.id ? { ...s, active: newActive } : s))
    }

    const saveEditingSection = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!editingSection) return

        const res = await fetch('/api/crm/sections', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({ id: editingSection.id, content: editingSection.content })
        })

        if (res.ok) {
            setEditingSection(null)
            const freshSections = await loadSections()
            refreshPreview(freshSections)
        } else {
            alert('Erro ao salvar bloco.')
        }
    }

    const handleContentChange = (field: string, value: string) => {
        const newSection = {
            ...editingSection,
            content: { ...editingSection.content, [field]: value }
        }
        setEditingSection(newSection)

        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.postMessage({
                type: 'UPDATE_SECTION',
                section: newSection
            }, '*')
        }
    }

    return (
        <div className="h-[calc(100vh-80px)] overflow-hidden bg-gray-50 flex flex-col md:flex-row border-t border-gray-200">
            {/* Left Drawer: Editor */}
            <div className="w-full md:w-[400px] bg-white border-r border-gray-200 flex flex-col h-full overflow-y-auto shrink-0 shadow-lg relative z-10">
                <div className="p-6 border-b border-gray-100 bg-white sticky top-0 z-20">
                    <h1 className="text-2xl font-extrabold text-deep-text">Website Editor</h1>
                    <p className="text-sm text-gray-500 mt-1">Configure as seções da sua página pública.</p>
                </div>

                <div className="flex-1 p-6">
                    {loading ? (
                        <div className="text-center py-10 text-gray-400">Carregando blocos...</div>
                    ) : editingSection ? (
                        <div className="animate-in slide-in-from-left-4 fade-in">
                            <button
                                onClick={() => setEditingSection(null)}
                                className="mb-6 flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-gray-800 transition bg-gray-100 px-4 py-2 rounded-lg"
                            >
                                <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                                Voltar
                            </button>

                            <h2 className="text-lg font-bold mb-4 uppercase text-primary tracking-widest text-sm">Editar {editingSection.type}</h2>
                            <form onSubmit={saveEditingSection} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Título do Bloco</label>
                                    <input
                                        type="text"
                                        value={editingSection.content.title || ''}
                                        onChange={(e) => handleContentChange('title', e.target.value)}
                                        className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                    />
                                </div>

                                {['banner', 'services', 'gallery'].includes(editingSection.type) && (
                                    <div>
                                        <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Descrição / Subtítulo</label>
                                        <textarea
                                            value={editingSection.content.subtitle || editingSection.content.description || ''}
                                            onChange={(e) => handleContentChange(editingSection.type === 'banner' ? 'subtitle' : 'description', e.target.value)}
                                            rows={3}
                                            className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                        />
                                    </div>
                                )}

                                {editingSection.type === 'cta' && (
                                    <>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Texto do Botão</label>
                                            <input
                                                type="text"
                                                value={editingSection.content.buttonText || ''}
                                                onChange={(e) => handleContentChange('buttonText', e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">WhatsApp</label>
                                            <input
                                                type="text"
                                                value={editingSection.content.whatsapp || ''}
                                                onChange={(e) => handleContentChange('whatsapp', e.target.value)}
                                                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none"
                                            />
                                        </div>
                                    </>
                                )}

                                <button type="submit" className="w-full bg-primary text-white font-bold py-3 rounded-xl hover:bg-primary/90 transition shadow-lg shadow-primary/20 mt-6">
                                    Salvar Alterações
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-right-4 fade-in">
                            {sections.map((section, idx) => (
                                <div key={section.id} className={`bg-white border ${section.active ? 'border-gray-200 shadow-sm' : 'border-gray-100 opacity-60'} rounded-2xl p-4 flex items-center justify-between transition-all hover:border-primary/40`}>
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col text-gray-400">
                                            <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="hover:text-primary disabled:opacity-30">
                                                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_up</span>
                                            </button>
                                            <button onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1} className="hover:text-primary disabled:opacity-30">
                                                <span className="material-symbols-outlined text-[18px]">keyboard_arrow_down</span>
                                            </button>
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 uppercase text-xs tracking-widest mb-1">{section.type}</p>
                                            <p className="text-sm text-gray-500 truncate max-w-[150px]">{section.content.title}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => setEditingSection(section)}
                                            className="w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition"
                                            title="Editar Bloco"
                                        >
                                            <span className="material-symbols-outlined text-[16px]">edit</span>
                                        </button>
                                        <button
                                            onClick={() => toggleActive(section)}
                                            className={`w-8 h-8 rounded-full flex items-center justify-center transition ${section.active ? 'bg-green-100 text-green-600 hover:bg-green-200' : 'bg-red-100 text-red-600 hover:bg-red-200'}`}
                                            title={section.active ? 'Desativar Bloco' : 'Ativar Bloco'}
                                        >
                                            <span className="material-symbols-outlined text-[16px]">{section.active ? 'visibility' : 'visibility_off'}</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Panel: Live Preview iframe */}
            <div className="flex-1 bg-gray-100 p-8 flex flex-col relative overflow-hidden">
                <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg border border-gray-200 flex items-center gap-2 z-10 font-medium text-sm text-gray-600">
                    <span className="material-symbols-outlined text-green-500">fiber_manual_record</span>
                    Live Preview
                </div>

                {user?.tenant?.slug ? (
                    <div className="w-full h-full bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-gray-800">
                        <iframe
                            ref={iframeRef}
                            src={`/${user.tenant.slug}`}
                            className="w-full h-full border-0 bg-white"
                            title="Live Preview"
                        />
                    </div>
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <p className="text-gray-400">Carregando preview...</p>
                    </div>
                )}
            </div>
        </div>
    )
}
