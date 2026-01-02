// Script para gerar hash correto da senha do admin
const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'Admin123!';
  const hash = await bcrypt.hash(password, 10);

  console.log('\n========================================');
  console.log('HASH CORRETO GERADO!');
  console.log('========================================');
  console.log('Senha:', password);
  console.log('Hash:', hash);
  console.log('========================================');
  console.log('\nCopie o hash acima e atualize no banco:');
  console.log('\nUPDATE users SET password_hash = \'' + hash + '\' WHERE email = \'admin@newprint3d.com\';');
  console.log('========================================\n');
}

generateHash();
