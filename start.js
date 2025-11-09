require('dotenv').config();
const { execSync } = require('child_process');

// Ejecutar migraciones antes de iniciar el servidor
console.log('Ejecutando migraciones...');
try {
  execSync('npx sequelize-cli db:migrate', { 
    stdio: 'inherit',
    env: { ...process.env, NODE_ENV: process.env.NODE_ENV || 'production' }
  });
  console.log('Migraciones completadas exitosamente');
} catch (error) {
  console.error('Error ejecutando migraciones:', error.message);
  // No salir del proceso si las migraciones ya están ejecutadas
  if (error.message.includes('already exists') || error.message.includes('already applied')) {
    console.log('Las migraciones ya están aplicadas, continuando...');
  } else {
    console.error('Error crítico en migraciones, deteniendo servidor');
    process.exit(1);
  }
}

// Ianiciar el servidor
console.log('Iniciando servidor...');
require('./index.js');

