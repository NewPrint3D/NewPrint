export type Locale = "pt" | "es" | "en"

export const locales: Locale[] = ["pt", "es", "en"]

// ✅ Espanhol como principal
export const defaultLocale: Locale = "es"

export const localeNames: Record<Locale, string> = {
  pt: "Português",
  es: "Español",
  en: "English",
}

/**
 * ✅ BASE: define a "forma" geral esperada pelos componentes.
 * Não precisa estar 100% perfeito agora — o fallback tolerante impede crash.
 */
const baseShape = {
  nav: {
    home: "",
    products: "",
    customProjects: "",
    about: "",
    contact: "",
    cart: "",
    navLink: "",
  },

  common: {
    featured: "",
    interactive3d: "",
  },

  actions: {
    viewAll: "",
    continueShopping: "",
  },

  cart: {
    title: "",
    empty: "",
    emptyDescription: "",
    qtyLabel: "",
    subtotal: "",
    shipping: "",
    total: "",
    continueShopping: "",
    color: "",
    size: "",
    material: "",
  },

  auth: {
    welcome: "",
    email: "",
    password: "",
    login: "",
    register: "",
    loginFailed: "",
    loggingIn: "",
    loginButton: "",
    noAccount: "",
    signUpHere: "",
    profile: "",
    logout: "",
  },

  admin: {
    products: "",
    manageCatalog: "",
    addProduct: "",
    deleteConfirm: "",
    noProducts: "",
    noProductsHelper: "",
    orderNumber: "",
    failedToLoad: "",
    networkError: "",
  },

  product: {
    related: "",
  },

  orders: {
    title: "",
    noOrders: "",
  },

  cta: {
    view: "",
    edit: "",
    viewAll: "",
  },

  aria: {
    loading: "",
  },

  features: {
    title: "",
    subtitle: "",
    quality: { title: "", description: "" },
    fast: { title: "", description: "" },
    customization: { title: "", description: "" },
    security: { title: "", description: "" },
  },

  hero: {
    readyForDelivery: "",
    title: "",
    subtitle: "",
    printing3d: "",
    highQuality: "",
    exclusiveProducts: "",
    viewProducts: "",
    customProjects: "",
  },

  footer: {
    description: "",
    quickLinks: "",
    contact: "",
    rights: "",
    made: "",
  },

  // ✅ Caso algum componente use algo como t.categories.homeDecor
  categories: {
    homeDecor: "",
    home: "",
  },
} as const

// ✅ Suas traduções atuais (mantidas) + complementos mínimos
export const translations = {
  es: {
    ...baseShape,

    nav: {
      ...baseShape.nav,
      home: "Inicio",
      products: "Productos",
      customProjects: "Proyectos personalizados",
      about: "Acerca",
      contact: "Contacto",
      cart: "Carrito",
      navLink: "Enlace",
    },

    common: {
      ...baseShape.common,
      featured: "Destacado",
      interactive3d: "3D interactivo",
    },

    actions: {
      ...baseShape.actions,
      viewAll: "Ver todo",
      continueShopping: "Seguir comprando",
    },

    cart: {
      ...baseShape.cart,
      title: "Carrito",
      empty: "Tu carrito está vacío",
      emptyDescription: "Agrega productos para comenzar",
      qtyLabel: "Cant.",
      subtotal: "Subtotal",
      shipping: "Envío",
      total: "Total",
      continueShopping: "Seguir comprando",
      color: "Color",
      size: "Tamaño",
      material: "Material",
    },

    auth: {
      ...baseShape.auth,
      welcome: "Bienvenido",
      email: "Correo",
      password: "Contraseña",
      login: "Iniciar sesión",
      register: "Crear cuenta",
      loginFailed: "Error al iniciar sesión",
      loggingIn: "Entrando...",
      loginButton: "Entrar",
      noAccount: "¿No tienes cuenta?",
      signUpHere: "Crear cuenta",
      profile: "Perfil",
      logout: "Salir",
    },

    admin: {
      ...baseShape.admin,
      products: "Productos",
      manageCatalog: "Administrar catálogo",
      addProduct: "Agregar producto",
      deleteConfirm: "¿Seguro que deseas eliminar?",
      noProducts: "Sin productos",
      noProductsHelper: "Agrega tu primer producto",
      orderNumber: "Pedido",
      failedToLoad: "No se pudo cargar.",
      networkError: "Error de red.",
    },

    product: {
      ...baseShape.product,
      related: "Productos relacionados",
    },

    orders: {
      ...baseShape.orders,
      title: "Mis pedidos",
      noOrders: "Aún no hay pedidos",
    },

    cta: {
      ...baseShape.cta,
      view: "Ver",
      edit: "Editar",
      viewAll: "Ver todo",
    },

    aria: {
      ...baseShape.aria,
      loading: "Cargando",
    },

    features: {
      ...baseShape.features,
      title: "Por qué NewPrint3D",
      subtitle: "Impresión 3D premium, rápida y a medida.",
      quality: {
        title: "Calidad premium",
        description: "Impresión 3D de alta calidad con un acabado profesional.",
      },
      fast: {
        title: "Producción rápida",
        description: "Fabricación eficiente con plazos optimizados.",
      },
      customization: {
        title: "Personalización",
        description: "Colores, tamaños y materiales a tu medida.",
      },
      security: {
        title: "Compra segura",
        description: "Pagos protegidos y experiencia fiable.",
      },
    },

    hero: {
      ...baseShape.hero,
      readyForDelivery: "Listo para entrega",
      title: "Impresión 3D premium en España",
      subtitle: "Piezas decorativas, regalos y proyectos personalizados con acabado profesional.",
      printing3d: "Impresión 3D",
      highQuality: "Alta calidad",
      exclusiveProducts: "Productos exclusivos y personalizados hechos para tu espacio.",
      viewProducts: "Ver productos",
      customProjects: "Proyectos personalizados",
    },

    footer: {
      ...baseShape.footer,
      description: "Impresión 3D premium y diseño moderno: piezas únicas hechas para tu espacio.",
      quickLinks: "Enlaces rápidos",
      contact: "Contacto",
      rights: "Todos los derechos reservados.",
      made: "Hecho con cuidado en España.",
    },

    categories: {
      ...baseShape.categories,
      homeDecor: "Decoración del hogar",
      home: "Home",
    },
  },

  pt: {
    ...baseShape,

    nav: {
      ...baseShape.nav,
      home: "Início",
      products: "Produtos",
      customProjects: "Projetos personalizados",
      about: "Sobre",
      contact: "Contato",
      cart: "Carrinho",
      navLink: "Link",
    },

    common: {
      ...baseShape.common,
      featured: "Destaque",
      interactive3d: "3D interativo",
    },

    actions: {
      ...baseShape.actions,
      viewAll: "Ver tudo",
      continueShopping: "Continuar comprando",
    },

    cart: {
      ...baseShape.cart,
      title: "Carrinho",
      empty: "Seu carrinho está vazio",
      emptyDescription: "Adicione produtos para começar",
      qtyLabel: "Qtd.",
      subtotal: "Subtotal",
      shipping: "Frete",
      total: "Total",
      continueShopping: "Continuar comprando",
      color: "Cor",
      size: "Tamanho",
      material: "Material",
    },

    auth: {
      ...baseShape.auth,
      welcome: "Bem-vindo",
      email: "E-mail",
      password: "Senha",
      login: "Entrar",
      register: "Criar conta",
      loginFailed: "Falha no login",
      loggingIn: "Entrando...",
      loginButton: "Entrar",
      noAccount: "Não tem conta?",
      signUpHere: "Criar conta",
      profile: "Perfil",
      logout: "Sair",
    },

    admin: {
      ...baseShape.admin,
      products: "Produtos",
      manageCatalog: "Gerenciar catálogo",
      addProduct: "Adicionar produto",
      deleteConfirm: "Tem certeza que deseja excluir?",
      noProducts: "Nenhum produto",
      noProductsHelper: "Cadastre seu primeiro produto",
      orderNumber: "Pedido",
      failedToLoad: "Falha ao carregar.",
      networkError: "Erro de rede.",
    },

    product: {
      ...baseShape.product,
      related: "Produtos relacionados",
    },

    orders: {
      ...baseShape.orders,
      title: "Meus pedidos",
      noOrders: "Nenhum pedido ainda",
    },

    cta: {
      ...baseShape.cta,
      view: "Ver",
      edit: "Editar",
      viewAll: "Ver tudo",
    },

    aria: {
      ...baseShape.aria,
      loading: "Carregando",
    },

    features: {
      ...baseShape.features,
      title: "Por que NewPrint3D",
      subtitle: "Impressão 3D premium, rápida e sob medida.",
      quality: { title: "Qualidade premium", description: "Impressão 3D de alta qualidade com acabamento profissional." },
      fast: { title: "Produção rápida", description: "Prazos otimizados e produção eficiente." },
      customization: { title: "Personalização", description: "Cores, tamanhos e materiais sob medida." },
      security: { title: "Compra segura", description: "Pagamentos protegidos e experiência confiável." },
    },

    hero: {
      ...baseShape.hero,
      readyForDelivery: "Pronto para entrega",
      title: "Impressão 3D premium na Espanha",
      subtitle: "Peças decorativas, presentes e projetos personalizados com acabamento profissional.",
      printing3d: "Impressão 3D",
      highQuality: "Alta qualidade",
      exclusiveProducts: "Produtos exclusivos e personalizados para o seu espaço.",
      viewProducts: "Ver produtos",
      customProjects: "Projetos personalizados",
    },

    footer: {
      ...baseShape.footer,
      description: "Impressão 3D premium e design moderno: peças únicas para o seu espaço.",
      quickLinks: "Links rápidos",
      contact: "Contato",
      rights: "Todos os direitos reservados.",
      made: "Feito com cuidado na Espanha.",
    },

    categories: {
      ...baseShape.categories,
      homeDecor: "Decoração",
      home: "Home",
    },
  },

  en: {
    ...baseShape,

    nav: {
      ...baseShape.nav,
      home: "Home",
      products: "Products",
      customProjects: "Custom projects",
      about: "About",
      contact: "Contact",
      cart: "Cart",
      navLink: "Link",
    },

    common: {
      ...baseShape.common,
      featured: "Featured",
      interactive3d: "Interactive 3D",
    },

    actions: {
      ...baseShape.actions,
      viewAll: "View all",
      continueShopping: "Continue shopping",
    },

    cart: {
      ...baseShape.cart,
      title: "Cart",
      empty: "Your cart is empty",
      emptyDescription: "Add products to get started",
      qtyLabel: "Qty",
      subtotal: "Subtotal",
      shipping: "Shipping",
      total: "Total",
      continueShopping: "Continue shopping",
      color: "Color",
      size: "Size",
      material: "Material",
    },

    auth: {
      ...baseShape.auth,
      welcome: "Welcome",
      email: "Email",
      password: "Password",
      login: "Login",
      register: "Create account",
      loginFailed: "Login failed",
      loggingIn: "Logging in...",
      loginButton: "Login",
      noAccount: "No account?",
      signUpHere: "Sign up",
      profile: "Profile",
      logout: "Logout",
    },

    admin: {
      ...baseShape.admin,
      products: "Products",
      manageCatalog: "Manage catalog",
      addProduct: "Add product",
      deleteConfirm: "Are you sure?",
      noProducts: "No products",
      noProductsHelper: "Add your first product",
      orderNumber: "Order",
      failedToLoad: "Failed to load.",
      networkError: "Network error.",
    },

    product: {
      ...baseShape.product,
      related: "Related products",
    },

    orders: {
      ...baseShape.orders,
      title: "My orders",
      noOrders: "No orders yet",
    },

    cta: {
      ...baseShape.cta,
      view: "View",
      edit: "Edit",
      viewAll: "View all",
    },

    aria: {
      ...baseShape.aria,
      loading: "Loading",
    },

    features: {
      ...baseShape.features,
      title: "Why NewPrint3D",
      subtitle: "Premium 3D printing, fast and made-to-order.",
      quality: { title: "Premium quality", description: "High-quality 3D printing with a professional finish." },
      fast: { title: "Fast production", description: "Optimized lead times and efficient production." },
      customization: { title: "Customization", description: "Colors, sizes and materials tailored to you." },
      security: { title: "Secure checkout", description: "Protected payments and a reliable experience." },
    },

    hero: {
      ...baseShape.hero,
      readyForDelivery: "Ready for delivery",
      title: "Premium 3D printing in Spain",
      subtitle: "Decor pieces, gifts and custom projects with a professional finish.",
      printing3d: "3D Printing",
      highQuality: "High quality",
      exclusiveProducts: "Exclusive, custom products made for your space.",
      viewProducts: "View products",
      customProjects: "Custom projects",
    },

    footer: {
      ...baseShape.footer,
      description: "Premium 3D printing and modern design: unique pieces made for your space.",
      quickLinks: "Quick links",
      contact: "Contact",
      rights: "All rights reserved.",
      made: "Made with care in Spain.",
    },

    categories: {
      ...baseShape.categories,
      homeDecor: "Home decor",
      home: "Home",
    },
  },
} as const

/**
 * ✅ Tolerante: nunca deixa `t` quebrar o prerender.
 * - Se uma chave não existir: retorna "" (string vazia)
 * - Se for objeto: retorna outro proxy tolerante
 */
function createT(obj: any): any {
  const handler: ProxyHandler<any> = {
    get(target, prop) {
      // suporte a console/log/inspeção
      if (prop === "__raw") return target
      if (prop === Symbol.toPrimitive) return () => ""
      if (prop === "toString") return () => ""
      if (prop === "valueOf") return () => ""

      const value = target?.[prop as any]

      if (value === undefined || value === null) {
        // devolve proxy que vira "" se renderizado
        return createT({})
      }

      if (typeof value === "object") return createT(value)
      return value
    },
  }

  return new Proxy(obj ?? {}, handler)
}

export type TranslationShape = Record<string, any>

export function getTranslations(locale: Locale): TranslationShape {
  const raw = (translations as any)[locale] ?? (translations as any)[defaultLocale] ?? baseShape
  return createT(raw)
}
