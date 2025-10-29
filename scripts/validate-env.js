// Validar variáveis de ambiente obrigatórias em produção
const requiredEnvVars = {
  production: [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXT_PUBLIC_SITE_URL',
    'STRIPE_SECRET_KEY',
    'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    'STRIPE_WEBHOOK_SECRET',
    'PAYPAL_CLIENT_SECRET',
    'NEXT_PUBLIC_PAYPAL_CLIENT_ID'
  ],
  development: []
};

const env = process.env.NODE_ENV || 'development';
const required = requiredEnvVars[env] || [];

console.log(`\n🔍 Validando variáveis de ambiente (${env})...\n`);

let hasErrors = false;

required.forEach(varName => {
  const value = process.env[varName];

  if (!value) {
    console.error(`❌ ERRO: ${varName} não está definida!`);
    hasErrors = true;
  } else if (varName === 'JWT_SECRET' && value.length < 32) {
    console.error(`❌ ERRO: JWT_SECRET muito curto (mínimo 32 caracteres)`);
    hasErrors = true;
  } else {
    const preview = value.length > 20 ? value.substring(0, 20) + '...' : value;
    console.log(`✅ ${varName}: ${preview}`);
  }
});

// Validações específicas
if (process.env.JWT_SECRET === 'demo-secret-for-development-only-change-in-production') {
  console.error(`❌ ERRO: JWT_SECRET ainda está usando valor padrão de desenvolvimento!`);
  hasErrors = true;
}

if (env === 'production' && !process.env.DATABASE_URL?.includes('neon.tech')) {
  console.warn(`⚠️  AVISO: DATABASE_URL não parece ser do Neon`);
}

// Validar chaves do Stripe
if (env === 'production') {
  const stripeSecret = process.env.STRIPE_SECRET_KEY;
  const stripePublishable = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  const stripeWebhook = process.env.STRIPE_WEBHOOK_SECRET;

  if (stripeSecret && !stripeSecret.startsWith('sk_live_')) {
    console.warn(`⚠️  AVISO: STRIPE_SECRET_KEY parece ser uma chave de teste (sk_test_)`);
  }

  if (stripePublishable && !stripePublishable.startsWith('pk_live_')) {
    console.warn(`⚠️  AVISO: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY parece ser uma chave de teste (pk_test_)`);
  }

  if (stripeWebhook && stripeWebhook.length < 20) {
    console.warn(`⚠️  AVISO: STRIPE_WEBHOOK_SECRET parece muito curta`);
  }
}

// Validar PayPal
if (env === 'production') {
  const paypalClient = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const paypalSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (paypalClient && paypalClient.includes('sandbox')) {
    console.warn(`⚠️  AVISO: NEXT_PUBLIC_PAYPAL_CLIENT_ID parece ser uma chave sandbox`);
  }

  if (paypalSecret && paypalSecret.includes('sandbox')) {
    console.warn(`⚠️  AVISO: PAYPAL_CLIENT_SECRET parece ser uma chave sandbox`);
  }
}

console.log('');

if (hasErrors) {
  console.error('❌ Validação FALHOU! Corrija os erros acima antes de continuar.\n');
  process.exit(1);
} else {
  console.log('✅ Todas as variáveis de ambiente estão OK!\n');
  process.exit(0);
}
