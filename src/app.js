const express = require('express');
const mongoose = require('mongoose');
const { config } = require('dotenv');
config();

// Importamos la ruta de libros
const bookRouter = require('./routes/book.routes');

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Conectar a la base de datos
mongoose.connect(process.env.MONGO_URL, { dbName: process.env.MONGO_DB_NAME });

const db = mongoose.connection;

// Manejo de errores en la conexión
db.on('error', (error) => {
    console.error('Error de conexión a MongoDB:', error);
});

db.once('open', () => {
    console.log('Conectado a MongoDB');
});

// Rutas
app.use('/books', bookRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`El servidor está escuchando en el puerto ${port}`);
});
