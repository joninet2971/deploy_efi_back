require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const swaggerUI = require("swagger-ui-express");
const specs = require("./swagger/swagger.js");
<<<<<<< HEAD
const db = require('./models');

const port = process.env.PORT || 3000;
=======

const port = process.env.PORT || 3000;;
>>>>>>> 7fa6c67acf7cd177b695ec43868aa056f0a01c56

app.use(cors());
app.use(express.json());
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))

const userRoutes = require('./routes/user.routes');
const clientRoutes = require('./routes/client.routes');
const brandRoutes = require('./routes/brand.routes');
const carRoutes = require('./routes/car.routes');
const rentalRoutes = require('./routes/rental.routes');
const authRoutes = require('./routes/auth.routes');

app.use('/', userRoutes);
app.use('/auth', authRoutes);
app.use('/client', clientRoutes);
app.use('/brand', brandRoutes);
app.use('/car', carRoutes);
app.use('/rental', rentalRoutes);

app.get('/', (req, res) => {
  res.send('Servidor funcionando!');
});

<<<<<<< HEAD
// Inicializar conexión a la base de datos y luego iniciar el servidor
db.sequelize.authenticate()
  .then(() => {
    console.log('Conexión a la base de datos establecida correctamente.');
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`);
    });
  })
  .catch(err => {
    console.error('No se pudo conectar a la base de datos:', err);
    process.exit(1);
  });
=======
app.listen(port, () => {
  console.log(`Servidor corriendo en localhost:${port}`);
});
>>>>>>> 7fa6c67acf7cd177b695ec43868aa056f0a01c56
