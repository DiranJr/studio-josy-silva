import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
    title: 'Studio Josy Silva - Extensões de Cílios de Luxo',
    description: 'Especialista em extensões de cílios e design de sobrancelhas de luxo. Realce sua beleza natural com sofisticação.',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <head>
                <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
                <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
            </head>
            <body className="bg-background-light text-deep-text selection:bg-primary/30">
                <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-primary/10">
                    <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="size-10 bg-primary rounded-full flex items-center justify-center text-white">
                                <span className="material-symbols-outlined text-2xl">content_cut</span>
                            </div>
                            <h1 className="text-xl font-extrabold tracking-tight text-deep-text">Studio Josy Silva</h1>
                        </div>
                    </div>
                </header>

                {children}

                <footer className="bg-white py-12 px-6 border-t border-primary/10">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex items-center gap-3">
                            <div className="size-8 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                                <span className="material-symbols-outlined text-xl">content_cut</span>
                            </div>
                            <h4 className="text-lg font-bold tracking-tight text-deep-text">Studio Josy Silva</h4>
                        </div>
                        <p className="text-deep-text/50 text-sm">© 2026 Studio Josy Silva. Todos os direitos reservados.</p>
                    </div>
                </footer>
            </body>
        </html>
    )
}
