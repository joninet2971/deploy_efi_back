require('dotenv').config();

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
    // Si MYSQL_URL está completa y válida, usarla
    if (process.env.MYSQL_URL && process.env.MYSQL_URL.includes('/') && process.env.MYSQL_URL.split('/').length >= 4) {
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
    
    // Construir desde variables individuales
    const username = process.env.MYSQLUSER || process.env.MYSQL_ROOT_USER || 'root';
    const password = process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '';
    const database = process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway';
    const host = process.env.MYSQLHOST || process.env.MYSQL_HOST || 'mysql.railway.internal';
    const port = parseInt(process.env.MYSQLPORT || process.env.MYSQL_PORT || '3306');
    
    // Si tenemos todas las variables necesarias, construir la URL
    if (username && password && database && host && port) {
      const mysqlUrl = `mysql://${username}:${encodeURIComponent(password)}@${host}:${port}/${database}`;
      // Establecer MYSQL_URL en el proceso para que Sequelize la use
      process.env.MYSQL_URL = mysqlUrl;
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
    
    // Fallback a variables individuales
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
