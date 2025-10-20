# 🌐 Guia de Configuração de Domínio Customizado - NewPrint3D

**Domínio desejado:** `newprint3d.com`
**Tempo estimado:** 30 minutos + 24-48h para propagação DNS
**Dificuldade:** Médio
**Custo:** ~$10-15/ano (domínio)

---

## 📋 Índice

1. [Comprar Domínio](#1-comprar-domínio)
2. [Configurar DNS](#2-configurar-dns)
3. [Conectar ao Render](#3-conectar-ao-render)
4. [Configurar SSL/HTTPS](#4-configurar-sslhttps)
5. [Verificar Funcionamento](#5-verificar-funcionamento)
6. [Problemas Comuns](#6-problemas-comuns)

---

## 1. Comprar Domínio

### Opção A: Registradores Recomendados

#### 1.1 Namecheap (Recomendado) ⭐
**Por quê?** Barato, interface simples, WHOIS Privacy grátis

1. Acesse: https://www.namecheap.com
2. Busque por: `newprint3d.com`
3. Se disponível:
   - Preço: ~$8.88/ano (.com)
   - Adicione ao carrinho
   - ✅ Ative "WhoisGuard" (privacidade grátis)
   - Finalize a compra

#### 1.2 Google Domains / Squarespace Domains
**Por quê?** Integração simples, interface limpa

1. Acesse: https://domains.google/ (ou Squarespace)
2. Busque: `newprint3d.com`
3. Preço: ~$12/ano
4. Compre normalmente

#### 1.3 GoDaddy
**Por quê?** Popular, muitas opções

1. Acesse: https://www.godaddy.com
2. Busque: `newprint3d.com`
3. Preço: ~$11.99/ano (primeiro ano pode ter desconto)
4. Compre (cuidado com upsells!)

### Opção B: Domínio Alternativo

Se `newprint3d.com` não estiver disponível:
- `newprint3d.co` (~$12/ano)
- `newprint3d.shop` (~$5/ano primeiro ano)
- `newprint-3d.com` (~$8/ano)
- `newprint3d.store` (~$8/ano)

---

## 2. Configurar DNS

Após comprar o domínio, você precisa configurá-lo para apontar para o Render.

### Passo 2.1: Acessar Painel DNS

#### Se comprou na Namecheap:
1. Login em: https://www.namecheap.com
2. Vá em **"Domain List"**
3. Clique em **"Manage"** ao lado do seu domínio
4. Vá na aba **"Advanced DNS"**

#### Se comprou no Google Domains:
1. Login em: https://domains.google/
2. Clique no domínio
3. Vá em **"DNS"** no menu lateral

#### Se comprou no GoDaddy:
1. Login em: https://www.godaddy.com/
2. Vá em **"My Products"**
3. Clique em **"DNS"** ao lado do domínio

### Passo 2.2: Obter IP do Render
1. Acesse: https://dashboard.render.com
2. Clique no seu Web Service
3. Vá em **"Settings"**
4. Procure por **"Custom Domains"**
5. Clique em **"Add Custom Domain"**
6. Digite: `newprint3d.com`
7. O Render vai mostrar instruções com IPs

### Passo 2.3: Adicionar Registros DNS

Você precisa adicionar 2 registros:

#### Registro 1: Domínio principal (A Record)
```
Type: A
Host: @
Value: [IP fornecido pelo Render]
TTL: Automatic ou 3600
```

**Exemplo:**
```
Type: A
Host: @
Value: 216.24.57.1
TTL: 3600
```

#### Registro 2: Subdomínio www (CNAME)
```
Type: CNAME
Host: www
Value: [endereço fornecido pelo Render]
TTL: Automatic ou 3600
```

**Exemplo:**
```
Type: CNAME
Host: www
Value: newprint3d.onrender.com
TTL: 3600
```

### Passo 2.4: Salvar Alterações
1. Clique em **"Save All Changes"** ou equivalente
2. Aguarde alguns minutos

⚠️ **IMPORTANTE**: A propagação DNS pode levar de 1 hora até 48 horas!

---

## 3. Conectar ao Render

### Passo 3.1: Adicionar Domínio no Render
1. Acesse: https://dashboard.render.com
2. Selecione seu Web Service
3. Vá em **"Settings"** → **"Custom Domains"**
4. Clique em **"Add Custom Domain"**
5. Digite: `newprint3d.com`
6. Clique em **"Add"**

### Passo 3.2: Adicionar www também
Repita o processo para:
```
www.newprint3d.com
```

Isso garante que ambos funcionem:
- `newprint3d.com` ✅
- `www.newprint3d.com` ✅

### Passo 3.3: Aguardar Verificação
O Render irá:
1. Verificar os registros DNS
2. Emitir certificado SSL automaticamente
3. Ativar HTTPS

Status esperado:
```
newprint3d.com
Status: ✅ Verified
SSL: ✅ Active

www.newprint3d.com
Status: ✅ Verified
SSL: ✅ Active
```

⏳ **Tempo**: 5-10 minutos após DNS propagar

---

## 4. Configurar SSL/HTTPS

### Passo 4.1: Certificado Automático
O Render configura SSL automaticamente! Você não precisa fazer nada.

Após alguns minutos:
- ✅ `https://newprint3d.com` funcionará
- ✅ `https://www.newprint3d.com` funcionará
- ✅ Certificado Let's Encrypt grátis
- ✅ Renovação automática

### Passo 4.2: Forçar HTTPS
Isso já está configurado no código (`next.config.mjs`):
```javascript
headers: [
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  }
]
```

Isso força todos os acessos a usarem HTTPS.

---

## 5. Verificar Funcionamento

### Passo 5.1: Testar Domínio
Após a propagação DNS (1-48h), teste:

```bash
# Verificar se DNS está apontando corretamente:
ping newprint3d.com

# Deve retornar o IP do Render (ex: 216.24.57.1)
```

Ou use: https://dnschecker.org/
- Digite: `newprint3d.com`
- Verifique se aponta para o IP do Render em várias localizações

### Passo 5.2: Testar HTTPS
Abra no navegador:
1. https://newprint3d.com
2. https://www.newprint3d.com

Ambos devem:
- ✅ Carregar o site
- ✅ Mostrar cadeado verde/seguro
- ✅ Certificado SSL válido

### Passo 5.3: Testar Funcionalidades
1. Trocar idiomas (EN, PT, ES)
2. Adicionar produto ao carrinho
3. Fazer checkout
4. Login admin: `admin@newprint3d.com` / `Admin123!`

---

## 6. Problemas Comuns

### ❌ Erro: "DNS_PROBE_FINISHED_NXDOMAIN"
**Causa**: DNS ainda não propagou ou registro errado

**Soluções**:
1. Aguarde mais tempo (até 48h)
2. Verifique se adicionou registros A e CNAME corretamente
3. Use https://dnschecker.org/ para verificar propagação global
4. Limpe cache DNS:
   ```bash
   # Windows
   ipconfig /flushdns

   # Mac/Linux
   sudo killall -HUP mDNSResponder
   ```

### ❌ Erro: "Site não seguro" / Certificado inválido
**Causa**: SSL ainda não foi emitido pelo Render

**Soluções**:
1. Aguarde 5-10 minutos após DNS verificado
2. No Render, vá em Settings → Custom Domains
3. Clique em "Renew Certificate" se disponível
4. Verifique se domínio está "Verified"

### ❌ www funciona mas domínio raiz não (ou vice-versa)
**Causa**: Faltou adicionar um dos registros DNS

**Solução**:
1. Verifique se adicionou AMBOS:
   - Registro A para `@` (domínio raiz)
   - Registro CNAME para `www`
2. Verifique se adicionou AMBOS no Render também

### ❌ Domínio funciona mas site mostra erro 404
**Causa**: Variável de ambiente `NEXT_PUBLIC_SITE_URL` incorreta

**Solução**:
1. No Render, vá em Environment
2. Verifique se `NEXT_PUBLIC_SITE_URL=https://newprint3d.com`
3. Se estiver diferente, atualize
4. Aguarde redeploy

### ❌ DNS não propaga
**Soluções**:
1. Verifique se salvou as alterações no painel DNS
2. Alguns provedores têm propagação lenta
3. Use DNS público para testar:
   ```
   Google DNS: 8.8.8.8 e 8.8.4.4
   Cloudflare DNS: 1.1.1.1 e 1.0.0.1
   ```

---

## 🎯 Resumo - Checklist Final

```
☐ 1. Comprar domínio newprint3d.com
☐ 2. Acessar painel DNS do registrador
☐ 3. Adicionar registro A (@) apontando para IP do Render
☐ 4. Adicionar registro CNAME (www) apontando para Render
☐ 5. Salvar alterações DNS
☐ 6. No Render, adicionar newprint3d.com em Custom Domains
☐ 7. No Render, adicionar www.newprint3d.com também
☐ 8. Aguardar verificação DNS (1-48h)
☐ 9. Aguardar emissão SSL (5-10 min após DNS)
☐ 10. Testar https://newprint3d.com
☐ 11. Testar https://www.newprint3d.com
☐ 12. Verificar certificado SSL (cadeado verde)
```

---

## 💰 Custos

### Domínio
- **Primeiro ano**: $5-15 (depende do TLD e promoções)
- **Renovação**: $8-15/ano
- **.com** (recomendado): ~$8-12/ano

### SSL Certificate
- ✅ **Grátis** no Render (Let's Encrypt)
- Renovação automática

### Hosting
- ✅ **Grátis** (Free tier do Render)
- Ou $7/mês (plano pago)

**Total:** ~$8-15/ano apenas pelo domínio! 🎉

---

## 🚀 Após Configurar o Domínio

### Atualizar Variáveis de Ambiente
No Render, certifique-se que:
```env
NEXT_PUBLIC_SITE_URL=https://newprint3d.com
NODE_ENV=production
```

### Atualizar Webhooks
Se configurou Stripe ou PayPal:
1. **Stripe**: Atualize webhook URL para `https://newprint3d.com/api/webhooks/stripe`
2. **PayPal**: Não precisa mudar (usa Client ID)

### Atualizar SEO
O site já está configurado para usar `NEXT_PUBLIC_SITE_URL`:
- ✅ Sitemap: `https://newprint3d.com/sitemap.xml`
- ✅ Robots.txt: `https://newprint3d.com/robots.txt`
- ✅ Meta tags: Já usa o domínio correto

---

## 📚 Recursos Úteis

**Verificar DNS:**
- https://dnschecker.org/
- https://www.whatsmydns.net/

**Verificar SSL:**
- https://www.ssllabs.com/ssltest/

**Documentação Render:**
- https://render.com/docs/custom-domains

**Propagação DNS:**
- Normalmente: 1-2 horas
- Máximo: 48 horas
- Depende do TTL configurado

---

## ✅ Pronto!

Após seguir este guia, seu site estará acessível em:
- ✅ `https://newprint3d.com`
- ✅ `https://www.newprint3d.com`

Com certificado SSL válido e configuração profissional!

**Próximo passo:** Revisar o documento de entrega ao cliente

---

<div align="center">

**🎊 Domínio Configurado com Sucesso! 🎊**

Seu site está no ar com domínio profissional!

</div>
