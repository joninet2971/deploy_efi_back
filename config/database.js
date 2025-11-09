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
    use_env_variable: "MYSQL_URL",
    dialect: "mysql",
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
};