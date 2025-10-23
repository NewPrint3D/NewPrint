# Checklist de Correção - Textos Não Traduzidos

## Prioridade 1: CRÍTICA

### [ ] /app/profile/page.tsx - 24+ strings
**Arquivo:** `/home/devopssamuel/newprint3d/app/profile/page.tsx`
**Linhas:** 176-379

**Strings a traduzir:**
- [ ] Linha 176: `"Profile Settings"`
- [ ] Linha 177: `"Manage your account settings and preferences"`
- [ ] Linha 184: `"Account Info"`
- [ ] Linha 188: `"Change Password"`
- [ ] Linha 192: `"Change Email"`
- [ ] Linha 199: `"Account Information"`
- [ ] Linha 200: `"Your account details"`
- [ ] Linha 205: `"First Name"`
- [ ] Linha 209: `"Last Name"`
- [ ] Linha 214: `"Email"`
- [ ] Linha 218: `"Role"`
- [ ] Linha 222: `"Member Since"`
- [ ] Linha 234: `"Change Password"`
- [ ] Linha 235-237: `"Password must be at least 12 characters..."`
- [ ] Linha 257: `"Current Password"`
- [ ] Linha 270: `"New Password"`
- [ ] Linha 283: `"Confirm New Password"`
- [ ] Linha 299: `"Updating..."`
- [ ] Linha 302: `"Update Password"`
- [ ] Linha 76: `"New passwords do not match"`
- [ ] Linha 81: `"Password must be at least 12 characters long"`
- [ ] Linha 105: `"Password updated successfully!"`
- [ ] Linha 112: `"Failed to update password"`
- [ ] Linha 115: `"Network error"`

**Ação:** Criar seção `profile` em `lib/i18n.ts` com todas essas chaves

---

### [ ] /components/custom-projects-section.tsx - 13+ strings
**Arquivo:** `/home/devopssamuel/newprint3d/components/custom-projects-section.tsx`
**Linhas:** 29-252

**Strings a traduzir:**
- [ ] Linha 29: `"Mensagem enviada!"` (toast title)
- [ ] Linha 30: `"Entraremos em contato em breve."` (toast description)
- [ ] Linha 86: `"Projetos Personalizados"` (feature title)
- [ ] Linha 87: `"Transformamos sua ideia em realidade"` (feature description)
- [ ] Linha 91: `"Peças de Reposição"` (feature title)
- [ ] Linha 92: `"Aquela pecinha de plástico que quebrou? Fabricamos para você!"` (feature description)
- [ ] Linha 96: `"Protótipos"` (feature title)
- [ ] Linha 97: `"Do conceito ao produto final"` (feature description)
- [ ] Linha 107: `"Projetos Personalizados"` (section title)
- [ ] Linha 109-110: `"Seu carro ou bem quebrou aquela pecinha..."` (section description)
- [ ] Linha 139: `"Solicite seu Projeto"` (card title)
- [ ] Linha 144: `"Nome"` (label)
- [ ] Linha 156: `"Email"` (label)
- [ ] Linha 168: `"Telefone"` (label)
- [ ] Linha 180: `"Detalhes do Projeto"` (label)
- [ ] Linha 187: `"Descreva seu projeto ou a peça que precisa..."` (placeholder)
- [ ] Linha 193: `"Enviar Foto ou Arquivo"` (label)
- [ ] Linha 218: `"Arraste e solte seu arquivo aqui"` (text)
- [ ] Linha 219: `"ou clique para selecionar"` (text)
- [ ] Linha 221: `"Aceita imagens, arquivos STL ou OBJ"` (text)
- [ ] Linha 252: `"Enviar Solicitação"` (button text)

**Ação:** Criar seção `customProjects` em `lib/i18n.ts` com todas essas chaves

---

### [ ] /components/product-categories.tsx - 8 strings
**Arquivo:** `/home/devopssamuel/newprint3d/components/product-categories.tsx`
**Linhas:** 11-51

**Strings a traduzir:**
- [ ] Linha 11: `"Decoração para o Lar"` (category title)
- [ ] Linha 12: `"Vasos, luminárias, porta-objetos e muito mais"` (description)
- [ ] Linha 19: `"Brinquedos"` (category title)
- [ ] Linha 20: `"Diversão criativa e educativa para todas as idades"` (description)
- [ ] Linha 27: `"Objetos Sensoriais"` (category title)
- [ ] Linha 28: `"Estímulo tátil e desenvolvimento cognitivo"` (description)
- [ ] Linha 35: `"Materiais Biodegradáveis"` (category title)
- [ ] Linha 36: `"Sustentabilidade em cada impressão"` (description)
- [ ] Linha 49: `"Nossas Categorias"` (section title)
- [ ] Linha 51: `"Produtos sustentáveis feitos com materiais biodegradáveis"` (description)

**Ação:** Criar seção `categories` em `lib/i18n.ts`

---

## Prioridade 2: ALTA

### [ ] /components/hero-section.tsx - 6 strings
**Arquivo:** `/home/devopssamuel/newprint3d/components/hero-section.tsx`
**Linhas:** 100, 105-139

**Strings a traduzir:**
- [ ] Linha 100: `"Produtos Prontos para Entrega"` (badge text)
- [ ] Linha 105: `"Impressão 3D de"` (h1 partial)
- [ ] Linha 109: `"Alta Qualidade"` (h1 partial)
- [ ] Linha 114: `"Produtos exclusivos e personalizados com materiais biodegradáveis. Do decorativo ao funcional."` (description)
- [ ] Linha 125: `"Ver Produtos"` (button text)
- [ ] Linha 139: `"Projetos Personalizados"` (button text)

**Ação:** Adicionar a seção `heroSection` em `lib/i18n.ts`

---

### [ ] /components/navbar.tsx - 2 strings
**Arquivo:** `/home/devopssamuel/newprint3d/components/navbar.tsx`
**Linhas:** 89, 196

**Strings a traduzir:**
- [ ] Linha 89: `"Projetos Personalizados"` (button text)
- [ ] Linha 196: `"Projetos Personalizados"` (button text - mobile)

**Ação:** Usar `t.navbar.customProjects` (ou similar) em `lib/i18n.ts`

---

### [ ] /components/footer.tsx - 4 strings
**Arquivo:** `/home/devopssamuel/newprint3d/components/footer.tsx`
**Linhas:** 113-117

**Strings a traduzir:**
- [ ] Linha 113: `"contact@newprint3d.com"` (hardcoded email)
- [ ] Linha 115: `"+1 (555) 123-4567"` (hardcoded phone)
- [ ] Linha 116: `"123 Print Street"` (hardcoded address)
- [ ] Linha 117: `"Tech City, TC 12345"` (hardcoded city)

**Ação:** Adicionar a seção `footerContact` em `lib/i18n.ts` ou usar chaves existentes

---

## Prioridade 3: MÉDIA

### [ ] /app/layout.tsx - Metadados de SEO
**Arquivo:** `/home/devopssamuel/newprint3d/app/layout.tsx`
**Linhas:** 15-45

**Problema:** Metadados estão hardcoded em inglês apenas
**Strings a considerar:**
- [ ] Linha 16: `"NewPrint3D - Custom 3D Printing Services"` (title)
- [ ] Linha 19: `"Premium 3D printing with full customization..."` (description)
- [ ] Linha 20: `["3D printing", "custom printing", ...]` (keywords)
- [ ] Linhas 32-34: OpenGraph metadata em inglês

**Ação:** Criar função para gerar metadados dinâmicos por idioma

---

### [ ] /components/language-switcher.tsx - 1 string
**Arquivo:** `/home/devopssamuel/newprint3d/components/language-switcher.tsx`
**Linha:** 17

**String a traduzir:**
- [ ] Linha 17: `"Switch language"` (sr-only text)

**Ação:** Adicionar `t.common.switchLanguage` em `lib/i18n.ts`

---

## Ordem de Implementação Recomendada

### Fase 1 (2 horas): Adicionar Traduções
1. Abrir `/lib/i18n.ts`
2. Adicionar seções após linha 351 (antes de `}`):
   ```typescript
   customProject: { ... },
   profile: { ... },
   categories: { ... },
   heroSection: { ... },
   navbar: { customProjects: "..." },
   footer: { contact: { ... } },
   ```
3. Traduzir para 3 idiomas (en, pt, es)

### Fase 2 (1-2 horas): Refatorar Componentes
1. `/components/product-categories.tsx` - usar `t.categories.*`
2. `/components/custom-projects-section.tsx` - usar `t.customProject.*`
3. `/components/hero-section.tsx` - usar `t.heroSection.*`
4. `/components/navbar.tsx` - usar `t.navbar.customProjects`
5. `/components/footer.tsx` - usar `t.footer.contact.*`
6. `/app/profile/page.tsx` - usar `t.profile.*`

### Fase 3 (1-2 horas): Melhorias
1. Atualizar `/app/layout.tsx` com metadados dinâmicos
2. Atualizar `/components/language-switcher.tsx`
3. Testes de todas as traduções

---

## Template para Adicionar em i18n.ts

```typescript
// Adicionar após linha 351 em lib/i18n.ts

customProject: {
  title: "Projetos Personalizados",
  subtitle: "Seu carro ou bem quebrou aquela pecinha...",
  submitSuccess: "Mensagem enviada!",
  submitDescription: "Entraremos em contato em breve.",
  formTitle: "Solicite seu Projeto",
  labels: {
    name: "Nome",
    email: "Email",
    phone: "Telefone",
    projectDetails: "Detalhes do Projeto",
    fileUpload: "Enviar Foto ou Arquivo",
  },
  placeholders: {
    projectDescription: "Descreva seu projeto ou a peça que precisa...",
    dragDrop: "Arraste e solte seu arquivo aqui",
    clickSelect: "ou clique para selecionar",
    acceptedFiles: "Aceita imagens, arquivos STL ou OBJ",
  },
  features: {
    title: "Projetos Personalizados",
    items: [
      {
        title: "Projetos Personalizados",
        description: "Transformamos sua ideia em realidade",
      },
      {
        title: "Peças de Reposição",
        description: "Aquela pecinha de plástico que quebrou? Fabricamos para você!",
      },
      {
        title: "Protótipos",
        description: "Do conceito ao produto final",
      },
    ],
  },
  submitButton: "Enviar Solicitação",
},

profile: {
  settings: "Profile Settings",
  description: "Manage your account settings and preferences",
  tabs: {
    info: "Account Info",
    password: "Change Password",
    email: "Change Email",
  },
  account: {
    title: "Account Information",
    description: "Your account details",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    role: "Role",
    memberSince: "Member Since",
  },
  password: {
    title: "Change Password",
    description: "Password must be at least 12 characters with uppercase, lowercase, number, and special character",
    current: "Current Password",
    new: "New Password",
    confirm: "Confirm New Password",
    button: "Update Password",
    updating: "Updating...",
    success: "Password updated successfully!",
    error: "Failed to update password",
    mismatch: "New passwords do not match",
    tooShort: "Password must be at least 12 characters long",
  },
  email: {
    title: "Change Email Address",
    description: "Update your email address. You'll need to verify your password.",
    current: "Current Email",
    new: "New Email",
    password: "Confirm Password",
    button: "Update Email",
    updating: "Updating...",
    success: "Email updated successfully! Please login again with your new email.",
    error: "Failed to update email",
  },
  networkError: "Network error",
},

categories: {
  title: "Nossas Categorias",
  description: "Produtos sustentáveis feitos com materiais biodegradáveis",
  items: [
    {
      title: "Decoração para o Lar",
      description: "Vasos, luminárias, porta-objetos e muito mais",
    },
    {
      title: "Brinquedos",
      description: "Diversão criativa e educativa para todas as idades",
    },
    {
      title: "Objetos Sensoriais",
      description: "Estímulo tátil e desenvolvimento cognitivo",
    },
    {
      title: "Materiais Biodegradáveis",
      description: "Sustentabilidade em cada impressão",
    },
  ],
},

heroSection: {
  badge: "Produtos Prontos para Entrega",
  title1: "Impressão 3D de",
  title2: "Alta Qualidade",
  description: "Produtos exclusivos e personalizados com materiais biodegradáveis. Do decorativo ao funcional.",
  buttonView: "Ver Produtos",
  buttonCustom: "Projetos Personalizados",
},

navbar: {
  customProjects: "Projetos Personalizados",
},

footer: {
  contact: {
    email: "contact@newprint3d.com",
    phone: "+1 (555) 123-4567",
    address: "123 Print Street",
    city: "Tech City, TC 12345",
  },
},
```

---

## Verificação Final

Após completar as correções, executar:

```bash
# Testar build
npm run build

# Testar cada idioma na interface
# 1. Português (pt)
# 2. Inglês (en)
# 3. Espanhol (es)
```

**Checklist de Verificação:**
- [ ] Todos os componentes listados foram atualizados
- [ ] Traduções em 3 idiomas implementadas
- [ ] Build sem erros
- [ ] localStorage persiste escolha de idioma
- [ ] Trocar idioma afeta toda a página
- [ ] Metadados de SEO funcionam corretamente

---

## Próximas Ações Futuras

- [ ] Considerar migração para `next-intl` ou `next-i18next`
- [ ] Implementar validação de chaves em build-time
- [ ] Adicionar roteamento automático por locale (`/en/*`, `/pt/*`, `/es/*`)
- [ ] Melhorar organização de traduções (considerar arquivos JSON por idioma)
- [ ] Adicionar suporte a pluralização automática
- [ ] Implementar fallback para idiomas não suportados

