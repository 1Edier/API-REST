require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT;
app.use(express.json());

const alumnosRouter = require('./src/routes/alumnos.routes');


app.use('/alumnos', alumnosRouter);


app.listen(PORT, () => {
    console.log(`API escuchando en el puerto ${PORT}`);
});