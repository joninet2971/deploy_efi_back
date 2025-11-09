require('dotenv').config();
const { execSync } = require('child_process');

// Verificar y configurar variables de entorno de Railway
console.log('Verificando variables de entorno de Railway...');
if (process.env.NODE_ENV === 'production') {
  // Si MYSQL_URL está truncada o incompleta, construirla desde variables individuales
  if (!process.env.MYSQL_URL || !process.env.MYSQL_URL.includes('/railway')) {
    const host = process.env.MYSQLHOST || 'mysql.railway.internal';
    const port = process.env.MYSQLPORT || '3306';
    const user = process.env.MYSQLUSER || 'root';
    const password = process.env.MYSQLPASSWORD || '';
    const database = process.env.MYSQLDATABASE || 'railway';
    
    if (host && port && user && password && database) {
      // Construir MYSQL_URL completa
      process.env.MYSQL_URL = `mysql://${user}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
      console.log('MYSQL_URL construida desde variables individuales');
    }
  }
  
  // Debug: mostrar qué variables tenemos (sin mostrar la contraseña completa)
  console.log('Variables de entorno detectadas:');
  console.log('- MYSQLHOST:', process.env.MYSQLHOST || 'no definido');
  console.log('- MYSQLPORT:', process.env.MYSQLPORT || 'no definido');
  console.log('- MYSQLUSER:', process.env.MYSQLUSER || 'no definido');
  console.log('- MYSQLDATABASE:', process.env.MYSQLDATABASE || 'no definido');
  console.log('- MYSQLPASSWORD:', process.env.MYSQLPASSWORD ? '***definido***' : 'no definido');
}

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

// Iniciar el servidor
console.log('Iniciando servidor...');
require('./index.js');
