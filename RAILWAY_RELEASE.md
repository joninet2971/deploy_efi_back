Railway Release Command: migraciones automáticas

Si quieres que las migraciones y seeders se ejecuten automáticamente en cada deploy en Railway, añade el siguiente Release Command en el panel de Deploy > Release Command:

npx sequelize-cli db:migrate --env production && npx sequelize-cli db:seed:all --env production

Requisitos / recomendaciones:
- MYSQL_URL debe estar configurada en Settings -> Variables con el connection string completo (por ejemplo mysql://root:PASSWORD@mysql.railway.internal:3306/railway).
- Asegúrate de tener NODE_ENV=production en las variables de Railway.
- sequelize-cli está incluido en dependencies para que el comando esté disponible en el entorno de producción.
- Alternativa: si prefieres no mover sequelize-cli a dependencies, puedes establecer la variable NPM_CONFIG_PRODUCTION=false en Railway para que npm install incluya devDependencies.

Scripts npm añadidos en package.json:
- npm run migrate — ejecuta migraciones y seeders en el entorno production.
- npm run release — alias que ejecuta el script migrate.

Con esto, añade el Release Command en Railway y el deploy correrá las migraciones automáticamente.
