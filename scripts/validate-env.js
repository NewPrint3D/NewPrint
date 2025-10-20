// Validar variáveis de ambiente obrigatórias em produção
const requiredEnvVars = {
  production: [
    'DATABASE_URL',
    'JWT_SECRET',
    'NEXT_PUBLIC_SITE_URL'
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

console.log('');

if (hasErrors) {
  console.error('❌ Validação FALHOU! Corrija os erros acima antes de continuar.\n');
  process.exit(1);
} else {
  console.log('✅ Todas as variáveis de ambiente estão OK!\n');
  process.exit(0);
}
