'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState, useEffect } from "react";

export default function ClientSearch({ initialQuery }: { initialQuery: string }) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [query, setQuery] = useState(initialQuery);

    // Debounce search
    useEffect(() => {
        const timeout = setTimeout(() => {
            if (query !== initialQuery) {
                const params = new URLSearchParams(searchParams.toString());
                if (query) {
                    params.set('q', query);
                } else {
                    params.delete('q');
                }
                params.delete('page'); // Reset pagination on search
                startTransition(() => {
                    router.push(`/crm/clientes?${params.toString()}`);
                });
            }
        }, 300);

        return () => clearTimeout(timeout);
    }, [query, router, searchParams, initialQuery]);

    return (
        <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">search</span>
            <input
                type="text"
                placeholder="Buscar cliente por nome ou telefone..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all dark:text-white shadow-sm"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {isPending && <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-primary animate-spin">progress_activity</span>}
        </div>
    );
}
