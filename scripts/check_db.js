// Simple DB connectivity checker for Railway / local env
// Usage: set MYSQL_URL (or MYSQLHOST, MYSQLUSER, MYSQLPASSWORD, MYSQLDATABASE) then:
//   node scripts/check_db.js

const mysql = require('mysql2/promise');

async function main(){
  try{
    let cfg = {};
    if(process.env.MYSQL_URL){
      try{
        const u = new URL(process.env.MYSQL_URL);
        cfg.host = u.hostname;
        cfg.port = u.port || 3306;
        cfg.user = decodeURIComponent(u.username);
        cfg.password = decodeURIComponent(u.password);
        cfg.database = (u.pathname || '').replace(/^\//, '');
      }catch(e){
        console.error('Failed to parse MYSQL_URL:', e.message);
        process.exit(2);
      }
    } else {
      cfg.host = process.env.MYSQLHOST || process.env.DB_HOST || '127.0.0.1';
      cfg.port = process.env.MYSQLPORT || process.env.DB_PORT || 3306;
      cfg.user = process.env.MYSQLUSER || process.env.DB_USER || 'root';
      cfg.password = process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '';
      cfg.database = process.env.MYSQLDATABASE || process.env.DB_NAME || '';
    }

    console.log('Attempting to connect with config:', {
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      database: cfg.database ? cfg.database : '(none)'
    });

    const conn = await mysql.createConnection({
      host: cfg.host,
      port: cfg.port,
      user: cfg.user,
      password: cfg.password,
      database: cfg.database,
      connectTimeout: 10000
    });

    console.log('Connected to DB successfully. Running SHOW TABLES;');
    const [rows] = await conn.query('SHOW TABLES;');
    console.log('Tables (first 20):');
    console.log(rows.slice(0,20));

    await conn.end();
    process.exit(0);
  }catch(err){
    console.error('DB check failed:', err.message || err);
    if(err.stack) console.error(err.stack);
    process.exit(3);
  }
}

main();
