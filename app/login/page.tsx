"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Erro ao fazer login");
            }

            // Store token in cookie (for middleware) and localStorage (for API calls)
            document.cookie = `auth-token=${data.accessToken}; path=/; max-age=86400; SameSite=Strict`;
            localStorage.setItem("crm_token", data.accessToken);

            router.push("/crm");
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background-light dark:bg-background-dark p-6 font-display">
            <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl shadow-xl shadow-primary/10 border border-primary/10 overflow-hidden">
                <div className="p-8 text-center border-b border-primary/5">
                    <div className="size-16 bg-primary mx-auto rounded-full flex items-center justify-center text-white mb-4">
                        <span className="material-symbols-outlined text-3xl">spa</span>
                    </div>
                    <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Acesso CRM</h2>
                    <p className="text-sm text-slate-500 mt-1">Studio Josy Silva</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">E-mail</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="seu@email.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Senha</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full h-12 px-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full h-12 rounded-xl font-bold text-white transition-all shadow-lg ${loading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-primary/90 hover:-translate-y-0.5 shadow-primary/20'
                            }`}
                    >
                        {loading ? 'Entrando...' : 'Entrar no CRM'}
                    </button>
                </form>
            </div>
        </div>
    );
}
