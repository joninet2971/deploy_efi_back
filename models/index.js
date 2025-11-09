'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
let config = require(__dirname + '/../config/config.json')[env];
const db = {};

// En producción, sobrescribir con variables de entorno de Railway si están disponibles
if (env === 'production') {
  // Intentar usar MYSQL_PUBLIC_URL primero (URL completa de Railway)
  if (process.env.MYSQL_PUBLIC_URL && process.env.MYSQL_PUBLIC_URL.includes('/')) {
    config = {
      use_env_variable: 'MYSQL_PUBLIC_URL',
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    };
  } 
  // Si MYSQL_URL está completa, usarla
  else if (process.env.MYSQL_URL && process.env.MYSQL_URL.includes('/')) {
    config = {
      use_env_variable: 'MYSQL_URL',
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    };
  } 
  // Fallback a variables individuales de Railway
  else {
    config = {
      username: process.env.MYSQLUSER || config.username,
      password: process.env.MYSQLPASSWORD || config.password,
      database: process.env.MYSQLDATABASE || config.database,
      host: process.env.MYSQLHOST || config.host,
      port: process.env.MYSQLPORT || config.port || 3306,
      dialect: 'mysql',
      dialectOptions: {
        ssl: {
          rejectUnauthorized: false
        }
      }
    };
  }
}

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
