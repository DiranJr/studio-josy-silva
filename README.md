# AgendaPro — Plataforma SaaS para Salões de Beleza

Sistema completo de agendamento online, CRM e site profissional para salões de beleza, estúdios de cílios e lash artists.

---

## ✨ Funcionalidades Principais

### 🌐 Site Público (Landing Page do Salão)
- Landing page profissional por slug personalizado (`/seu-salao`)
- **10 templates visuais** completamente diferentes, alternáveis em 1 clique pelo CRM
- Seções configuráveis: Banner, Serviços, Galeria, CTA
- Preview ao vivo no editor antes de publicar
- Link de agendamento online integrado

### 📅 Fluxo de Agendamento (Cliente)
- Listagem de serviços com preços e duração
- Cálculo de disponibilidade em tempo real (horários de trabalho + folgas)
- Formulário de dados do cliente
- Seleção de forma de pagamento / taxa de reserva
- Confirmação com WhatsApp

### 🖥️ CRM Administrativo — Design System `crm.css`
Todas as telas usam um sistema de design próprio em **Vanilla CSS** com paleta roxa AgendaPro.

| Tela | Funcionalidades |
|------|----------------|
| **Dashboard** | Métricas de receita, próximos agendamentos |
| **Agendamentos** | Calendário interativo, confirmar/cancelar, novo agendamento |
| **Clientes** | Busca, cards, painel lateral com histórico completo |
| **Serviços** | Ativar/desativar, editar preço e duração inline, modal de criação |
| **Financeiro** | Filtros de período, receita por serviço, tabela detalhada |
| **Meu Site** | Editor de slug, informações, blocos e **seletor de templates** |
| **Configurações** | Horários semanais de atendimento, datas de folga no calendário |

### 🎨 Templates de Site (10 opções)
1. **Beauty** — Rosa suave, estilo salão de beleza clássico
2. **Nails** — Rosa sofisticado, com card flutuante
3. **Brow** — Minimalista neutro
4. **Elegant** — Escuro com dourado, visual luxuoso
5. **Minimal** — Branco + preto, alta legibilidade
6. **Vibrant** — Gradientes coloridos e dinâmicos
7. **Botanical** — Verde natural, estilo orgânico/spa
8. **Retro** — Tons terrosos e tipografia vintage
9. **Modern** — Cinza escuro com detalhes neon
10. **Pastel** — Tons pastéis suaves e delicados

---

## 🛠️ Tech Stack

| Categoria | Tecnologia |
|-----------|-----------|
| Framework | Next.js 14 (App Router) |
| Banco de dados | PostgreSQL + Prisma ORM |
| Estilização | Vanilla CSS + CSS Variables (sem Tailwind no CRM) |
| Autenticação | JWT (Access + Refresh Tokens) |
| API | Next.js Route Handlers (App Router) |
| Upload | API própria via multipart/form-data |
| Docs API | Swagger UI (`/docs`) |
| Testes | Vitest |

---

## 🚀 Como Rodar Localmente

### Pré-requisitos
- Node.js v18+
- PostgreSQL rodando (local ou Docker)

### Instalação

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/studio-josy-silva.git
cd studio-josy-silva

# 2. Instale as dependências
npm install

# 3. Configure o ambiente
cp .env.example .env
# Edite .env e defina DATABASE_URL e JWT_SECRET

# 4. Aplique as migrations e popule o banco
npx prisma migrate dev
npx prisma db seed

# 5. Rode em desenvolvimento
npm run dev
```

### URLs

| URL | Descrição |
|-----|-----------|
| `http://localhost:3000` | Landing page do AgendaPro |
| `http://localhost:3000/studio-josy-silva` | Site público do salão (exemplo) |
| `http://localhost:3000/login` | Login do CRM |
| `http://localhost:3000/crm` | Dashboard administrativo |
| `http://localhost:3000/docs` | Swagger UI (documentação da API) |

---

## 🔐 Acesso Administrador (Seed padrão)

```
Email: josy@studiojosy.com
Senha: josy123
```

---

## 📁 Estrutura do Projeto

```
app/
├── [slug]/              # Site público do salão (SSR)
│   ├── layouts/         # 10 templates visuais
│   ├── templates/       # Componentes reutilizáveis (Banner, Services...)
│   └── components/      # LivePreviewWrapper (postMessage)
├── crm/                 # CRM administrativo
│   ├── crm.css          # Design system Vanilla CSS
│   ├── layout.tsx       # Sidebar e topbar
│   ├── page.tsx         # Dashboard
│   ├── agendamentos/    # Gerenciamento de agendamentos
│   ├── clientes/        # Gestão de clientes
│   ├── servicos/        # Serviços e preços
│   ├── financeiro/      # Relatórios financeiros
│   ├── site/            # Editor do site (slug + templates)
│   └── configuracoes/   # Horários de trabalho
├── api/                 # Route Handlers
│   ├── auth/            # Login, Register, Me
│   └── crm/             # Endpoints do CRM
└── page.tsx             # Landing page AgendaPro
```

---

## 🧪 Testes

```bash
npm run test
```

---

## 📖 API

Documentação interativa disponível em `/docs` após iniciar o servidor.

---

*Desenvolvido com ❤️ para a Studio Josy Silva*
