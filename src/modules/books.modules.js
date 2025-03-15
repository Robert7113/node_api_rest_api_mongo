// book.modules.js
// Definimos el esquema (schema) para el modelo de libros en MongoDB.

// Importamos mongoose, que nos permite interactuar con MongoDB.
const mongoose = require('mongoose');

// Creamos el esquema para los libros.
// Un esquema define la estructura de los documentos en la base de datos.
const bookSchema = new mongoose.Schema({
   title: String,             // Título del libro
   author: String,            // Autor del libro
   genre: String,             // Género literario
   publication_date: String   // Fecha de publicación (Se recomienda almacenar como Date en lugar de String)
});

// Exportamos el modelo de libro basado en el esquema.
// Esto permite que podamos usarlo en otras partes de la aplicación para hacer operaciones CRUD.
module.exports = mongoose.model('Book', bookSchema);
