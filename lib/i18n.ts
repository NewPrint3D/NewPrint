// /lib/i18n.ts

export type Locale = "en" | "pt" | "es"

export const locales = ["en", "pt", "es"] as const satisfies readonly Locale[]

// ✅ idioma padrão do site (primeira visita) = espanhol
export const defaultLocale: Locale = "es"

export const localeNames: Record<Locale, string> = {
  en: "English",
  pt: "Português",
  es: "Español",
}

export const translations = {
  en: {
    nav: {
      home: "Home",
      products: "Products",
      about: "About",
      contact: "Contact",
      cart: "Cart",
      navLink: "Link",
    },

    // ✅ ações comuns (botões)
    actions: {
      viewAll: "View all",
    },

    // ✅ usado na Home (evita crash: t.home.viewAll)
    home: {
      viewAll: "View all",
    },

    categories: {
      homeDecor: "Home Decor",
      gifts: "Gifts",
      accessories: "Accessories",
      toys: "Toys",
      others: "Others",
    },

    customProjects: {
      navLink: "Custom Projects",
      title: "Custom Projects",
      description: "Tell us what you need and we’ll make it real.",
    },

    hero: {
      title: "Transform Your Ideas",
      subtitle: "Into Reality",
      description: "Premium 3D printing services with endless customization possibilities",
      cta: "Explore Products",
      ctaSecondary: "Learn More",
      badge: "Premium 3D Printing Services",
      readyForDelivery: "Products Ready for Delivery",
      highQuality: "High Quality",
      printing3d: "3D Printing",
      exclusiveProducts: "Exclusive and customizable products with biodegradable materials. From decorative to functional.",
      viewProducts: "View Products",
      customProjects: "Custom Projects",
    },

    features: {
      title: "Why Choose Us",
      quality: {
        title: "Premium Quality",
        description: "High-precision 3D printing with professional-grade materials",
      },
      customization: {
        title: "Full Customization",
        description: "Choose colors, sizes, and materials for your perfect product",
      },
      fast: {
        title: "Fast Delivery",
        description: "Quick turnaround times without compromising quality",
      },
      support: {
        title: "Personalized Support",
        description: "Monday to Friday · Business hours",
      },
    },

    products: {
      title: "Featured Products",
      customize: "Customize",
      addToCart: "Add to Cart",
      viewDetails: "View Details",
      from: "From",
      selectColorHint: "Select the color by clicking on the image",

      // ✅ chaves que a home costuma chamar
      viewAll: "View all",
      homeDecor: "Home Decor",
    },

    footer: {
      description: "Your trusted partner for custom 3D printed products",
      quickLinks: "Quick Links",
      contact: "Contact",
      followUs: "Follow Us",
      rights: "All rights reserved",
    },

    cart: {
      title: "Shopping Cart",
      empty: "Your cart is empty",
      emptyDescription: "Add some products to get started",
      continueShopping: "Continue Shopping",
      freeShippingAbove50: "Free shipping on orders over €50",
      missingForFreeShipping: "Add",
      freeShippingApplied: "Free shipping applied!",
      item: "Item",
      price: "Price",
      quantity: "Quantity",
      qtyLabel: "Qty",
      total: "Total",
      remove: "Remove",
      subtotal: "Subtotal",
      shipping: "Shipping",
      tax: "Tax",
      orderTotal: "Order Total",
      orderSummary: "Order Summary",
      proceedToCheckout: "Proceed to Checkout",
      color: "Color",
      size: "Size",
      material: "Material",
      perItem: "each",
    },

    checkout: {
      title: "Checkout",
      shippingInfo: "Shipping Information",
      paymentInfo: "Payment Information",
      orderSummary: "Order Summary",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      phone: "Phone",
      address: "Address",
      city: "City",
      state: "State",
      zipCode: "ZIP Code",
      country: "Country",
      cardNumber: "Card Number",
      expiryDate: "Expiry Date",
      cvv: "CVV",
      placeOrder: "Place Order",
      processing: "Processing...",
      success: "Order placed successfully!",
      successMessage: "Your order has been confirmed and saved.",
      cancelled: "Payment Cancelled",
      cancelledMessage: "You cancelled the payment. Your cart items are still saved.",
      paymentMethod: "Payment Method",
      creditCard: "Credit Card",
      orPayWith: "Or pay with",
      fillDetailsTitle: "Fill in the details",
      fillDetailsDescription: "Complete the form before paying",
      failedToCreateStripeCheckout: "Failed to create Stripe checkout.",
      missingStripeUrlFromBackend: "The URL did not come from the backend. (Stripe)",
      paymentFailed: "Payment Failed",
      pleaseTryAgain: "Please try again",
      paypalRedirecting: "Redirecting to PayPal...",
      paypalButton: "Pay with PayPal",
    },

    orders: {
      title: "My Orders",
      noOrders: "No orders yet",
      noOrdersDescription: "Start shopping to see your orders here",
    },

    about: {
      title: "About NewPrint3D",
      subtitle: "Pioneering the Future of 3D Printing",
      story: {
        title: "Our Story",
        description:
          "Founded with a passion for innovation, NewPrint3D has been at the forefront of custom 3D printing solutions. We believe in transforming ideas into tangible reality, one layer at a time.",
      },
      mission: {
        title: "Our Mission",
        description:
          "To democratize 3D printing technology and make custom manufacturing accessible to everyone, from hobbyists to professionals.",
      },
      vision: {
        title: "Our Vision",
        description:
          "A world where anyone can bring their creative ideas to life with precision, quality, and sustainability.",
      },
      values: {
        title: "Our Values",
        innovation: "Innovation",
        innovationDesc: "Constantly pushing boundaries",
        quality: "Quality",
        qualityDesc: "Excellence in every print",
        sustainability: "Sustainability",
        sustainabilityDesc: "Eco-friendly materials",
        customer: "Customer First",
        customerDesc: "Your success is our priority",
      },
      stats: {
        projects: "Projects Completed",
        customers: "Happy Customers",
        materials: "Materials Available",
        countries: "Countries Served",
      },
    },

    contact: {
      title: "Get In Touch",
      subtitle: "Have a project in mind? Let's bring it to life together",
      form: {
        name: "Your Name",
        email: "Your Email",
        subject: "Subject",
        message: "Your Message",
        send: "Send Message",
        sending: "Sending...",
        success: "Message sent successfully!",
      },
      info: {
        title: "Contact Information",
        email: "contacto@newprint3d.com",
        hours: "Mon - Fri: 9:00 AM - 6:00 PM",
      },
      quickResponse: {
        title: "Quick Response",
        description: "We typically respond within 24 hours on business days",
      },
    },

    auth: {
      welcome: "Welcome",
      email: "Email",
      password: "Password",
      login: "Login",
      register: "Create account",
      loginFailed: "Login failed",
      registerFailed: "Registration failed",
      alreadyHaveAccount: "Already have an account?",
      dontHaveAccount: "Don’t have an account?",
      signIn: "Sign in",
      signUp: "Sign up",
    },

    placeholders: {
      email: "Enter your email",
      password: "Enter your password",
      name: "Enter your name",
      subject: "Enter subject",
      message: "Write your message",
    },

    admin: {
      demoAuthWarning: "Demo mode: authentication is not configured.",
      failedToLoad: "Failed to load",
      networkError: "Network error",
      deleteConfirm: "Are you sure you want to delete?",
    },

    aria: {
      loading: "Loading",
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

    actions: {
      viewAll: "Ver tudo",
    },

    // ✅ usado na Home (evita crash: t.home.viewAll)
    home: {
      viewAll: "Ver tudo",
    },

    categories: {
      homeDecor: "Decoração",
      gifts: "Presentes",
      accessories: "Acessórios",
      toys: "Brinquedos",
      others: "Outros",
    },

    customProjects: {
      navLink: "Projetos Personalizados",
      title: "Projetos Personalizados",
      description: "Conte o que você precisa e a gente transforma em realidade.",
    },

    hero: {
      title: "Transforme Suas Ideias",
      subtitle: "Em Realidade",
      description: "Serviços premium de impressão 3D com infinitas possibilidades de personalização",
      cta: "Explorar Produtos",
      ctaSecondary: "Saiba Mais",
      badge: "Serviços Premium de Impressão 3D",
      readyForDelivery: "Produtos Prontos para Entrega",
      highQuality: "Alta Qualidade",
      printing3d: "Impressão 3D de",
      exclusiveProducts: "Produtos exclusivos e personalizados com materiais biodegradáveis. Do decorativo ao funcional.",
      viewProducts: "Ver Produtos",
      customProjects: "Projetos Personalizados",
    },

    features: {
      title: "Por Que Nos Escolher",
      quality: {
        title: "Qualidade Premium",
        description: "Impressão 3D de alta precisão com materiais de nível profissional",
      },
      customization: {
        title: "Personalização Total",
        description: "Escolha cores, tamanhos e materiais para seu produto perfeito",
      },
      fast: {
        title: "Entrega Rápida",
        description: "Prazos rápidos sem comprometer a qualidade",
      },
      support: {
        title: "Suporte especializado",
        description: "Assistência especializada sempre que precisar",
      },
    },

    products: {
      title: "Produtos em Destaque",
      customize: "Personalizar",
      addToCart: "Adicionar ao Carrinho",
      viewDetails: "Ver Detalhes",
      from: "A partir de",
      selectColorHint: "Selecione a cor clicando na imagem",

      viewAll: "Ver tudo",
      homeDecor: "Decoração",
    },

    footer: {
      description: "Seu parceiro confiável para produtos impressos em 3D personalizados",
      quickLinks: "Links Rápidos",
      contact: "Contato",
      followUs: "Siga-nos",
      rights: "Todos os direitos reservados",
    },

    cart: {
      title: "Carrinho de Compras",
      empty: "Seu carrinho está vazio",
      emptyDescription: "Adicione alguns produtos para começar",
      continueShopping: "Continuar Comprando",
      freeShippingAbove50: "Frete grátis em compras acima de €50",
      missingForFreeShipping: "Faltam",
      freeShippingApplied: "Frete grátis aplicado!",
      item: "Item",
      price: "Preço",
      quantity: "Quantidade",
      qtyLabel: "Qtd.",
      total: "Total",
      remove: "Remover",
      subtotal: "Subtotal",
      shipping: "Envio",
      tax: "Impostos",
      orderTotal: "Total do Pedido",
      orderSummary: "Resumo do Pedido",
      proceedToCheckout: "Finalizar Compra",
      color: "Cor",
      size: "Tamanho",
      material: "Material",
      perItem: "cada",
    },

    checkout: {
      title: "Finalizar Compra",
      shippingInfo: "Informações de Envio",
      paymentInfo: "Informações de Pagamento",
      orderSummary: "Resumo do Pedido",
      firstName: "Nome",
      lastName: "Sobrenome",
      email: "E-mail",
      phone: "Telefone",
      address: "Endereço",
      city: "Cidade",
      state: "Estado",
      zipCode: "CEP",
      country: "País",
      cardNumber: "Número do Cartão",
      expiryDate: "Validade",
      cvv: "CVV",
      placeOrder: "Finalizar",
      processing: "Processando...",
      success: "Pedido realizado com sucesso!",
      successMessage: "Seu pedido foi confirmado e salvo.",
      cancelled: "Pagamento Cancelado",
      cancelledMessage: "Você cancelou o pagamento. Seus itens continuam no carrinho.",
      paymentMethod: "Método de Pagamento",
      creditCard: "Cartão de Crédito",
      orPayWith: "Ou pague com",
      fillDetailsTitle: "Preencha os dados",
      fillDetailsDescription: "Complete o formulário antes de pagar",
      failedToCreateStripeCheckout: "Falha ao criar checkout do Stripe.",
      missingStripeUrlFromBackend: "A URL não veio do backend. (Stripe)",
      paymentFailed: "Pagamento Falhou",
      pleaseTryAgain: "Tente novamente",
      paypalRedirecting: "Redirecionando para o PayPal...",
      paypalButton: "Pagar com PayPal",
    },

    orders: {
      title: "Meus Pedidos",
      noOrders: "Ainda não há pedidos",
      noOrdersDescription: "Comece a comprar para ver seus pedidos aqui",
    },

    about: {
      title: "Sobre a NewPrint3D",
      subtitle: "Pioneirismo no Futuro da Impressão 3D",
      story: {
        title: "Nossa História",
        description:
          "Fundada com paixão por inovação, a NewPrint3D está na vanguarda das soluções de impressão 3D personalizada. Acreditamos em transformar ideias em realidade, camada por camada.",
      },
      mission: {
        title: "Nossa Missão",
        description:
          "Democratizar a tecnologia de impressão 3D e tornar a manufatura personalizada acessível a todos, de hobbyistas a profissionais.",
      },
      vision: {
        title: "Nossa Visão",
        description:
          "Um mundo onde qualquer pessoa possa dar vida às suas ideias criativas com precisão, qualidade e sustentabilidade.",
      },
      values: {
        title: "Nossos Valores",
        innovation: "Inovação",
        innovationDesc: "Sempre ultrapassando limites",
        quality: "Qualidade",
        qualityDesc: "Excelência em cada impressão",
        sustainability: "Sustentabilidade",
        sustainabilityDesc: "Materiais ecológicos",
        customer: "Cliente em Primeiro Lugar",
        customerDesc: "Seu sucesso é nossa prioridade",
      },
      stats: {
        projects: "Projetos Concluídos",
        customers: "Clientes Satisfeitos",
        materials: "Materiais Disponíveis",
        countries: "Países Atendidos",
      },
    },

    contact: {
      title: "Fale Conosco",
      subtitle: "Tem um projeto em mente? Vamos criar juntos",
      form: {
        name: "Seu Nome",
        email: "Seu E-mail",
        subject: "Assunto",
        message: "Sua Mensagem",
        send: "Enviar Mensagem",
        sending: "Enviando...",
        success: "Mensagem enviada com sucesso!",
      },
      info: {
        title: "Informações de Contato",
        email: "contacto@newprint3d.com",
        hours: "Seg - Sex: 9:00 - 18:00",
      },
      quickResponse: {
        title: "Resposta Rápida",
        description: "Normalmente respondemos em até 24 horas (dias úteis)",
      },
    },

    auth: {
      welcome: "Bem-vindo",
      email: "E-mail",
      password: "Senha",
      login: "Entrar",
      register: "Criar conta",
      loginFailed: "Falha no login",
      registerFailed: "Falha no cadastro",
      alreadyHaveAccount: "Já tem uma conta?",
      dontHaveAccount: "Não tem uma conta?",
      signIn: "Entrar",
      signUp: "Cadastrar",
    },

    placeholders: {
      email: "Digite seu e-mail",
      password: "Digite sua senha",
      name: "Digite seu nome",
      subject: "Digite o assunto",
      message: "Escreva sua mensagem",
    },

    admin: {
      demoAuthWarning: "Modo demo: autenticação não configurada.",
      failedToLoad: "Falha ao carregar",
      networkError: "Erro de rede",
      deleteConfirm: "Tem certeza que deseja excluir?",
    },

    aria: {
      loading: "Carregando",
    },
  },

  es: {
    nav: {
      home: "Inicio",
      products: "Productos",
      about: "Acerca",
      contact: "Contacto",
      cart: "Carrito",
      navLink: "Enlace",
    },

    actions: {
      viewAll: "Ver todo",
    },

    // ✅ usado na Home (evita crash: t.home.viewAll)
    home: {
      viewAll: "Ver todo",
    },

    categories: {
      homeDecor: "Decoración",
      gifts: "Regalos",
      accessories: "Accesorios",
      toys: "Juguetes",
      others: "Otros",
    },

    customProjects: {
      navLink: "Proyectos Personalizados",
      title: "Proyectos Personalizados",
      description: "Cuéntanos lo que necesitas y lo hacemos realidad.",
    },

    hero: {
      title: "Transforma Tus Ideas",
      subtitle: "En Realidad",
      description: "Servicios premium de impresión 3D con infinitas posibilidades de personalización",
      cta: "Explorar Productos",
      ctaSecondary: "Saber Más",
      badge: "Servicios Premium de Impresión 3D",
      readyForDelivery: "Productos Listos para Entrega",
      highQuality: "Alta Calidad",
      printing3d: "Impresión 3D de",
      exclusiveProducts:
        "Productos exclusivos y personalizables con materiales biodegradables. De lo decorativo a lo funcional.",
      viewProducts: "Ver Productos",
      customProjects: "Proyectos Personalizados",
    },

    features: {
      title: "Por Qué Elegirnos",
      quality: {
        title: "Calidad Premium",
        description: "Impresión 3D de alta precisión con materiales de nivel profesional",
      },
      customization: {
        title: "Personalización Total",
        description: "Elige colores, tamaños y materiales para tu producto perfecto",
      },
      fast: {
        title: "Entrega Rápida",
        description: "Tiempos de entrega rápidos sin comprometer la calidad",
      },
      support: {
        title: "Soporte especializado",
        description: "Asistencia experta cuando la necesites",
      },
    },

    products: {
      title: "Productos Destacados",
      customize: "Personalizar",
      addToCart: "Añadir al Carrito",
      viewDetails: "Ver Detalles",
      from: "Desde",
      selectColorHint: "Selecciona el color haciendo clic en la imagen",

      viewAll: "Ver todo",
      homeDecor: "Decoración",
    },

    footer: {
      description: "Tu socio confiable para productos impresos en 3D personalizados",
      quickLinks: "Enlaces Rápidos",
      contact: "Contacto",
      followUs: "Síguenos",
      rights: "Todos los derechos reservados",
    },

    cart: {
      title: "Carrito de Compras",
      empty: "Tu carrito está vacío",
      emptyDescription: "Añade algunos productos para comenzar",
      continueShopping: "Continuar Comprando",
      freeShippingAbove50: "🚚 Envío gratis a partir de 50 €",
      missingForFreeShipping: "Te faltan",
      freeShippingApplied: "✅ ¡Envío gratis aplicado!",
      item: "Artículo",
      price: "Precio",
      quantity: "Cantidad",
      qtyLabel: "Cant.",
      total: "Total",
      remove: "Eliminar",
      subtotal: "Subtotal",
      shipping: "Envío",
      tax: "Impuestos",
      orderTotal: "Total del Pedido",
      orderSummary: "Resumen del Pedido",
      proceedToCheckout: "Proceder al Pago",
      color: "Color",
      size: "Tamaño",
      material: "Material",
      perItem: "cada",
    },

    checkout: {
      title: "Finalizar Compra",
      shippingInfo: "Información de Envío",
      paymentInfo: "Información de Pago",
      orderSummary: "Resumen del Pedido",
      firstName: "Nombre",
      lastName: "Apellido",
      email: "Correo Electrónico",
      phone: "Teléfono",
      address: "Dirección",
      city: "Ciudad",
      state: "Estado",
      zipCode: "Código Postal",
      country: "País",
      cardNumber: "Número de Tarjeta",
      expiryDate: "Caducidad",
      cvv: "CVV",
      placeOrder: "Finalizar",
      processing: "Procesando...",
      success: "¡Pedido realizado con éxito!",
      successMessage: "Tu pedido ha sido confirmado y guardado.",
      cancelled: "Pago Cancelado",
      cancelledMessage: "Has cancelado el pago. Tus artículos siguen en el carrito.",
      paymentMethod: "Método de Pago",
      creditCard: "Tarjeta de Crédito",
      orPayWith: "O paga con",
      fillDetailsTitle: "Completa los datos",
      fillDetailsDescription: "Completa el formulario antes de pagar",
      failedToCreateStripeCheckout: "Error al crear checkout de Stripe.",
      missingStripeUrlFromBackend: "La URL no vino del backend. (Stripe)",
      paymentFailed: "Pago Fallido",
      pleaseTryAgain: "Inténtalo de nuevo",
      paypalRedirecting: "Redirigiendo a PayPal...",
      paypalButton: "Pagar con PayPal",
    },

    orders: {
      title: "Mis Pedidos",
      noOrders: "Aún no hay pedidos",
      noOrdersDescription: "Empieza a comprar para ver tus pedidos aquí",
    },

    about: {
      title: "Acerca de NewPrint3D",
      subtitle: "Pioneros en el Futuro de la Impresión 3D",
      story: {
        title: "Nuestra Historia",
        description:
          "Fundada con pasión por la innovación, NewPrint3D está a la vanguardia de soluciones de impresión 3D personalizada. Creemos en transformar ideas en realidad, capa por capa.",
      },
      mission: {
        title: "Nuestra Misión",
        description:
          "Democratizar la tecnología de impresión 3D y hacer la fabricación personalizada accesible para todos, desde aficionados hasta profesionales.",
      },
      vision: {
        title: "Nuestra Visión",
        description:
          "Un mundo donde cualquiera pueda dar vida a sus ideas creativas con precisión, calidad y sostenibilidad.",
      },
      values: {
        title: "Nuestros Valores",
        innovation: "Innovación",
        innovationDesc: "Siempre superando límites",
        quality: "Calidad",
        qualityDesc: "Excelencia en cada impresión",
        sustainability: "Sostenibilidad",
        sustainabilityDesc: "Materiales ecológicos",
        customer: "Cliente Primero",
        customerDesc: "Tu éxito es nuestra prioridad",
      },
      stats: {
        projects: "Proyectos Completados",
        customers: "Clientes Felices",
        materials: "Materiales Disponibles",
        countries: "Países Atendidos",
      },
    },

    contact: {
      title: "Contacto",
      subtitle: "¿Tienes un proyecto en mente? Hagámoslo realidad juntos",
      form: {
        name: "Tu Nombre",
        email: "Tu Correo",
        subject: "Asunto",
        message: "Tu Mensaje",
        send: "Enviar Mensaje",
        sending: "Enviando...",
        success: "¡Mensaje enviado con éxito!",
      },
      info: {
        title: "Información de Contacto",
        email: "contacto@newprint3d.com",
        hours: "Lun - Vie: 9:00 - 18:00",
      },
      quickResponse: {
        title: "Respuesta Rápida",
        description: "Normalmente respondemos en 24 horas (días hábiles)",
      },
    },

    auth: {
      welcome: "Bienvenido",
      email: "Correo",
      password: "Contraseña",
      login: "Iniciar sesión",
      register: "Crear cuenta",
      loginFailed: "Error al iniciar sesión",
      registerFailed: "Error al registrarse",
      alreadyHaveAccount: "¿Ya tienes una cuenta?",
      dontHaveAccount: "¿No tienes una conta?",
      signIn: "Entrar",
      signUp: "Registrarse",
    },

    placeholders: {
      email: "Introduce tu correo",
      password: "Introduce tu contraseña",
      name: "Introduce tu nombre",
      subject: "Introduce el asunto",
      message: "Escribe tu mensaje",
    },

    admin: {
      demoAuthWarning: "Modo demo: autenticación no configurada.",
      failedToLoad: "No se pudo cargar",
      networkError: "Error de red",
      deleteConfirm: "¿Seguro que deseas eliminar?",
    },

    aria: {
      loading: "Cargando",
    },
  },
} as const

export type TranslationShape = (typeof translations)[typeof defaultLocale]

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value)
}

/**
 * Normaliza locale do Next/headers/cookies:
 * - "pt-BR" -> "pt"
 * - "es-ES" -> "es"
 * - "en-US" -> "en"
 */
export function normalizeLocale(input: unknown): Locale {
  if (isLocale(input)) return input

  if (typeof input === "string" && input.length > 0) {
    const base = input.toLowerCase().split("-")[0]
    if (isLocale(base)) return base
  }

  return defaultLocale
}

/**
 * Sempre retorna um dicionário válido (nunca undefined),
 * evitando quebra no build/prerender quando locale vem inválido.
 */
export function getTranslations(locale: unknown): TranslationShape {
  const normalized = normalizeLocale(locale)
  return (translations[normalized] ?? translations[defaultLocale]) as TranslationShape
}
