require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const swaggerUI = require("swagger-ui-express");
const specs = require("./swagger/swagger.js");

const port = process.env.PORT || 3000;;

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

app.listen(port, () => {
  console.log(`Servidor corriendo en localhost:${port}`);
});
