"use client"

import { createContext, useContext, useMemo, useState, ReactNode } from "react"

export type Language = "pt" | "en" | "es"

/** Base do common */
type CommonBase = {
  loading: string
  save: string
  cancel: string
  back: string
  search: string
  yes: string
  no: string
  close: string
  featured: string
}
export type CommonTranslations = CommonBase & Record<string, string>

/** Base do CTA (botões/ações) */
type CtaBase = {
  view: string
  edit: string
  delete: string
  add: string
  create: string
  update: string
  confirm: string
}
export type CtaTranslations = CtaBase & Record<string, string>

/** Base do admin */
type AdminBase = {
  dashboard: string
  welcomeBack: string

  totalProducts: string
  totalOrders: string
  pendingOrders: string
  completedOrders: string
  canceledOrders: string
  totalCustomers: string
  totalRevenue: string
  revenueToday: string
  revenueThisMonth: string

  products: string
  orders: string
  customers: string
  revenue: string
  settings: string

  recentOrders: string
  allOrders: string
  viewAll: string
  status: string
  date: string
  customer: string
  total: string
  actions: string

  quickActions: string

  addProduct: string
  newProduct: string
  manageProducts: string
  manageOrders: string
  viewProducts: string
  viewOrders: string

  addProductHelper: string
  newProductHelper: string
  createProductHelper: string
  manageProductsHelper: string
  manageOrdersHelper: string
  viewProductsHelper: string
  viewOrdersHelper: string

  product: string
  productName: string
  productPrice: string
  productStock: string
  productCategory: string
  productColor: string
  productImage: string
  productImages: string
  productDescription: string
  createProduct: string
  editProduct: string
  deleteProduct: string

  order: string
  orderId: string
  orderStatus: string
  orderDate: string
  orderTotal: string
  orderItems: string
  orderDetails: string
  updateStatus: string

  statusPending: string
  statusProcessing: string
  statusPaid: string
  statusShipped: string
  statusDelivered: string
  statusCanceled: string

  noOrders: string
  noProducts: string
  confirmDelete: string
}
export type AdminTranslations = AdminBase & Record<string, string>

export type Translations = {
  common: CommonTranslations
  cta: CtaTranslations

  auth: {
    login: string
    logout: string
    welcome: string
    signIn: string
    signOut: string
    email: string
    password: string
  }

  navbar: {
    home: string
    products: string
    about: string
    contact: string
    admin: string
    cart: string
  }

  categories: {
    decor: string
    decorDesc: string
    accessories: string
    accessoriesDesc: string
  }

  admin: AdminTranslations
}

const translations: Record<Language, Translations> = {
  pt: {
    common: {
      loading: "Carregando...",
      save: "Salvar",
      cancel: "Cancelar",
      back: "Voltar",
      search: "Pesquisar",
      yes: "Sim",
      no: "Não",
      close: "Fechar",
      featured: "Destaque",
    },

    cta: {
      view: "Ver",
      edit: "Editar",
      delete: "Excluir",
      add: "Adicionar",
      create: "Criar",
      update: "Atualizar",
      confirm: "Confirmar",
    },

    auth: {
      login: "Entrar",
      logout: "Sair",
      welcome: "Bem-vindo",
      signIn: "Entrar",
      signOut: "Sair",
      email: "Email",
      password: "Senha",
    },

    navbar: {
      home: "Início",
      products: "Produtos",
      about: "Sobre",
      contact: "Contato",
      admin: "Admin",
      cart: "Carrinho",
    },

    categories: {
      decor: "Decoração",
      decorDesc: "Peças decorativas modernas e exclusivas",
      accessories: "Acessórios",
      accessoriesDesc: "Acessórios personalizados impressos em 3D",
    },

    admin: {
      dashboard: "Painel administrativo",
      welcomeBack: "Bem-vindo de volta, {name}",

      totalProducts: "Total de produtos",
      totalOrders: "Total de pedidos",
      pendingOrders: "Pedidos pendentes",
      completedOrders: "Pedidos concluídos",
      canceledOrders: "Pedidos cancelados",
      totalCustomers: "Total de clientes",
      totalRevenue: "Faturamento total",
      revenueToday: "Receita de hoje",
      revenueThisMonth: "Receita do mês",

      products: "Produtos",
      orders: "Pedidos",
      customers: "Clientes",
      revenue: "Receita",
      settings: "Configurações",

      recentOrders: "Pedidos recentes",
      allOrders: "Todos os pedidos",
      viewAll: "Ver todos",
      status: "Status",
      date: "Data",
      customer: "Cliente",
      total: "Total",
      actions: "Ações",

      quickActions: "Ações rápidas",

      addProduct: "Adicionar produto",
      newProduct: "Novo produto",
      manageProducts: "Gerenciar produtos",
      manageOrders: "Gerenciar pedidos",
      viewProducts: "Ver produtos",
      viewOrders: "Ver pedidos",

      addProductHelper: "Crie um novo produto para a sua loja",
      newProductHelper: "Adicione um novo item ao catálogo",
      createProductHelper: "Crie um novo produto para a sua loja",
      manageProductsHelper: "Edite, organize e publique seus produtos",
      manageOrdersHelper: "Acompanhe e atualize o status dos pedidos",
      viewProductsHelper: "Veja todos os produtos cadastrados",
      viewOrdersHelper: "Veja todos os pedidos realizados",

      product: "Produto",
      productName: "Nome do produto",
      productPrice: "Preço",
      productStock: "Estoque",
      productCategory: "Categoria",
      productColor: "Cor",
      productImage: "Imagem do produto",
      productImages: "Imagens do produto",
      productDescription: "Descrição",
      createProduct: "Criar produto",
      editProduct: "Editar produto",
      deleteProduct: "Excluir produto",

      order: "Pedido",
      orderId: "ID do pedido",
      orderStatus: "Status do pedido",
      orderDate: "Data do pedido",
      orderTotal: "Total do pedido",
      orderItems: "Itens do pedido",
      orderDetails: "Detalhes do pedido",
      updateStatus: "Atualizar status",

      statusPending: "Pendente",
      statusProcessing: "Processando",
      statusPaid: "Pago",
      statusShipped: "Enviado",
      statusDelivered: "Entregue",
      statusCanceled: "Cancelado",

      noOrders: "Nenhum pedido encontrado",
      noProducts: "Nenhum produto encontrado",
      confirmDelete: "Tem certeza que deseja excluir?",
    },
  },

  es: {
    common: {
      loading: "Cargando...",
      save: "Guardar",
      cancel: "Cancelar",
      back: "Volver",
      search: "Buscar",
      yes: "Sí",
      no: "No",
      close: "Cerrar",
      featured: "Destacado",
    },

    cta: {
      view: "Ver",
      edit: "Editar",
      delete: "Eliminar",
      add: "Añadir",
      create: "Crear",
      update: "Actualizar",
      confirm: "Confirmar",
    },

    auth: {
      login: "Entrar",
      logout: "Salir",
      welcome: "Bienvenido",
      signIn: "Entrar",
      signOut: "Salir",
      email: "Email",
      password: "Contraseña",
    },

    navbar: {
      home: "Inicio",
      products: "Productos",
      about: "Sobre nosotros",
      contact: "Contacto",
      admin: "Admin",
      cart: "Carrito",
    },

    categories: {
      decor: "Decoración",
      decorDesc: "Piezas decorativas modernas y exclusivas",
      accessories: "Accesorios",
      accessoriesDesc: "Accesorios personalizados impresos en 3D",
    },

    admin: {
      dashboard: "Panel de administración",
      welcomeBack: "Bienvenido de nuevo, {name}",

      totalProducts: "Total de productos",
      totalOrders: "Total de pedidos",
      pendingOrders: "Pedidos pendientes",
      completedOrders: "Pedidos completados",
      canceledOrders: "Pedidos cancelados",
      totalCustomers: "Total de clientes",
      totalRevenue: "Ingresos totales",
      revenueToday: "Ingresos de hoy",
      revenueThisMonth: "Ingresos del mes",

      products: "Productos",
      orders: "Pedidos",
      customers: "Clientes",
      revenue: "Ingresos",
      settings: "Configuración",

      recentOrders: "Pedidos recientes",
      allOrders: "Todos los pedidos",
      viewAll: "Ver todo",
      status: "Estado",
      date: "Fecha",
      customer: "Cliente",
      total: "Total",
      actions: "Acciones",

      quickActions: "Acciones rápidas",

      addProduct: "Añadir producto",
      newProduct: "Nuevo producto",
      manageProducts: "Gestionar productos",
      manageOrders: "Gestionar pedidos",
      viewProducts: "Ver produtos",
      viewOrders: "Ver pedidos",

      addProductHelper: "Crea un nuevo producto para tu tienda",
      newProductHelper: "Añade un nuevo artículo al catálogo",
      createProductHelper: "Crea un nuevo producto para tu tienda",
      manageProductsHelper: "Edita, organiza y publica tus productos",
      manageOrdersHelper: "Sigue y actualiza el estado de los pedidos",
      viewProductsHelper: "Ver todos los productos registrados",
      viewOrdersHelper: "Ver todos los pedidos realizados",

      product: "Producto",
      productName: "Nombre del producto",
      productPrice: "Precio",
      productStock: "Stock",
      productCategory: "Categoría",
      productColor: "Color",
      productImage: "Imagen del producto",
      productImages: "Imágenes del producto",
      productDescription: "Descripción",
      createProduct: "Crear producto",
      editProduct: "Editar producto",
      deleteProduct: "Eliminar producto",

      order: "Pedido",
      orderId: "ID del pedido",
      orderStatus: "Estado del pedido",
      orderDate: "Fecha del pedido",
      orderTotal: "Total del pedido",
      orderItems: "Artículos del pedido",
      orderDetails: "Detalles del pedido",
      updateStatus: "Actualizar estado",

      statusPending: "Pendiente",
      statusProcessing: "Procesando",
      statusPaid: "Pagado",
      statusShipped: "Enviado",
      statusDelivered: "Entregado",
      statusCanceled: "Cancelado",

      noOrders: "No se encontraron pedidos",
      noProducts: "No se encontraron productos",
      confirmDelete: "¿Seguro que quieres eliminar?",
    },
  },

  en: {
    common: {
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      back: "Back",
      search: "Search",
      yes: "Yes",
      no: "No",
      close: "Close",
      featured: "Featured",
    },

    cta: {
      view: "View",
      edit: "Edit",
      delete: "Delete",
      add: "Add",
      create: "Create",
      update: "Update",
      confirm: "Confirm",
    },

    auth: {
      login: "Login",
      logout: "Logout",
      welcome: "Welcome",
      signIn: "Sign in",
      signOut: "Sign out",
      email: "Email",
      password: "Password",
    },

    navbar: {
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact",
      admin: "Admin",
      cart: "Cart",
    },

    categories: {
      decor: "Decor",
      decorDesc: "Modern and exclusive decorative pieces",
      accessories: "Accessories",
      accessoriesDesc: "Personalized 3D printed accessories",
    },

    admin: {
      dashboard: "Admin dashboard",
      welcomeBack: "Welcome back, {name}",

      totalProducts: "Total products",
      totalOrders: "Total orders",
      pendingOrders: "Pending orders",
      completedOrders: "Completed orders",
      canceledOrders: "Canceled orders",
      totalCustomers: "Total customers",
      totalRevenue: "Total revenue",
      revenueToday: "Revenue today",
      revenueThisMonth: "Revenue this month",

      products: "Products",
      orders: "Orders",
      customers: "Customers",
      revenue: "Revenue",
      settings: "Settings",

      recentOrders: "Recent orders",
      allOrders: "All orders",
      viewAll: "View all",
      status: "Status",
      date: "Date",
      customer: "Customer",
      total: "Total",
      actions: "Actions",

      quickActions: "Quick actions",

      addProduct: "Add product",
      newProduct: "New product",
      manageProducts: "Manage products",
      manageOrders: "Manage orders",
      viewProducts: "View products",
      viewOrders: "View orders",

      addProductHelper: "Create a new product for your store",
      newProductHelper: "Add a new item to the catalog",
      createProductHelper: "Create a new product for your store",
      manageProductsHelper: "Edit, organize and publish your products",
      manageOrdersHelper: "Track and update order status",
      viewProductsHelper: "See all registered products",
      viewOrdersHelper: "See all placed orders",

      product: "Product",
      productName: "Product name",
      productPrice: "Price",
      productStock: "Stock",
      productCategory: "Category",
      productColor: "Color",
      productImage: "Product image",
      productImages: "Product images",
      productDescription: "Description",
      createProduct: "Create product",
      editProduct: "Edit product",
      deleteProduct: "Delete product",

      order: "Order",
      orderId: "Order ID",
      orderStatus: "Order status",
      orderDate: "Order date",
      orderTotal: "Order total",
      orderItems: "Order items",
      orderDetails: "Order details",
      updateStatus: "Update status",

      statusPending: "Pending",
      statusProcessing: "Processing",
      statusPaid: "Paid",
      statusShipped: "Shipped",
      statusDelivered: "Delivered",
      statusCanceled: "Canceled",

      noOrders: "No orders found",
      noProducts: "No products found",
      confirmDelete: "Are you sure you want to delete?",
    },
  },
}

type LanguageContextType = {
  language: Language
  locale: Language
  setLanguage: (lang: Language) => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("es")

  const value = useMemo(
    () => ({
      language,
      locale: language,
      setLanguage,
      t: translations[language],
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) throw new Error("useLanguage must be used within LanguageProvider")
  return context
}
