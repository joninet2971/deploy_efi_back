'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
<<<<<<< HEAD
const config = require(__dirname + '/../config/config.json')[env];
=======
// Load config.json only if it exists; otherwise build config from environment variables
const configPath = path.join(__dirname, '..', 'config', 'config.json');
let config;
if (fs.existsSync(configPath)) {
  config = require(configPath)[env];
} else {
  // If a full DB URL is provided (recommended), use use_env_variable style
  if (process.env.MYSQL_URL) {
    config = { use_env_variable: 'MYSQL_URL' };
  } else {
    // Fallback to individual env vars (support both MYSQL* and common names)
    config = {
      username: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || null,
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'database_production',
      host: process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1',
      dialect: 'mysql'
    };
  }
}
>>>>>>> 7fa6c67acf7cd177b695ec43868aa056f0a01c56
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
