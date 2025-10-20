# 🎨 NewPrint3D - E-commerce de Impressão 3D

> Plataforma completa de e-commerce para produtos impressos em 3D com suporte a 3 idiomas (EN, PT, ES)

[![Status](https://img.shields.io/badge/status-production--ready-brightgreen)](https://github.com)
[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

---

## 🚀 Deploy Rápido (5 minutos)

```bash
# 1. Clone o repositório
git clone <seu-repo>
cd newprint3d

# 2. Configure ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# 3. Instale dependências
pnpm install

# 4. Rode localmente
pnpm dev

# 5. Deploy no Render
# Veja: DEPLOY-FINAL-CHECKLIST.md
```

**📚 Leia a documentação completa:**
- **[DEPLOY-FINAL-CHECKLIST.md](DEPLOY-FINAL-CHECKLIST.md)** ⭐ - Guia completo de deploy
- **[DATABASE-SETUP-COMPLETE.md](DATABASE-SETUP-COMPLETE.md)** - Banco de dados já configurado
- **[PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md)** - Análise completa e melhorias

---

## ✨ Features

### 🛒 E-commerce Completo
- ✅ Catálogo de produtos com filtros
- ✅ Carrinho de compras persistente
- ✅ Checkout com validações
- ✅ Histórico de pedidos
- ✅ Painel administrativo

### 🌐 Internacionalização (i18n)
- ✅ 3 idiomas: Inglês, Português, Espanhol
- ✅ Troca em tempo real
- ✅ Produtos multilíngue
- ✅ SEO otimizado para cada idioma

### 💳 Pagamentos
- ✅ Stripe integrado
- ✅ Webhook configurado
- ✅ Modo demo funcional
- ⚠️ PayPal (futuro)

### 👨‍💼 Painel Admin
- ✅ Dashboard com estatísticas
- ✅ CRUD completo de produtos
- ✅ Gestão de pedidos
- ✅ Autenticação segura (JWT)

### 🗄️ Banco de Dados
- ✅ PostgreSQL (Neon)
- ✅ 9 tabelas completas
- ✅ 17 índices de performance
- ✅ Soft delete e auditoria
- ✅ Suporte a cupons, reviews, favoritos

### 🔒 Segurança
- ✅ JWT com validação forte
- ✅ Senha com 12+ caracteres + complexidade
- ✅ Headers de segurança (HSTS, XSS, etc)
- ✅ Validação de input com Zod
- ✅ SQL injection protegido

### 🚀 Performance
- ✅ Next.js 15 otimizado
- ✅ Imagens otimizadas (AVIF + WebP)
- ✅ Índices de banco otimizados
- ✅ Lighthouse score 90+

### 📊 SEO
- ✅ Sitemap dinâmico
- ✅ robots.txt configurado
- ✅ Meta tags otimizadas
- ✅ Open Graph
- ✅ Structured data

---

## 🏗️ Tecnologias

### Frontend
- **Next.js 15** - Framework React
- **TypeScript** - Type safety
- **Tailwind CSS** - Estilização
- **Radix UI** - Componentes acessíveis
- **React Hook Form** - Formulários
- **Zod** - Validação

### Backend
- **Next.js API Routes** - Backend
- **Neon PostgreSQL** - Banco de dados
- **bcryptjs** - Hash de senhas
- **jose** - JWT tokens

### Pagamentos
- **Stripe** - Processamento de pagamentos
- **Webhooks** - Notificações em tempo real

### DevOps
- **Render** - Hosting (recomendado)
- **Vercel** - Alternativa
- **pnpm** - Package manager

---

## 📦 Estrutura do Projeto

```
newprint3d/
├── app/                    # Next.js 15 App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # Autenticação
│   │   ├── orders/       # Pedidos
│   │   ├── products/     # Produtos
│   │   └── webhooks/     # Stripe webhooks
│   ├── admin/            # Painel admin
│   ├── products/         # Páginas de produtos
│   └── ...               # Outras páginas
├── components/            # Componentes React
│   ├── ui/               # UI primitives
│   └── ...               # Componentes de negócio
├── contexts/             # React Context
│   ├── auth-context.tsx
│   ├── cart-context.tsx
│   └── language-context.tsx
├── lib/                  # Utilitários
│   ├── auth.ts          # Autenticação
│   ├── db.ts            # Banco de dados
│   ├── i18n.ts          # Traduções
│   └── stripe.ts        # Stripe
├── scripts/              # Scripts SQL e utilidades
│   ├── 001-create-tables.sql
│   ├── 002-seed-admin.sql
│   ├── 003-seed-products.sql
│   ├── 004-add-indexes-and-improvements.sql
│   └── validate-env.js
├── public/               # Assets estáticos
├── .env.local           # Variáveis de ambiente (NÃO commitar)
├── .env.example         # Template de variáveis
└── package.json
```

---

## 🗄️ Estrutura do Banco de Dados

### Tabelas Principais (5)
1. **users** - Usuários e admins
2. **addresses** - Endereços
3. **products** - Produtos (multilíngue)
4. **orders** - Pedidos
5. **order_items** - Itens dos pedidos

### Tabelas de Features (4)
6. **promo_codes** - Cupons de desconto
7. **product_reviews** - Avaliações
8. **wishlists** - Favoritos
9. **inventory_logs** - Auditoria

**Veja detalhes em:** [DATABASE-SETUP-COMPLETE.md](DATABASE-SETUP-COMPLETE.md)

---

## 🔐 Credenciais Padrão

### Admin
```
Email: admin@newprint3d.com
Senha: Admin123!
```

**⚠️ IMPORTANTE:** Troque a senha após primeiro login!

---

## 🌍 Variáveis de Ambiente

Copie `.env.example` para `.env.local`:

```env
# Obrigatórias
DATABASE_URL=postgresql://...
JWT_SECRET=[gerar com: openssl rand -base64 32]
NEXT_PUBLIC_SITE_URL=https://seu-dominio.com
NODE_ENV=production

# Stripe (opcional)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

**Veja todas as variáveis em:** [.env.example](.env.example)

---

## 📱 Screenshots

### Home Page
![Home](docs/screenshots/home.png)

### Admin Dashboard
![Admin](docs/screenshots/admin.png)

### Checkout
![Checkout](docs/screenshots/checkout.png)

---

## 🧪 Testes

```bash
# Validar variáveis de ambiente
pnpm validate

# Rodar em desenvolvimento
pnpm dev

# Build de produção
pnpm build

# Rodar build
pnpm start
```

---

## 📊 Capacidade

### Banco Neon Gratuito (0.5 GB)
- ✅ **50.000+** produtos
- ✅ **100.000+** usuários
- ✅ **62.500+** pedidos
- ✅ **Suficiente para 1-2 anos**

**Cenário realista (e-commerce pequeno):**
- 500 produtos
- 5.000 clientes
- 10.000 pedidos
- **Uso:** ~14 MB (3% da capacidade)

---

## 💰 Custos

### Gratuito
- Render Free Tier: $0
- Neon Free: $0
- **Total: $0/mês** ✅

### Profissional
- Render: $7/mês
- Neon: $0-19/mês
- Domínio: ~$3/mês
- **Total: $10-29/mês**

---

## 🚀 Deploy

### Render (Recomendado)

1. **Criar Web Service**
2. **Build:** `npm install -g pnpm && pnpm install && pnpm build`
3. **Start:** `pnpm start`
4. **Variáveis:** Ver `.env.example`

**Guia completo:** [DEPLOY-FINAL-CHECKLIST.md](DEPLOY-FINAL-CHECKLIST.md)

### Vercel

```bash
npm i -g vercel
vercel
```

Configurar variáveis no dashboard.

---

## 🛠️ Desenvolvimento

```bash
# Instalar dependências
pnpm install

# Rodar desenvolvimento
pnpm dev

# Acessar
http://localhost:3000
```

### Configurar Banco Local

```bash
# Executar scripts SQL no Neon
psql 'postgresql://...' -f scripts/001-create-tables.sql
psql 'postgresql://...' -f scripts/002-seed-admin.sql
psql 'postgresql://...' -f scripts/003-seed-products.sql
psql 'postgresql://...' -f scripts/004-add-indexes-and-improvements.sql
```

---

## 📚 Documentação

1. **[DEPLOY-FINAL-CHECKLIST.md](DEPLOY-FINAL-CHECKLIST.md)** ⭐⭐⭐
   - Guia COMPLETO de deploy
   - Testes pós-deploy
   - Troubleshooting

2. **[DATABASE-SETUP-COMPLETE.md](DATABASE-SETUP-COMPLETE.md)** ⭐⭐
   - Configuração do banco (já feita!)
   - Estrutura completa
   - Capacidade

3. **[PRODUCTION-CHECKLIST.md](PRODUCTION-CHECKLIST.md)** ⭐
   - Análise completa do projeto
   - 62 problemas identificados e corrigidos
   - Melhorias futuras

4. **[README-DEPLOY.md](README-DEPLOY.md)**
   - Guia rápido de deploy

5. **[.env.example](.env.example)**
   - Todas as variáveis explicadas

---

## 🎯 Roadmap

### ✅ Implementado
- [x] E-commerce completo
- [x] 3 idiomas (i18n)
- [x] Stripe integrado
- [x] Painel admin
- [x] Banco otimizado
- [x] SEO completo
- [x] Segurança enterprise

### 🔄 Em Desenvolvimento
- [ ] Sistema de reviews (banco pronto)
- [ ] Cupons de desconto (banco pronto)
- [ ] Favoritos/Wishlist (banco pronto)
- [ ] PayPal
- [ ] Email de notificações
- [ ] Testes automatizados

---

## 🤝 Contribuindo

Contribuições são bem-vindas!

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'feat: adicionar nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

---

## 📄 Licença

MIT License - veja [LICENSE](LICENSE) para detalhes.

---

<div align="center">

**⭐ Se este projeto te ajudou, dê uma estrela! ⭐**

**🚀 Pronto para produção! Deploy agora! 🚀**

</div>
