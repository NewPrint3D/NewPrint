# 🧩 NewPrint3D – Plataforma de Impressão e Produtos 3D

**Site oficial:** [https://newprint3d.com](https://newprint3d.com)

---

## 🎯 Visão Geral

A **NewPrint3D** é uma plataforma moderna de **e-commerce especializada em impressões 3D e produtos personalizados**.  
Ela foi desenvolvida para oferecer ao cliente final uma experiência simples, rápida e segura para realizar pedidos e pagamentos online.

O sistema permite que o usuário:
- Escolha entre produtos e modelos 3D disponíveis;
- Personalize características de impressão (como cor, tamanho e material);
- Finalize o pedido com pagamento seguro via **cartão (Stripe)** ou **PayPal**;
- Acompanhe o status da compra e histórico de pedidos.

---

## 🖥️ Como Acessar

🌐 **Endereço:**  
[https://newprint3d.com](https://newprint3d.com)

📱 Compatível com todos os dispositivos (computador, celular e tablet).

---

## 💳 Pagamentos

A plataforma aceita **dois meios de pagamento principais**:

| Método | Descrição | Segurança |
|---------|------------|------------|
| **Stripe** | Pagamentos diretos com cartão de crédito/débito. | Criptografia ponta a ponta. |
| **PayPal** | Pagamento com conta PayPal ou cartão vinculado. | Proteção total ao comprador. |

> 🧠 Dica: Para saber como configurar as chaves e conectar Stripe e PayPal em produção, consulte o arquivo **`Tutorial-Pagamentos-Render.md`** que acompanha este projeto.

---

## 🛠️ Painel Administrativo

O painel foi desenvolvido para permitir **gestão completa da loja**, incluindo:

- 🧾 **Gerenciamento de pedidos:** visualizar, atualizar e confirmar pagamentos.  
- 🧍‍♂️ **Controle de clientes:** informações e histórico de compras.  
- 📦 **Catálogo de produtos:** adicionar, editar ou remover modelos e itens disponíveis.  
- 🧮 **Relatórios e estatísticas:** acompanhar vendas e desempenho em tempo real.

---

## ⚙️ Infraestrutura

O site está hospedado na **Render.com**, com deploy contínuo e ambiente otimizado para alto desempenho.

### Tecnologias principais
- **Frontend:** Next.js (React)  
- **Backend:** API integrada (Node.js / FastAPI)  
- **Banco de Dados:** PostgreSQL  
- **Hospedagem:** Render (com SSL e domínio customizado)  
- **Pagamentos:** Stripe + PayPal

---

## 📦 Atualizações e Manutenção

A NewPrint3D é atualizada periodicamente para garantir:
- Melhoria na performance e estabilidade do sistema  
- Novas funcionalidades no painel  
- Correções de segurança e compatibilidade

> 💡 Recomenda-se não alterar manualmente arquivos do servidor de produção sem suporte técnico.

---

## 🔐 Segurança e Privacidade

- Todas as transações são protegidas por SSL (HTTPS).  
- Nenhum dado sensível é armazenado localmente.  
- As chaves do Stripe e PayPal são gerenciadas por variáveis seguras na infraestrutura Render.

---

## 🧾 Documentos Relevantes

- 📘 **Tutorial-Pagamentos-Render.md** – passo a passo para configuração de pagamentos e variáveis.  
- 📄 **DOMAIN-SETUP.md** – instruções para configuração de domínio customizado.  
- 📋 **ENTREGA-CLIENTE.md** – documento de entrega formal do projeto.

---

> 🔧 Qualquer atualização técnica ou modificação futura deve seguir o padrão descrito neste README e no tutorial de pagamentos.

---

**© 2025 NewPrint3D – Todos os direitos reservados.**  
