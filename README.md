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
- ✅ Stripe Checkout Sessions integrado
- ✅ PayPal Standard Checkout integrado
- ✅ Webhooks configurados
- ✅ Modo demo funcional
- ✅ Suporte a múltiplos métodos de pagamento

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
- **Stripe Checkout Sessions** - Pagamentos com cartão
- **PayPal Standard Checkout** - Pagamentos via PayPal
- **Webhooks** - Notificações em tempo real
- **Fulfillment Automation** - Processamento automático de pedidos

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

# Stripe (opcional - para pagamentos com cartão)
STRIPE_SECRET_KEY=sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# PayPal (opcional - para pagamentos via PayPal)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=...
PAYPAL_CLIENT_SECRET=...
```

**Veja todas as variáveis em:** [.env.example](.env.example)

---

## 💳 Configuração de Pagamentos

### 🔷 Stripe Checkout Sessions

A plataforma usa Stripe Checkout Sessions (padrão oficial do Stripe) com processamento automático de pedidos via webhooks.

#### 1. Criar conta Stripe
1. Acesse [stripe.com](https://stripe.com) e crie uma conta
2. Ative sua conta fornecendo informações bancárias
3. Obtenha suas chaves API em **Developers > API Keys**

#### 2. Configurar variáveis de ambiente

```env
# Chaves de API (modo teste ou produção)
STRIPE_SECRET_KEY=sk_test_... ou sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... ou pk_live_...
```

#### 3. Configurar Webhook

O webhook processa automaticamente os pagamentos e cria pedidos no banco de dados.

**No Dashboard do Stripe:**

1. Vá em **Developers > Webhooks**
2. Clique em **Add endpoint**
3. Configure:
   - **URL do endpoint**: `https://seu-dominio.com/api/webhooks/stripe`
   - **Descrição**: "NewPrint3D Order Fulfillment"
   - **Versão**: Latest API version
   - **Eventos para escutar**:
     ```
     checkout.session.completed
     checkout.session.async_payment_succeeded
     checkout.session.async_payment_failed
     checkout.session.expired
     payment_intent.succeeded
     payment_intent.payment_failed
     charge.dispute.created
     charge.dispute.funds_reinstated
     charge.refunded
     refund.created
     refund.updated
     refund.failed
     ```
   - **OU** selecione "Select all events" para capturar todos

4. Após criar, copie o **Signing secret** (whsec_...)

#### 4. Adicionar secret do webhook

```env
STRIPE_WEBHOOK_SECRET=whsec_...
```

#### 5. Testar Integração (Sandbox)

Use cartões de teste do Stripe:

- **Sucesso**: `4242 4242 4242 4242`
- **Cartão declinado**: `4000 0000 0000 0002`
- **3D Secure requerido**: `4000 0027 6000 3184`
- **Data de validade**: Qualquer data futura
- **CVV**: Qualquer 3 dígitos
- **CEP**: Qualquer valor

**Testar webhook localmente com Stripe CLI:**

```bash
# Instalar Stripe CLI
brew install stripe/stripe-cli/stripe  # macOS
# ou baixar em: https://stripe.com/docs/stripe-cli

# Login
stripe login

# Encaminhar webhooks para localhost
stripe listen --forward-to localhost:3000/api/webhooks/stripe

# Em outro terminal, criar evento de teste
stripe trigger checkout.session.completed
```

#### 6. Ir para Produção

1. No Stripe Dashboard, ative o **modo produção** (toggle no canto superior direito)
2. Obtenha as **chaves de produção** em Developers > API Keys
3. Crie um novo **webhook de produção** com a mesma configuração
4. Atualize as variáveis de ambiente no Render/Vercel:
   ```env
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_... (novo secret de produção)
   ```

#### Recursos Implementados

- ✅ **Checkout Sessions** - Fluxo de checkout hospedado pelo Stripe
- ✅ **Fulfillment Automático** - Pedidos criados automaticamente após pagamento
- ✅ **Idempotência** - Previne duplicação de pedidos
- ✅ **Validação de Valores** - Verifica se o valor pago corresponde ao pedido
- ✅ **Múltiplos Métodos de Pagamento** - Cartões, wallets, etc
- ✅ **Envio Internacional** - Suporte a BR e US
- ✅ **Cupons de Desconto** - Suporte nativo do Stripe
- ✅ **Gestão de Disputas** - Rastreamento de chargebacks
- ✅ **Reembolsos** - Processamento automático

#### Fluxo de Pagamento

1. Cliente adiciona produtos ao carrinho
2. Cliente preenche dados de envio no checkout
3. Cliente clica em "Pay with Stripe"
4. Redirecionado para Stripe Checkout (hospedado)
5. Cliente preenche dados do cartão
6. Stripe processa pagamento
7. **Webhook `checkout.session.completed`** é disparado
8. Sistema cria pedido no banco automaticamente
9. Cliente redirecionado para página de sucesso com número do pedido
10. Email de confirmação enviado (se configurado)

---

### 🔶 PayPal Standard Checkout

A plataforma usa PayPal Standard Checkout com integração via SDK JavaScript.

#### 1. Criar conta PayPal Business

1. Acesse [paypal.com](https://www.paypal.com)
2. Crie uma **conta Business**
3. Acesse o [Developer Dashboard](https://developer.paypal.com/dashboard/)
4. Crie um **aplicativo REST**:
   - Nome: "NewPrint3D"
   - Tipo: Merchant

#### 2. Obter credenciais

No app criado, você verá:
- **Client ID** (público)
- **Secret** (privado)

O PayPal fornece credenciais separadas para **Sandbox** e **Live**.

#### 3. Configurar variáveis de ambiente

**Para Sandbox (testes):**
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=sandbox_client_id...
PAYPAL_CLIENT_SECRET=sandbox_secret...
NODE_ENV=development
```

**Para Produção:**
```env
NEXT_PUBLIC_PAYPAL_CLIENT_ID=live_client_id...
PAYPAL_CLIENT_SECRET=live_secret...
NODE_ENV=production
```

#### 4. Criar contas de teste (Sandbox)

No [PayPal Sandbox](https://developer.paypal.com/dashboard/accounts):

1. Crie uma **conta Business** (para receber pagamentos)
2. Crie uma **conta Personal** (para fazer pagamentos de teste)
3. Anote as credenciais de ambas

#### 5. Testar Integração (Sandbox)

1. Configure `NODE_ENV=development`
2. Use as credenciais de **Sandbox**
3. No checkout, selecione "PayPal"
4. Faça login com a **conta Personal de teste**
5. Aprove o pagamento
6. Verifique se o pedido foi criado no banco
7. Verifique se o dinheiro apareceu na **conta Business de teste**

**Contas de teste de exemplo:**
```
Comprador (Personal):
Email: sb-buyer@personal.example.com
Senha: (gerada pelo PayPal)

Vendedor (Business):
Email: sb-seller@business.example.com
Senha: (gerada pelo PayPal)
```

#### 6. Ir para Produção

1. Complete o processo de verificação da conta Business
2. Ative o modo Live no Developer Dashboard
3. Obtenha as **credenciais Live**
4. Atualize as variáveis de ambiente:
   ```env
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=live_client_id...
   PAYPAL_CLIENT_SECRET=live_secret...
   NODE_ENV=production
   ```
5. Teste com uma transação real de valor baixo

#### Recursos Implementados

- ✅ **PayPal SDK JavaScript** - Botões nativos do PayPal
- ✅ **Create Order API** - Criação de pedidos no servidor
- ✅ **Capture Payment API** - Captura de pagamentos
- ✅ **Gestão de Erros** - Tratamento de falhas
- ✅ **Cancelamento** - Suporte a pagamentos cancelados
- ✅ **Múltiplas Moedas** - USD configurado
- ✅ **Informações de Envio** - Coleta de endereço
- ✅ **Persistência de Pedidos** - Salvamento automático no banco
- ✅ **Atualização de Estoque** - Decrementação automática

#### Fluxo de Pagamento

1. Cliente adiciona produtos ao carrinho
2. Cliente preenche dados de envio no checkout
3. Cliente clica no botão PayPal
4. **createOrder** chamado no backend (`/api/paypal/create-order`)
5. PayPal retorna `orderID`
6. Popup do PayPal é aberto
7. Cliente faz login e aprova o pagamento
8. **onApprove** é chamado
9. **captureOrder** chamado no backend (`/api/paypal/capture-order`)
10. Backend salva pedido no banco e atualiza estoque
11. Cliente é redirecionado para página de pedidos
12. Toast de sucesso é exibido

#### Personalização dos Botões (Opcional)

No arquivo `components/paypal-button.tsx`, você pode customizar:

```typescript
window.paypal.Buttons({
  style: {
    layout: 'vertical',  // 'vertical' ou 'horizontal'
    color: 'gold',       // 'gold', 'blue', 'silver', 'white', 'black'
    shape: 'rect',       // 'rect' ou 'pill'
    label: 'paypal',     // 'paypal', 'checkout', 'buynow', 'pay'
  },
  // ...
})
```

#### Modo Demo

Se as credenciais do PayPal não estiverem configuradas, o sistema mostrará uma mensagem informativa:

```
Demo Mode: PayPal not configured
To enable PayPal, add NEXT_PUBLIC_PAYPAL_CLIENT_ID to your environment variables.
```

---

### 🔄 Modo Demo (Sem Credenciais)

Ambos Stripe e PayPal funcionam em **modo demo** se as credenciais não estiverem configuradas:

- Interface funcional
- Simulação de pagamentos
- Criação de pedidos fake
- Útil para desenvolvimento e demonstrações

Para desabilitar modo demo, configure as credenciais de pelo menos um gateway de pagamento.

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

### 🔄 Próximas Features
- [ ] Sistema de reviews (banco pronto)
- [ ] Cupons de desconto (banco pronto)
- [ ] Favoritos/Wishlist (banco pronto)
- [ ] Email de notificações
- [ ] Testes automatizados
- [ ] PWA (Progressive Web App)

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


</div>
