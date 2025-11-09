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
  production: {
    username: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || null,
    database: process.env.MYSQLDATABASE || 'railway',
    host: process.env.MYSQLHOST || 'mysql.railway.internal',
    port: parseInt(process.env.MYSQLPORT) || 3306,
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
};
