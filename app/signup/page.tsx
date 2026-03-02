"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const [formData, setFormData] = useState({
        tenantName: '',
        slug: '',
        name: '',
        email: '',
        password: ''
    })

    const slugify = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

    const handleTenantNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value
        setFormData({ ...formData, tenantName: val, slug: slugify(val) })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                localStorage.setItem('token', data.token)
                router.push('/crm/dashboard')
            } else {
                setError(data.error || 'Erro ao realizar cadastro')
            }
        } catch (err) {
            setError('Erro de conexão')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center mb-8">
                <span className="material-symbols-outlined text-primary text-5xl">auto_awesome</span>
                <h2 className="mt-4 text-center text-3xl font-extrabold text-gray-900">
                    Crie sua conta
                </h2>
                <p className="mt-2 text-center text-sm text-gray-600">
                    Comece a usar o sistema completo gratuitamente hoje mesmo.
                </p>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-primary/5 sm:rounded-2xl sm:px-10 border border-gray-100">
                    {error && (
                        <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium mb-6 animate-in fade-in slide-in-from-top-2">
                            {error}
                        </div>
                    )}

                    <form className="space-y-5" onSubmit={handleSubmit}>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Nome do seu Negócio</label>
                            <input
                                type="text"
                                required
                                value={formData.tenantName}
                                onChange={handleTenantNameChange}
                                placeholder="Ex: Studio Bela"
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Link do seu Site</label>
                            <div className="flex bg-gray-50 rounded-xl overflow-hidden border border-gray-300 focus-within:ring-2 focus-within:ring-primary focus-within:border-transparent transition">
                                <span className="flex items-center px-4 text-gray-500 bg-gray-100 border-r border-gray-300 text-sm font-mono shrink-0">
                                    seusite.com/
                                </span>
                                <input
                                    type="text"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: slugify(e.target.value) })}
                                    className="flex-1 block w-full px-4 py-3 bg-transparent border-none focus:ring-0 sm:text-sm lowercase"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Seu Nome Completo</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                placeholder="João da Silva"
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">E-mail de acesso</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder="voce@exemplo.com"
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Senha de acesso</label>
                            <input
                                type="password"
                                required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                placeholder="••••••••"
                                className="appearance-none block w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent sm:text-sm transition"
                            />
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-primary/30 text-sm font-bold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition"
                            >
                                {loading ? 'Criando sua conta...' : 'Começar Agora'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Já tem uma conta?{' '}
                            <Link href="/login" className="font-bold text-primary hover:text-primary/80 transition">
                                Entrar no sistema
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
