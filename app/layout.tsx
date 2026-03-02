import type { Metadata } from 'next'
import { Inter, Outfit } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' })

export const metadata: Metadata = {
    title: 'AgendaPro - SaaS',
    description: 'Sistema completo flexível de agendamentos online.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body className={`${inter.variable} ${outfit.variable} font-sans antialiased text-deep-text selection:bg-primary/20`}>
                <div className="min-h-screen bg-slate-50 flex flex-col">
                    {/* Simplified Navbar for public non-tenant pages if needed */}
                    <nav className="w-full bg-white border-b border-gray-100 hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="flex-shrink-0 flex items-center">
                                    <h1 className="text-xl font-extrabold tracking-tight text-deep-text">AgendaPro</h1>
                                </div>
                            </div>
                        </div>
                    </nav>

                    <main className="flex-grow flex flex-col">
                        {children}
                    </main>

                    {/* Simplified Footer */}
                    <footer className="bg-white border-t border-gray-100 mt-auto py-8 hidden">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                            <h4 className="text-lg font-bold tracking-tight text-deep-text">AgendaPro</h4>
                            <p className="text-deep-text/60 mt-2 text-center max-w-md">Transformando a gestão do seu estúdio.</p>
                            <p className="text-deep-text/50 text-sm mt-6">© 2026 AgendaPro. Todos os direitos reservados.</p>
                        </div>
                    </footer>
                </div>
            </body>
        </html>
    )
}
