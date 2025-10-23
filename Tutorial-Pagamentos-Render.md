# 💰 Tutorial Simples: Stripe, PayPal e Render (Produção)

Este guia ensina **passo a passo** como conectar pagamentos reais usando **Stripe** e **PayPal**, e colocar as chaves dentro do **Render.com**.

---

## 🟦 PARTE 1 – STRIPE (Cartão de Crédito)

### 1️⃣ Criar conta no Stripe
1. Acesse: [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
2. Crie sua conta com **email, nome, país e senha**.
3. Confirme o email e entre no painel.

---

### 2️⃣ Pegar as chaves do Stripe (modo real)
1. Dentro do painel, clique em **Developers → API Keys**.
2. Copie:
   - **Publishable key** (começa com `pk_live_...`)
   - **Secret key** (começa com `sk_live_...`)
3. Guarde essas duas chaves. Você vai colar elas no Render mais tarde.

---

### 3️⃣ Criar o webhook do Stripe
1. Vá em **Developers → Webhooks**.
2. Clique em **Add endpoint**.
3. Em **Endpoint URL**, cole:
   ```
   https://newprint3d.com/api/webhooks/stripe
   ```
4. Clique em **Select events** e marque:
   - payment_intent.succeeded
   - payment_intent.payment_failed
   - checkout.session.completed
   - checkout.session.expired
5. Clique em **Add events → Add endpoint**.
6. Depois clique no webhook criado e copie o **Signing secret** (começa com `whsec_...`).

Agora você tem 3 chaves do Stripe:
```
STRIPE_SECRET_KEY = sk_live_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...
STRIPE_WEBHOOK_SECRET = whsec_...
```

---

## 🟨 PARTE 2 – PAYPAL (Pagamentos com Conta)

### 1️⃣ Criar conta PayPal Business
1. Vá em [https://www.paypal.com/bizsignup/](https://www.paypal.com/bizsignup/)
2. Crie sua conta empresarial (Business).
3. Complete o processo de verificação.

---

### 2️⃣ Criar App e pegar as chaves
1. Acesse: [https://developer.paypal.com/dashboard/](https://developer.paypal.com/dashboard/)
2. Clique em **Apps & Credentials**.
3. Mude para **Live** (no topo da página).
4. Clique em **Create App**.
5. Nomeie como **NewPrint3D Live**.
6. Clique em **Create App**.
7. Copie:
   - **Client ID**
   - **Secret**

Você terá 2 chaves do PayPal:
```
NEXT_PUBLIC_PAYPAL_CLIENT_ID = seu_client_id_live
PAYPAL_CLIENT_SECRET = seu_secret_live
```

---

## 🖥️ PARTE 3 – Render.com (onde o site roda)

Agora você vai colocar **todas as 5 chaves** dentro do Render.

### 1️⃣ Entrar no Render
1. Vá em [https://dashboard.render.com](https://dashboard.render.com)
2. Faça login usando a conta do GitHub.
3. Clique no seu serviço (exemplo: *newprint3d*).

---

### 2️⃣ Abrir a aba de variáveis
1. Clique em **Environment** (ou **Environment Variables**).

---

### 3️⃣ Adicionar as 5 variáveis (uma por vez)

Clique em **Add Environment Variable** e preencha assim:

| Key | Value |
|-----|--------|
| STRIPE_SECRET_KEY | sk_live_... |
| NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY | pk_live_... |
| STRIPE_WEBHOOK_SECRET | whsec_... |
| NEXT_PUBLIC_PAYPAL_CLIENT_ID | seu_client_id_live |
| PAYPAL_CLIENT_SECRET | seu_secret_live |

Depois de preencher todas, clique em **Save Changes**.

---

### 4️⃣ Esperar o deploy
O Render vai reconstruir o site automaticamente.  
Aguarde até o status ficar **Live** ou **Healthy**.

---

## ✅ Checklist Final
☑️ Conta criada no Stripe e PayPal  
☑️ Chaves copiadas (pk_live, sk_live, whsec, client_id, secret)  
☑️ Variáveis adicionadas no Render  
☑️ Site redeployado  
☑️ Pagamento funcionando!

---

Pronto. 
Agora seu site aceita pagamentos reais com **Stripe** e **PayPal**!
