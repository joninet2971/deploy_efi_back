require('dotenv').config();

// Función para construir MYSQL_URL desde variables individuales
function buildMysqlUrl() {
  // Railway puede usar diferentes nombres de variables
  const username = process.env.MYSQLUSER || process.env.MYSQL_ROOT_USER || process.env.MYSQLUSER || 'root';
  const password = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || process.env.MYSQLPASSWORD || '';
  const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway';
  const host = process.env.MYSQLHOST || process.env.MYSQL_HOST || 'mysql.railway.internal';
  const port = process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306';
  
  console.log('[database.js] buildMysqlUrl - Variables detectadas:', {
    MYSQLUSER: process.env.MYSQLUSER ? 'definido' : 'no definido',
    MYSQLPASSWORD: process.env.MYSQLPASSWORD ? 'definido' : 'no definido',
    MYSQL_ROOT_PASSWORD: process.env.MYSQL_ROOT_PASSWORD ? 'definido' : 'no definido',
    MYSQLDATABASE: process.env.MYSQLDATABASE || 'no definido',
    MYSQLHOST: process.env.MYSQLHOST || 'no definido',
    MYSQLPORT: process.env.MYSQLPORT || 'no definido'
  });
  
  if (username && password && database && host && port) {
    return `mysql://${username}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
  }
  return null;
}

module.exports = {
  development: {
    username: "root",
    password: "Cfe9ec4f!",
    database: "alquiler_autos",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql"
  },
  production: (() => {
    // Prioridad 1: MYSQL_PUBLIC_URL (URL completa y pública de Railway)
    if (process.env.MYSQL_PUBLIC_URL && process.env.MYSQL_PUBLIC_URL.includes('/') && process.env.MYSQL_PUBLIC_URL.split('/').length >= 4) {
      console.log('[database.js] Usando MYSQL_PUBLIC_URL');
      return {
        use_env_variable: 'MYSQL_PUBLIC_URL',
        dialect: "mysql",
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false
          }
        }
      };
    }
    
    // Prioridad 2: MYSQL_URL si está completa y válida
    let mysqlUrl = process.env.MYSQL_URL;
    
    // Si MYSQL_URL está truncada o incompleta, construirla
    if (!mysqlUrl || !mysqlUrl.includes('/') || mysqlUrl.split('/').length < 4) {
      const constructedUrl = buildMysqlUrl();
      if (constructedUrl) {
        mysqlUrl = constructedUrl;
        // Establecer en el proceso para que Sequelize la use
        process.env.MYSQL_URL = mysqlUrl;
        console.log('[database.js] MYSQL_URL construida desde variables individuales');
      }
    }
    
    // Si tenemos una URL válida, usarla
    if (mysqlUrl && mysqlUrl.includes('/') && mysqlUrl.split('/').length >= 4) {
      console.log('[database.js] Usando MYSQL_URL');
      return {
        use_env_variable: 'MYSQL_URL',
        dialect: "mysql",
        dialectOptions: {
          ssl: {
            rejectUnauthorized: false
          }
        }
      };
    }
    
    // Fallback: usar variables individuales directamente
    const username = process.env.MYSQLUSER || process.env.MYSQL_ROOT_USER || 'root';
    const password = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '';
    const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway';
    const host = process.env.MYSQLHOST || process.env.MYSQL_HOST || 'mysql.railway.internal';
    const port = parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306');
    
    console.log('[database.js] Usando variables individuales:', {
      host,
      port,
      user: username,
      database,
      passwordSet: !!password
    });
    
    return {
      username: username,
      password: password,
      database: database,
      host: host,
      port: port,
      dialect: "mysql",
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    };
  })()
};
