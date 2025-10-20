# Guia de Integrações do NewPrint3D

## Índice
- [Aviso Inicial](#aviso-inicial)
- [Dados Estáticos (Modo Demonstração)](#dados-estaticos-modo-demonstracao)
- [Banco (Neon)](#banco-neon)
- [Pagamentos (Stripe)](#pagamentos-stripe)
- [Autenticação](#autenticacao)
- [Variáveis de Ambiente](#variaveis-de-ambiente)
- [Deploy (Vercel) e Domínio (Hostinger)](#deploy-vercel-e-dominio-hostinger)
- [Painel Administrativo](#painel-administrativo)
- [Segurança](#seguranca)
- [Troubleshooting](#troubleshooting)

## Aviso Inicial
Todas as integrações (Neon/Stripe/Auth) são opcionais; o site funciona em modo demonstração sem
nenhuma configuração. Enquanto `DATABASE_URL`, chaves do Stripe e `JWT_SECRET` estiverem vazios,
as rotas `/api` operam em `isDemoMode` e o front-end trabalha apenas com dados locais.

## Dados Estáticos (Modo Demonstração)
O projeto inclui dados estáticos em `data/products.json` que alimentam o catálogo quando o banco
não está configurado. Para editar os produtos em modo demonstração:

1. Abra o arquivo `data/products.json` na raiz do projeto.
2. Cada produto segue esta estrutura:
   \`\`\`json
   {
     "id": "stand07",
     "name": {
       "en": "Adjustable Tablet Stand",
       "pt": "Suporte para Tablet Ajustável",
       "es": "Soporte para Tablet Ajustable"
     },
     "description": {
       "en": "Multi-angle adjustable stand...",
       "pt": "Suporte ajustável multiângulo...",
       "es": "Soporte ajustable multiángulo..."
     },
     "category": "accessories",
     "basePrice": 27.99,
     "image": "/modern-3d-printed-phone-stand.jpg",
     "colors": ["#8B5CF6", "#06B6D4"],
     "sizes": ["Small", "Medium", "Large"],
     "materials": ["PLA", "ABS", "PETG"],
     "featured": true
   }
   \`\`\`
3. **Adicionar produtos:** Insira novos objetos no array, mantendo a estrutura acima.
4. **Editar produtos:** Modifique os campos `name`, `description`, `basePrice`, etc.
5. **Imagens:** Coloque arquivos de imagem em `public/` e referencie com `/nome-da-imagem.jpg`.
6. **Categorias disponíveis:** `toys`, `accessories`, `home`, `art`, `prototypes`.
7. Após editar, reinicie o servidor (`pnpm dev`) para ver as mudanças.

**Nota:** Quando o banco de dados (Neon) for ativado, os produtos passam a ser gerenciados pelo
painel administrativo (`/admin/products`) e o arquivo `data/products.json` deixa de ser usado.

## Banco (Neon)
1. Crie uma conta em [neon.tech](https://neon.tech) e um projeto PostgreSQL.
2. Copie a `Connection string` com `?sslmode=require`.
3. Defina `DATABASE_URL` em `.env.local`.
4. Execute, no console SQL do Neon ou via psql, os scripts encontrados em `scripts/`:
   - `001-create-tables.sql`
   - `002-seed-admin.sql` (cria `admin@newprint3d.com` com senha `Admin123!`)
   - `003-seed-products.sql` (opcional)
5. Após ativar o banco, as rotas `/api/products`, `/api/orders` e `/api/admin/stats` deixam de usar
   dados locais e passam a persistir/consultar o Postgres.

## Pagamentos (Stripe)
1. Cadastre-se em [stripe.com](https://stripe.com) e habilite o modo desenvolvedor.
2. Em **Developers → API Keys**, copie as chaves `pk_test_...` e `sk_test_...`.
3. Em **Developers → Webhooks**, crie um endpoint `https://seu-dominio.com/api/webhooks/stripe`
   escutando `payment_intent.succeeded` e `payment_intent.payment_failed`, e copie o `Signing secret`.
4. Configure `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` e `STRIPE_WEBHOOK_SECRET`.
5. Com as chaves presentes, `lib/stripe.ts` deixa de simular intents e passa a usar o SDK oficial.

## Autenticação
O projeto inclui rotas (`/api/auth/login`, `/api/auth/register`, `/api/auth/verify`) e o contexto
`AuthProvider`, mas em modo demo os endpoints retornam `503`. Para ativar:
1. Garanta `DATABASE_URL` funcional e rode os scripts SQL.
2. Defina `JWT_SECRET` com uma chave robusta.
3. Opcionalmente, ajuste o seed de usuários conforme necessidade.
4. Atualize o front-end conforme o fluxo desejado (ex.: tratamento de e-mail de verificação). Sem
   essas variáveis, continue documentando o login como “pronto para integração”.

## Variáveis de Ambiente
| Variável | Obrigatória | Quando usar | Observações |
| --- | --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Recomendado | Todo deploy público | Constrói URLs canônicas e JSON-LD. |
| `DATABASE_URL` | Sim (produção real) | Neon habilitado | Ativa SQL e desliga `isDemoMode`. |
| `JWT_SECRET` | Sim (auth) | Autenticação real | Base para emissão de JWT. |
| `STRIPE_SECRET_KEY` | Sim (pagamentos) | Stripe server-side | Necessária para criar intents. |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Sim (pagamentos) | Stripe client-side | Enviada ao navegador. |
| `STRIPE_WEBHOOK_SECRET` | Sim (pagamentos) | Webhook Stripe | Valida assinaturas de eventos. |

Crie `.env.local`, preencha as variáveis e reinicie o servidor após alterações.

## Deploy (Vercel) e Domínio (Hostinger)
1. Importe o repositório na Vercel e configure o projeto com `pnpm build`.
2. Preencha as variáveis de ambiente nos ambientes **Preview** e **Production**.
3. Faça o primeiro deploy. Em seguida, adicione o domínio customizado.
4. Na Hostinger:
   - Registre um CNAME `www` apontando para `cname.vercel-dns.com`.
   - Defina o registro raiz (`@`) como CNAME para `www`.
   - Aguarde a propagação e conclua a verificação na Vercel.
5. Caso utilize Stripe ou Neon, valide os webhooks e credenciais após o deploy.

## Painel Administrativo
- A rota `/admin` exige um usuário com `role === "admin"`. Sem autenticação real, o `useAuth`
  redireciona para `/`.
- Com banco e auth ativos, o painel passa a listar produtos e estatísticas reais. No modo demo, os
  cards exibem números simulados retornados por `/api/admin/stats` e as ações de escrita permanecem
  bloqueadas.
- As ações de criar, editar e excluir produtos dependem das rotas `/api/products`. Elas retornam `403`
  enquanto `isDemoMode` for verdadeiro.

## Segurança
- [ ] Mantenha `.env.local` fora do controle de versão.
- [ ] Gere `JWT_SECRET` com alta entropia (`openssl rand -base64 32`).
- [ ] Restrinja o acesso ao painel admin via middleware ou edge functions.
- [ ] Ative HTTPS em produção (Vercel já provisiona certificados).
- [ ] Revise permissões de CORS antes de expor APIs públicas.
- [ ] Rotacione as chaves do Stripe e do Neon periodicamente.

## Troubleshooting
- **Erro de conexão com o Neon**: confirme `DATABASE_URL` com `?sslmode=require` e se as tabelas
  foram criadas.
- **Login/cadastro retornam 503**: ocorre quando `DATABASE_URL` está vazio; defina a variável e
  reinicie o servidor.
- **Build falhou**: confirme se todas as páginas que usam APIs do navegador possuem `"use client"` e
  `export const dynamic = "force-dynamic"`; o projeto compila sem warnings no modo demonstração.
- **`EADDRINUSE: 3000` ao executar `pnpm start`**: finalize processos existentes (`lsof -i :3000`)
  ou escolha outra porta (`pnpm start -- --port 3001`).
- **Webhook Stripe retorna 500**: verifique `STRIPE_WEBHOOK_SECRET` e garanta que `stripe` não é
  nulo; em modo demo o webhook permanece inoperante.
