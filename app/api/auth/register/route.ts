export const dynamic = "force-dynamic";

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { signAccessToken } from '@/lib/jwt'

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const { tenantName, slug, name, email, password } = body

        // Basic validation
        if (!tenantName || !slug || !name || !email || !password) {
            return NextResponse.json({ error: 'Todos os campos são obrigatórios' }, { status: 400 })
        }

        const formattedSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '');

        // Check if slug exists
        const existingTenant = await prisma.tenant.findUnique({ where: { slug: formattedSlug } })
        if (existingTenant) {
            return NextResponse.json({ error: 'Esse link já está em uso, escolha outro' }, { status: 409 })
        }

        // Check if email exists
        const existingUser = await prisma.user.findUnique({ where: { email } })
        if (existingUser) {
            return NextResponse.json({ error: 'E-mail já cadastrado' }, { status: 409 })
        }

        const passwordHash = await bcrypt.hash(password, 10)

        // Create Tenant along with User, SiteSettings and SiteSections
        const tenant = await prisma.tenant.create({
            data: {
                name: tenantName,
                slug: formattedSlug,
                users: {
                    create: {
                        name,
                        email,
                        passwordHash,
                        role: 'ADMIN'
                    }
                },
                siteSettings: {
                    create: {
                        title: tenantName,
                        description: `Bem-vindo ao ${tenantName}. Oferecemos os melhores serviços e cuidados.`,
                    }
                },
                siteSections: {
                    create: [
                        { type: 'banner', order: 0, content: { title: tenantName, subtitle: 'Sua beleza em primeiro lugar.' } },
                        { type: 'services', order: 1, content: { title: 'Nossos Serviços', description: 'Confira os procedimentos disponíveis.' } },
                        { type: 'gallery', order: 2, content: { title: 'Galeria', description: 'Veja alguns de nossos trabalhos.' } },
                        { type: 'cta', order: 3, content: { title: 'Agende seu horário', buttonText: 'Agendar via WhatsApp', whatsapp: '' } }
                    ]
                }
            },
            include: {
                users: true
            }
        })

        const user = tenant.users[0]
        const token = signAccessToken({ userId: user.id, role: user.role, tenantId: tenant.id })

        return NextResponse.json({
            token,
            user: { id: user.id, name: user.name, email: user.email, role: user.role, tenant: { slug: tenant.slug, name: tenant.name } }
        })

    } catch (error) {
        console.error('Register error:', error)
        return NextResponse.json({ error: 'Erro interno no servidor' }, { status: 500 })
    }
}
