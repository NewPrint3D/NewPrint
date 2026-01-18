// /lib/i18n.ts

export type Locale = "en" | "pt" | "es"

export const locales: Locale[] = ["en", "pt", "es"]
export const defaultLocale: Locale = "es"

export const localeNames: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
}

const base = {
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

  cta: {
    view: "View",
    edit: "Edit",
  },

  product: {
    related: "Related products",
  },

  products: {
    title: "Products",
    viewAll: "View all",
  },

  productsPage: {
    title: "Products",
    description: "Browse all products",
  },

  cart: {
    title: "Cart",
    empty: "Your cart is empty",
    qtyLabel: "Qty",
    subtotal: "Subtotal",
    shipping: "Shipping",
    total: "Total",
  },

  orders: {
    title: "My Orders",
    noOrders: "No orders yet",
    noOrdersDescription: "Start shopping to see your orders",
  },

  auth: {
    welcome: "Welcome",
    email: "Email",
    password: "Password",
    login: "Login",
    register: "Register",
    loginFailed: "Login failed",
    loggingIn: "Signing in...",
    loginButton: "Login",
    noAccount: "Don't have an account?",
    signUpHere: "Sign up",
  },

  admin: {
    products: "Products",
    manageCatalog: "Manage catalog",
    addProduct: "Add product",
    noProducts: "No products",
    noProductsHelper: "Create your first product",
    orderNumber: "Order",
    demoAuthWarning: "Demo mode",
    failedToLoad: "Failed to load",
    networkError: "Network error",
    deleteConfirm: "Are you sure?",
  },
}

export const translations = {
  en: { ...base },

  pt: {
    ...base,
    nav: {
      home: "Início",
      products: "Produtos",
      about: "Sobre",
      contact: "Contato",
      cart: "Carrinho",
      navLink: "Link",
    },
    common: { featured: "Destaque" },
    cta: { view: "Ver", edit: "Editar" },
    product: { related: "Produtos relacionados" },
    cart: {
      title: "Carrinho",
      empty: "Seu carrinho está vazio",
      qtyLabel: "Qtd",
      subtotal: "Subtotal",
      shipping: "Frete",
      total: "Total",
    },
    orders: {
      title: "Meus pedidos",
      noOrders: "Nenhum pedido",
      noOrdersDescription: "Comece a comprar para ver seus pedidos",
    },
    auth: {
      welcome: "Bem-vindo",
      email: "E-mail",
      password: "Senha",
      login: "Entrar",
      register: "Cadastrar",
      loginFailed: "Falha no login",
      loggingIn: "Entrando...",
      loginButton: "Entrar",
      noAccount: "Não tem uma conta?",
      signUpHere: "Cadastre-se",
    },
  },

  es: {
    ...base,
    nav: {
      home: "Inicio",
      products: "Productos",
      about: "Acerca",
      contact: "Contacto",
      cart: "Carrito",
      navLink: "Enlace",
    },
    common: { featured: "Destacado" },
    cta: { view: "Ver", edit: "Editar" },
    product: { related: "Productos relacionados" },
    cart: {
      title: "Carrito",
      empty: "Tu carrito está vacío",
      qtyLabel: "Cant.",
      subtotal: "Subtotal",
      shipping: "Envío",
      total: "Total",
    },
    orders: {
      title: "Mis pedidos",
      noOrders: "Aún no hay pedidos",
      noOrdersDescription: "Empieza a comprar para ver tus pedidos",
    },
    auth: {
      welcome: "Bienvenido",
      email: "Correo",
      password: "Contraseña",
      login: "Iniciar sesión",
      register: "Registrarse",
      loginFailed: "Error al iniciar sesión",
      loggingIn: "Iniciando...",
      loginButton: "Entrar",
      noAccount: "¿No tienes una cuenta?",
      signUpHere: "Regístrate",
    },
  },
} as const

export type TranslationShape = (typeof translations)[typeof defaultLocale]

export function normalizeLocale(input?: string): Locale {
  if (!input) return defaultLocale
  const clean = input.toLowerCase().split("-")[0]
  return locales.includes(clean as Locale) ? (clean as Locale) : defaultLocale
}

export function getTranslations(locale?: string): TranslationShape {
  return translations[normalizeLocale(locale)]
}
