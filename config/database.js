module.exports = {
  development: {
    username: process.env.MYSQLUSER || "nodeuser",
    password: process.env.MYSQLPASSWORD || "NodePass123",
    database: process.env.MYSQLDATABASE || "alquiler_autos",
    host: process.env.MYSQLHOST || "localhost",
    dialect: "mysql"
  },
  test: {
    username: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || null,
    database: process.env.MYSQLDATABASE || "database_test",
    host: process.env.MYSQLHOST || "127.0.0.1",
    dialect: "mysql"
  },
  production: {
    username: process.env.MYSQLUSER || "root",
    password: process.env.MYSQLPASSWORD || "HAavyCqkbbtSyJCsYcazBtLjoNcpHEL0",
    database: process.env.MYSQLDATABASE || "railway",
    host: process.env.MYSQLHOST || "mysql.railway.internal",
    port: process.env.MYSQLPORT || 3306,
    dialect: "mysql",
    dialectOptions: {
      connectTimeout: 60000,
      ssl: false
    }
  }
};