# 💙 Guia de Configuração do PayPal - NewPrint3D

**Tempo estimado:** 15 minutos
**Dificuldade:** Fácil
**Custo:** Grátis (modo sandbox) | 2.99% + $0.49 por transação (modo live)

---

## 📋 Índice

1. [Criar Conta PayPal Developer](#1-criar-conta-paypal-developer)
2. [Criar App e Obter Credenciais](#2-criar-app-e-obter-credenciais)
3. [Configurar Sandbox para Testes](#3-configurar-sandbox-para-testes)
4. [Adicionar ao .env](#4-adicionar-ao-env)
5. [Testar Integração](#5-testar-integração)
6. [Ativar Modo Live](#6-ativar-modo-live)

---

## 1. Criar Conta PayPal Developer

### Passo 1.1: Acessar Developer Portal
1. Abra: https://developer.paypal.com/
2. Clique em **"Log In"** no canto superior direito
3. Faça login com sua conta PayPal pessoal
   - Se não tiver, crie em: https://www.paypal.com/signup

### Passo 1.2: Acessar Dashboard
1. Após o login, clique em **"Dashboard"** no menu superior
2. Você será redirecionado para: https://developer.paypal.com/dashboard/

---

## 2. Criar App e Obter Credenciais

### Passo 2.1: Criar Novo App
1. No Dashboard, clique em **"Apps & Credentials"** no menu lateral
2. Certifique-se que está em **"Sandbox"** (toggle no topo da página)
3. Clique no botão **"Create App"**

### Passo 2.2: Configurar App
1. Preencha os campos:
   - **App Name**: `NewPrint3D Sandbox`
   - **App Type**: Merchant
   - **Sandbox Business Account**: Selecione uma conta ou crie uma nova

2. Clique em **"Create App"**

### Passo 2.3: Copiar Credenciais SANDBOX
Após criar o app, você verá:

1. **Client ID** (Sandbox):
   ```
   Começa com: (string longa aleatória)
   Exemplo: AeR5V...xYz123
   ```
   - Copie o valor completo

2. **Secret** (Sandbox):
   - Clique em **"Show"** abaixo de "Secret"
   - Copie o valor completo
   ```
   Começa com: (string longa aleatória)
   Exemplo: EKp8M...abc789
   ```

⚠️ **IMPORTANTE**: Nunca compartilhe o Secret publicamente!

---

## 3. Configurar Sandbox para Testes

### Passo 3.1: Criar Contas de Teste
O PayPal cria automaticamente 2 contas sandbox:
- **Business Account** (vendedor - você)
- **Personal Account** (comprador - para testar)

Para ver/criar mais contas:
1. Vá em **"Sandbox"** → **"Accounts"**
2. Você verá as contas de teste listadas

### Passo 3.2: Ver Credenciais das Contas de Teste
1. Clique nos **"..."** ao lado de uma conta
2. Clique em **"View/Edit Account"**
3. Você verá:
   - Email da conta
   - Senha
   - Saldo (dinheiro fictício)

**Exemplo de conta comprador:**
```
Email: sb-buyer@business.example.com
Senha: (gerada automaticamente)
Saldo: $5,000 (fictício)
```

---

## 4. Adicionar ao .env

### Passo 4.1: Abrir .env.local
```bash
# No terminal:
nano .env.local
# ou
code .env.local
```

### Passo 4.2: Adicionar Credenciais do PayPal

#### Para SANDBOX (desenvolvimento):
```env
# PayPal Sandbox (desenvolvimento/testes)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=SEU_CLIENT_ID_SANDBOX_AQUI
PAYPAL_CLIENT_SECRET=SEU_SECRET_SANDBOX_AQUI
```

#### Para LIVE (produção - depois):
```env
# PayPal Live (produção)
NEXT_PUBLIC_PAYPAL_CLIENT_ID=SEU_CLIENT_ID_LIVE_AQUI
PAYPAL_CLIENT_SECRET=SEU_SECRET_LIVE_AQUI
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
5. Clique no botão **"PayPal"**
6. Uma janela popup do PayPal deve aparecer

### Passo 5.2: Login com Conta Sandbox
Na janela do PayPal:
1. Use uma conta **Personal (Buyer)** do Sandbox
2. Encontre as credenciais em: https://developer.paypal.com/dashboard/accounts
3. Clique em **"..."** → **"View/Edit Account"**
4. Copie o email e senha
5. Faça login na janela popup

### Passo 5.3: Completar Pagamento de Teste
1. Revise o pedido
2. Clique em **"Pay Now"**
3. O pagamento será processado (dinheiro fictício)
4. Você será redirecionado de volta ao site

### Passo 5.4: Verificar no Dashboard
1. Acesse: https://developer.paypal.com/dashboard/
2. Vá em **"Sandbox"** → **"Accounts"**
3. Clique na conta **Business (vendedor)**
4. Veja o saldo - deve ter aumentado com o pagamento de teste

---

## 6. Ativar Modo Live (Produção)

⚠️ **ATENÇÃO**: Só ative o modo Live quando:
- Estiver pronto para aceitar pagamentos reais
- Tiver uma conta PayPal Business verificada
- Estiver em produção (não localhost)

### Passo 6.1: Criar Conta PayPal Business
1. Acesse: https://www.paypal.com/bizsignup/
2. Crie uma conta Business (se ainda não tiver)
3. Complete o processo de verificação:
   - Dados da empresa
   - Dados bancários
   - Documentos de identificação

### Passo 6.2: Criar App Live
1. No Developer Dashboard: https://developer.paypal.com/dashboard/
2. Mude para **"Live"** (toggle no topo da página)
3. Clique em **"Create App"**
4. Preencha:
   - **App Name**: `NewPrint3D Live`
   - **App Type**: Merchant
5. Clique em **"Create App"**

### Passo 6.3: Copiar Credenciais LIVE
1. **Client ID** (Live):
   - Copie o valor completo
   ```
   Começa com: (string longa)
   ```

2. **Secret** (Live):
   - Clique em **"Show"**
   - Copie o valor completo

### Passo 6.4: Atualizar Variáveis no Render
1. Acesse: https://dashboard.render.com
2. Selecione seu Web Service
3. Vá em **"Environment"**
4. Atualize as 2 variáveis com as credenciais LIVE:
   ```
   NEXT_PUBLIC_PAYPAL_CLIENT_ID=seu_client_id_live
   PAYPAL_CLIENT_SECRET=seu_secret_live
   ```
5. Clique em **"Save Changes"**
6. Aguarde o redeploy automático

### Passo 6.5: Testar em Produção
1. Acesse: https://newprint3d.com
2. Faça uma compra de teste com conta PayPal real
3. Verifique se o pagamento aparece na sua conta Business

---

## 🎯 Resumo - Checklist Final

```
☐ 1. Criar conta PayPal Developer
☐ 2. Criar App no modo Sandbox
☐ 3. Copiar Client ID (sandbox)
☐ 4. Copiar Secret (sandbox)
☐ 5. Adicionar as 2 variáveis no .env.local
☐ 6. Testar com conta Personal sandbox
☐ 7. Verificar pagamento no Dashboard Sandbox
☐ 8. Para produção: criar App Live
☐ 9. Para produção: copiar credenciais Live
☐ 10. Para produção: atualizar variáveis no Render
```

---

## 📞 Problemas Comuns

### ❌ Botão PayPal não aparece
**Soluções**:
1. Verifique se `NEXT_PUBLIC_PAYPAL_CLIENT_ID` está no .env
2. Abra o console do navegador (F12) para ver erros
3. Certifique-se que reiniciou o servidor após adicionar as variáveis

### ❌ Erro: "Invalid Client ID"
**Solução**: Copie novamente o Client ID do Dashboard do PayPal

### ❌ Popup do PayPal não abre
**Soluções**:
1. Desative bloqueadores de popup
2. Certifique-se que está usando HTTPS em produção
3. Verifique se o domínio está correto

### ❌ Pagamento aprovado mas pedido não salva
**Solução**: Verifique se `PAYPAL_CLIENT_SECRET` está correto no .env

### ❌ Erro 401 Unauthorized
**Solução**:
1. Verifique se Client ID e Secret são do mesmo ambiente (Sandbox ou Live)
2. Certifique-se que não há espaços extras ao copiar as credenciais

---

## 💰 Custos e Taxas

### Modo Sandbox
- ✅ **Grátis** - ilimitado
- Dinheiro fictício
- Use para desenvolvimento e testes

### Modo Live (Produção)
**Taxas por transação:**
- Vendas nacionais: **2.99% + $0.49**
- Vendas internacionais: **4.49% + valor fixo** (varia por país)
- Sem mensalidade
- Sem taxas de setup

**Exemplo:**
- Venda de $100 → Você recebe: $96.52
- Taxa: $3.48 (2.99% + $0.49)

### Saque para Conta Bancária
- Grátis para saques acima de $1
- Processamento: 1-3 dias úteis

---

## 🔄 Diferenças entre Sandbox e Live

| Característica | Sandbox | Live |
|----------------|---------|------|
| **Ambiente** | Teste | Produção |
| **Dinheiro** | Fictício | Real |
| **Client ID** | Diferente | Diferente |
| **Secret** | Diferente | Diferente |
| **URL API** | api-m.sandbox.paypal.com | api-m.paypal.com |
| **Contas** | Contas de teste | Contas reais |

---

## 🌍 Suporte a Idiomas

O PayPal detecta automaticamente o idioma do navegador.

Para forçar um idioma específico, edite:
`components/paypal-button.tsx` linha 52:

```typescript
// Inglês
script.src = `...&locale=en_US`

// Português
script.src = `...&locale=pt_BR`

// Espanhol
script.src = `...&locale=es_ES`
```

---

## 📚 Documentação Oficial

- **PayPal Developer**: https://developer.paypal.com/
- **API Reference**: https://developer.paypal.com/api/rest/
- **Sandbox Testing**: https://developer.paypal.com/tools/sandbox/
- **Integration Guide**: https://developer.paypal.com/docs/checkout/

---

## 🆚 PayPal vs Stripe

| Aspecto | PayPal | Stripe |
|---------|--------|--------|
| **Reconhecimento** | 🟢 Muito alto | 🟡 Alto |
| **Facilidade** | 🟢 Mais fácil | 🟡 Médio |
| **Taxas** | 🟡 2.99% + $0.49 | 🟢 2.9% + $0.30 |
| **Métodos** | PayPal + Cartão | Cartão |
| **Checkout** | Popup/Redirect | Inline |
| **Confiança do Cliente** | 🟢 Muito alta | 🟢 Alta |

**Recomendação**: Use AMBOS para maximizar conversões!

---

## ✅ Pronto!

Após seguir este guia, o PayPal estará 100% configurado e funcionando!

**Próximo passo:** Configure o domínio customizado (ver `DOMAIN-SETUP.md`)

---

<div align="center">

**🎊 PayPal Configurado com Sucesso! 🎊**

Agora você pode aceitar pagamentos via PayPal!

</div>
