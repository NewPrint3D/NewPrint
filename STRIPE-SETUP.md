# 💳 Guia de Configuração do Stripe - NewPrint3D

**Tempo estimado:** 15 minutos
**Dificuldade:** Fácil
**Custo:** Grátis (modo teste) | 2.9% + $0.30 por transação (modo live)

---

## 📋 Índice

1. [Criar Conta no Stripe](#1-criar-conta-no-stripe)
2. [Obter Chaves de API](#2-obter-chaves-de-api)
3. [Configurar Webhook](#3-configurar-webhook)
4. [Adicionar ao .env](#4-adicionar-ao-env)
5. [Testar Integração](#5-testar-integração)
6. [Ativar Modo Live](#6-ativar-modo-live)

---

## 1. Criar Conta no Stripe

### Passo 1.1: Acessar o Stripe
1. Abra: https://dashboard.stripe.com/register
2. Preencha:
   - Email
   - Nome completo
   - País
   - Senha

### Passo 1.2: Confirmar Email
1. Acesse seu email
2. Clique no link de confirmação do Stripe
3. Complete o perfil da empresa

---

## 2. Obter Chaves de API

### Passo 2.1: Acessar API Keys
1. No dashboard do Stripe, clique em **"Developers"** no menu superior
2. Clique em **"API keys"** no menu lateral
3. Você verá 2 seções:
   - **Test mode** (ambiente de teste)
   - **Live mode** (produção real)

### Passo 2.2: Copiar Chaves de Teste
Para desenvolvimento, use as chaves de **Test mode**:

1. **Publishable key** (chave pública):
   ```
   Começa com: pk_test_...
   ```
   - Clique em **"Reveal test key"**
   - Copie o valor completo

2. **Secret key** (chave secreta):
   ```
   Começa com: sk_test_...
   ```
   - Clique em **"Reveal test key"**
   - Copie o valor completo

⚠️ **IMPORTANTE**: Nunca compartilhe a Secret key publicamente!

---

## 3. Configurar Webhook

### O que é um Webhook?
Webhook permite que o Stripe notifique seu site quando um pagamento é confirmado.

### Passo 3.1: Criar Endpoint do Webhook
1. No dashboard do Stripe, clique em **"Developers"** → **"Webhooks"**
2. Clique em **"Add endpoint"**
3. Em **"Endpoint URL"**, adicione:
   ```
   https://newprint3d.com/api/webhooks/stripe
   ```

   ⚠️ **ATENÇÃO**:
   - Para desenvolvimento local, use: `http://localhost:3000/api/webhooks/stripe`
   - Para produção no Render, use: `https://newprint3d.com/api/webhooks/stripe`

### Passo 3.2: Selecionar Eventos
1. Clique em **"Select events"**
2. Selecione os seguintes eventos:
   - ✅ `payment_intent.succeeded`
   - ✅ `payment_intent.payment_failed`
   - ✅ `checkout.session.completed` (opcional)
   - ✅ `checkout.session.expired` (opcional)

3. Clique em **"Add events"**
4. Clique em **"Add endpoint"**

### Passo 3.3: Copiar Signing Secret
Após criar o webhook:
1. Clique no webhook que você acabou de criar
2. Procure por **"Signing secret"**
3. Clique em **"Reveal"**
4. Copie o valor:
   ```
   Começa com: whsec_...
   ```

---

## 4. Adicionar ao .env

### Passo 4.1: Abrir .env.local
Abra o arquivo `.env.local` na raiz do projeto:

```bash
# No terminal:
nano .env.local
# ou
code .env.local
```

### Passo 4.2: Adicionar Chaves do Stripe

#### Para TESTE (desenvolvimento):
```env
# Stripe Test Mode (desenvolvimento)
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_SECRETA_AQUI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_PUBLICA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SEU_WEBHOOK_SECRET_AQUI
```

#### Para PRODUÇÃO (depois do deploy):
```env
# Stripe Live Mode (produção)
STRIPE_SECRET_KEY=sk_live_SUA_CHAVE_SECRETA_AQUI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_SUA_CHAVE_PUBLICA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SEU_WEBHOOK_SECRET_LIVE_AQUI
```

### Passo 4.3: Salvar e Reiniciar
```bash
# Salvar o arquivo e reiniciar o servidor:
pnpm dev
```

---

## 5. Testar Integração

### Passo 5.1: Testar Localmente
1. Acesse: http://localhost:3000
2. Adicione um produto ao carrinho
3. Vá para Checkout
4. Preencha os dados de envio
5. Use um **cartão de teste do Stripe**:

**Cartões de Teste:**
```
Sucesso:
  Número: 4242 4242 4242 4242
  Validade: 12/34
  CVV: 123

Falha (cartão recusado):
  Número: 4000 0000 0000 0002
  Validade: 12/34
  CVV: 123

3D Secure (requer autenticação):
  Número: 4000 0025 0000 3155
  Validade: 12/34
  CVV: 123
```

### Passo 5.2: Verificar no Dashboard
1. Acesse: https://dashboard.stripe.com/test/payments
2. Você deve ver o pagamento de teste aparecendo
3. Status deve ser **"Succeeded"**

### Passo 5.3: Verificar Webhook
1. Acesse: https://dashboard.stripe.com/test/webhooks
2. Clique no seu webhook
3. Vá para a aba **"Testing"**
4. Você deve ver eventos sendo enviados

---

## 6. Ativar Modo Live (Produção)

⚠️ **ATENÇÃO**: Só ative o modo Live quando:
- Estiver pronto para aceitar pagamentos reais
- Tiver completado o processo de verificação do Stripe
- Estiver em produção (não localhost)

### Passo 6.1: Completar Verificação
1. No dashboard do Stripe, clique em **"Activate account"**
2. Preencha as informações solicitadas:
   - Dados da empresa
   - Dados bancários (para receber pagamentos)
   - Documentos de identificação

### Passo 6.2: Obter Chaves Live
1. No dashboard, mude para **"Live mode"** (toggle no canto superior direito)
2. Vá em **"Developers"** → **"API keys"**
3. Copie as chaves Live:
   - **Publishable key** (`pk_live_...`)
   - **Secret key** (`sk_live_...`)

### Passo 6.3: Criar Webhook Live
1. Vá em **"Developers"** → **"Webhooks"**
2. Certifique-se que está em **Live mode**
3. Adicione endpoint:
   ```
   https://newprint3d.com/api/webhooks/stripe
   ```
4. Selecione os mesmos eventos do teste
5. Copie o **Signing secret** live (`whsec_...`)

### Passo 6.4: Atualizar Variáveis no Render
1. Acesse: https://dashboard.render.com
2. Selecione seu Web Service
3. Vá em **"Environment"**
4. Atualize as 3 variáveis com as chaves LIVE:
   ```
   STRIPE_SECRET_KEY=sk_live_...
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
   STRIPE_WEBHOOK_SECRET=whsec_... (do webhook live)
   ```
5. Clique em **"Save Changes"**
6. Aguarde o redeploy automático

### Passo 6.5: Testar em Produção
1. Acesse: https://newprint3d.com
2. Faça uma compra de teste com cartão real
3. Verifique se o pagamento aparece em https://dashboard.stripe.com/payments

---

## 🎯 Resumo - Checklist Final

```
☐ 1. Criar conta no Stripe
☐ 2. Copiar pk_test_... e sk_test_...
☐ 3. Criar webhook com endpoint /api/webhooks/stripe
☐ 4. Copiar whsec_... do webhook
☐ 5. Adicionar as 3 variáveis no .env.local
☐ 6. Testar com cartão 4242 4242 4242 4242
☐ 7. Verificar pagamento no dashboard do Stripe
☐ 8. Para produção: repetir com chaves Live
```

---

## 📞 Problemas Comuns

### ❌ Erro: "No such payment_intent"
**Solução**: Verifique se o STRIPE_SECRET_KEY está correto e se está usando a chave do ambiente certo (test vs live)

### ❌ Webhook não funciona
**Soluções**:
1. Verifique se a URL do webhook está correta
2. Certifique-se que STRIPE_WEBHOOK_SECRET está no .env
3. Para desenvolvimento local, use Stripe CLI:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```

### ❌ Erro: "Invalid API Key"
**Solução**: A chave secreta deve começar com `sk_test_` ou `sk_live_`. Copie novamente do dashboard.

### ❌ Pagamento aprovado mas pedido não salva
**Solução**: Verifique os logs do webhook em Dashboard → Webhooks → [seu webhook] → Events

---

## 💰 Custos e Taxas

### Modo Teste
- ✅ **Grátis** - ilimitado
- Use para desenvolvimento e testes

### Modo Live (Produção)
**Taxas por transação:**
- Cartão nacional: **2.9% + $0.30**
- Cartão internacional: **3.9% + $0.30**
- Sem mensalidade
- Sem taxas de setup

**Exemplo:**
- Venda de $100 → Você recebe: $96.80
- Taxa: $3.20 (2.9% + $0.30)

---

## 📚 Documentação Oficial

- **Stripe Docs**: https://stripe.com/docs
- **API Reference**: https://stripe.com/docs/api
- **Testing**: https://stripe.com/docs/testing
- **Webhooks**: https://stripe.com/docs/webhooks

---

## ✅ Pronto!

Após seguir este guia, o Stripe estará 100% configurado e funcionando!

**Próximo passo:** Configure o PayPal (ver `PAYPAL-SETUP.md`)

---

<div align="center">

**🎊 Stripe Configurado com Sucesso! 🎊**

Agora você pode aceitar pagamentos com cartão de crédito!

</div>
