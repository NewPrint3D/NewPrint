# 🌐 Guia de Configuração do Domínio – NewPrint3D

**Domínio oficial:** [https://newprint3d.com](https://newprint3d.com)  
**Hospedagem:** Render.com  
**Gerenciamento DNS:** Cloudflare (ou provedor do cliente)

---

## 🧭 1. Objetivo

Este guia explica **como conectar o domínio personalizado (newprint3d.com)** à hospedagem do projeto na **Render.com**.  
É simples e pode ser feito mesmo por quem **nunca configurou DNS antes**.

---

## ⚙️ 2. Passo a Passo Completo

### Passo 1️⃣ – Entrar na conta do domínio
1. Vá até o site onde você comprou o domínio (ex: Registro.br, GoDaddy, Hostinger ou Cloudflare).  
2. Faça login na sua conta.  
3. Localize o domínio **newprint3d.com**.  
4. Encontre a seção chamada **DNS**, **Registros DNS** ou **Zone Editor**.

---

### Passo 2️⃣ – Criar registros A e CNAME
Na área de DNS, adicione **dois registros**:

#### Registro A
| Tipo | Nome | Valor (IP)  | TTL |
|------|------|-------------|-----|
| A    |   @  | 216.24.57.1 | Auto|

#### Registro CNAME
| Tipo | Nome |          Valor          | TTL |
|------|------|-------------------------|-----|
| CNAME| www  | newprint3d.onrender.com | Auto|

> 💡 Dica: “@” representa o domínio principal (newprint3d.com).  
> O CNAME “www” garante que quem digitar “www.newprint3d.com” também vá para o mesmo site.

---

### Passo 3️⃣ – Ativar HTTPS automático
O Render cuida disso automaticamente.

1. Acesse o painel: [https://dashboard.render.com](https://dashboard.render.com)  
2. Clique no serviço **newprint3d**  
3. Vá em **Settings → Custom Domains**  
4. Confirme que o domínio aparece como **“Verified”**  
5. O Render instalará o **SSL (HTTPS)** automaticamente

> 🔒 Se o status estiver “Pending”, aguarde até 30 minutos.  
> Caso não valide, verifique se os registros DNS foram salvos corretamente.

---

### Passo 4️⃣ – Testar o domínio
1. Acesse: [https://newprint3d.com](https://newprint3d.com)  
2. O site deve abrir com cadeado de segurança (🔒) no navegador.  
3. Também deve funcionar com “www.newprint3d.com”.

---

## 🧰 3. Dúvidas Comuns

| Problema | Solução |
|-----------|----------|
| ❌ O domínio não abre | Espere até 24h (propagação DNS) |
| ⚠️ SSL não aparece | Verifique se o domínio foi validado no Render |
| 🌐 “www” funciona mas o principal não | Confirme o registro A com o IP correto |
| 🔄 Fiz tudo certo mas ainda não abre | Limpe o cache do navegador ou use modo anônimo |

---

## ✅ 5. Conclusão

Após seguir este guia, o domínio **newprint3d.com** estará totalmente conectado ao servidor Render com **SSL e HTTPS ativos**.

**Arquivos relacionados:**
- `Tutorial-Pagamentos-Render.md`
- `README-NewPrint3D.md`
- `ENTREGA-CLIENTE.md`

---

**© 2025 NewPrint3D – Todos os direitos reservados.**
