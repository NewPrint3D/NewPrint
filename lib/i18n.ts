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
      about: "Acerca",
      contact: "Contacto",
      cart: "Carrito",
      navLink: "Enlace",
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
    },

    aria: {
      loading: "Cargando",
    },
  },

  pt: {
    nav: {
      home: "Início",
      products: "Produtos",
      about: "Sobre",
      contact: "Contato",
      cart: "Carrinho",
      navLink: "Link",
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
    },

    aria: {
      loading: "Carregando",
    },
  },

  en: {
    nav: {
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact",
      cart: "Cart",
      navLink: "Link",
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
