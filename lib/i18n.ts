export type Locale = "es" | "pt" | "en"

export const locales: Locale[] = ["es", "pt", "en"]

export const defaultLocale: Locale = "es"

export const localeNames: Record<Locale, string> = {
  es: "Español",
  pt: "Português",
  en: "English",
}

export const translations = {
  es: {
    nav: {
      home: "Inicio",
      products: "Productos",
      customProjects: "Proyectos personalizados",
      about: "Acerca",
      contact: "Contacto",
      cart: "Carrito",
      navLink: "Enlace",
    },

    customProjects: {
      navLink: "Proyectos personalizados",
    },

    common: {
      featured: "Destacado",
    },

    actions: {
      viewAll: "Ver todo",
      continueShopping: "Seguir comprando",
    },

    products: {
      title: "Productos",
    },

    features: {
      title: "Por qué elegir NewPrint3D",
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
      secure: {
        title: "Compra segura",
        description: "Pagos protegidos y experiencia confiable.",
      },
      support: {
        title: "Soporte",
        description: "Atención rápida para ayudarte antes y después de la compra.",
      },
    },

    footer: {
      description: "Impresión 3D premium y diseño moderno: piezas únicas hechas para tu espacio.",
      quickLinks: "Enlaces rápidos",
      contact: "Contacto",
      rights: "Todos los derechos reservados.",
      made: "Hecho con cuidado en España.",
    },

    hero: {
      readyForDelivery: "Listo para entrega",
      printing3d: "Impresión 3D",
      highQuality: "Alta calidad",
      exclusiveProducts: "Productos exclusivos y proyectos personalizados para tu espacio.",
      viewProducts: "Ver productos",
      customProjects: "Proyectos personalizados",
    },

    cart: {
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
      // ✅ NOVO
      profile: "Perfil",
    },

    admin: {
      products: "Productos",
      manageCatalog: "Administrar catálogo",
      addProduct: "Agregar producto",
      deleteConfirm: "¿Seguro que deseas eliminar?",
      noProducts: "Sin productos",
      noProductsHelper: "Agrega tu primer producto",
      orderNumber: "Pedido",
      failedToLoad: "Error al cargar",
      networkError: "Error de red",
    },

    product: {
      related: "Productos relacionados",
    },

    orders: {
      title: "Mis pedidos",
      noOrders: "Aún no hay pedidos",
    },

    cta: {
      view: "Ver",
      edit: "Editar",
      viewAll: "Ver todo",
    },

    aria: {
      loading: "Cargando",
    },
  },

  pt: {
    nav: {
      home: "Início",
      products: "Produtos",
      customProjects: "Projetos personalizados",
      about: "Sobre",
      contact: "Contato",
      cart: "Carrinho",
      navLink: "Link",
    },

    customProjects: {
      navLink: "Projetos personalizados",
    },

    common: {
      featured: "Destaque",
    },

    actions: {
      viewAll: "Ver tudo",
      continueShopping: "Continuar comprando",
    },

    products: {
      title: "Produtos",
    },

    features: {
      title: "Por que escolher a NewPrint3D",
      quality: {
        title: "Qualidade premium",
        description: "Impressão 3D de alta qualidade com acabamento profissional.",
      },
      fast: {
        title: "Produção rápida",
        description: "Fabricação eficiente com prazos otimizados.",
      },
      customization: {
        title: "Personalização",
        description: "Cores, tamanhos e materiais do seu jeito.",
      },
      secure: {
        title: "Compra segura",
        description: "Pagamentos protegidos e experiência confiável.",
      },
      support: {
        title: "Suporte",
        description: "Atendimento rápido para ajudar antes e depois da compra.",
      },
    },

    footer: {
      description: "Impressão 3D premium e design moderno: peças únicas para o seu ambiente.",
      quickLinks: "Links rápidos",
      contact: "Contato",
      rights: "Todos os direitos reservados.",
      made: "Feito com cuidado na Espanha.",
    },

    hero: {
      readyForDelivery: "Pronto para entrega",
      printing3d: "Impressão 3D",
      highQuality: "Alta qualidade",
      exclusiveProducts: "Produtos exclusivos e projetos personalizados para o seu ambiente.",
      viewProducts: "Ver produtos",
      customProjects: "Projetos personalizados",
    },

    cart: {
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
      // ✅ NOVO
      profile: "Perfil",
    },

    admin: {
      products: "Produtos",
      manageCatalog: "Gerenciar catálogo",
      addProduct: "Adicionar produto",
      deleteConfirm: "Tem certeza que deseja excluir?",
      noProducts: "Nenhum produto",
      noProductsHelper: "Cadastre seu primeiro produto",
      orderNumber: "Pedido",
      failedToLoad: "Falha ao carregar",
      networkError: "Erro de rede",
    },

    product: {
      related: "Produtos relacionados",
    },

    orders: {
      title: "Meus pedidos",
      noOrders: "Nenhum pedido ainda",
    },

    cta: {
      view: "Ver",
      edit: "Editar",
      viewAll: "Ver tudo",
    },

    aria: {
      loading: "Carregando",
    },
  },

  en: {
    nav: {
      home: "Home",
      products: "Products",
      customProjects: "Custom projects",
      about: "About",
      contact: "Contact",
      cart: "Cart",
      navLink: "Link",
    },

    customProjects: {
      navLink: "Custom projects",
    },

    common: {
      featured: "Featured",
    },

    actions: {
      viewAll: "View all",
      continueShopping: "Continue shopping",
    },

    products: {
      title: "Products",
    },

    features: {
      title: "Why choose NewPrint3D",
      quality: {
        title: "Premium quality",
        description: "High-quality 3D printing with a professional finish.",
      },
      fast: {
        title: "Fast production",
        description: "Efficient manufacturing with optimized lead times.",
      },
      customization: {
        title: "Customization",
        description: "Colors, sizes, and materials tailored to you.",
      },
      secure: {
        title: "Secure checkout",
        description: "Protected payments and a reliable experience.",
      },
      support: {
        title: "Support",
        description: "Quick help before and after your purchase.",
      },
    },

    footer: {
      description: "Premium 3D printing and modern design: unique pieces made for your space.",
      quickLinks: "Quick links",
      contact: "Contact",
      rights: "All rights reserved.",
      made: "Made with care in Spain.",
    },

    hero: {
      readyForDelivery: "Ready for delivery",
      printing3d: "3D Printing",
      highQuality: "High quality",
      exclusiveProducts: "Exclusive products and custom projects made for your space.",
      viewProducts: "Browse products",
      customProjects: "Custom projects",
    },

    cart: {
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
      // ✅ NOVO
      profile: "Profile",
    },

    admin: {
      products: "Products",
      manageCatalog: "Manage catalog",
      addProduct: "Add product",
      deleteConfirm: "Are you sure?",
      noProducts: "No products",
      noProductsHelper: "Add your first product",
      orderNumber: "Order",
      failedToLoad: "Failed to load",
      networkError: "Network error",
    },

    product: {
      related: "Related products",
    },

    orders: {
      title: "My orders",
      noOrders: "No orders yet",
    },

    cta: {
      view: "View",
      edit: "Edit",
      viewAll: "View all",
    },

    aria: {
      loading: "Loading",
    },
  },
} as const

export type TranslationShape = typeof translations.es

export function getTranslations(locale: Locale) {
  return translations[locale] ?? translations[defaultLocale]
}
