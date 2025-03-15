// Importamos Express y creamos un enrutador.
const express = require('express');
const router = express.Router();

// Importamos el modelo de libros.
const Book = require('../modules/books.modules'); // Asegúrate de que la ruta y el nombre sean correctos.

// Middleware para obtener un libro por ID.
const getBook = async (req, res, next) => {
    let book;
    const { id } = req.params;

    // Validamos que el ID tenga el formato correcto de MongoDB.
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        return res.status(404).json({ message: 'El ID del libro no es válido.' });
    }

    try {
        // Buscamos el libro en la base de datos.
        book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: 'El libro no fue encontrado.' });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }

    // Almacenamos el libro en res.book para su uso en las siguientes funciones.
    res.book = book;
    next();
};

// Obtener todos los libros [GET]
router.get('/', async (req, res) => {
    try {
        // Buscamos todos los libros en la base de datos.
        const books = await Book.find();
        console.log('GET all', books);

        // Si no hay libros, devolvemos un código 204 (sin contenido).
        if (books.length === 0) {
            return res.status(204).json([]);
        }

        res.json(books); // Enviamos la lista de libros como respuesta.
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Crear un nuevo libro [POST]
router.post('/', async (req, res) => {
    const { title, author, genre, publication_date } = req.body;

    // Verificamos que todos los campos requeridos estén presentes.
    if (!title || !author || !genre || !publication_date) {
        return res.status(400).json({
            message: 'Los campos title, author, genre y publication_date son obligatorios.'
        });
    }

    // Creamos un nuevo libro con los datos recibidos.
    const newBook = new Book({ title, author, genre, publication_date });

    try {
        const savedBook = await newBook.save(); // Guardamos el libro en la base de datos.
        console.log('Libro creado:', savedBook);
        res.status(201).json(savedBook); // Respondemos con el libro creado y código 201 (creado).
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Obtener un libro por ID [GET]
router.get('/:id', getBook, (req, res) => {
    res.json(res.book); // Devolvemos el libro encontrado en la solicitud.
});

// Actualizar completamente un libro [PUT]
router.put('/:id', getBook, async (req, res) => {
    try {
        const book = res.book;

        // Actualizamos los campos con los valores proporcionados o mantenemos los existentes.
        book.title = req.body.title || book.title;
        book.author = req.body.author || book.author;
        book.genre = req.body.genre || book.genre;
        book.publication_date = req.body.publication_date || book.publication_date;

        const updatedBook = await book.save(); // Guardamos los cambios en la base de datos.
        res.json(updatedBook); // Respondemos con el libro actualizado.
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Actualizar parcialmente un libro [PATCH]
router.patch('/:id', getBook, async (req, res) => {
    const { title, author, genre, publication_date } = req.body;

    // Si no se proporciona ningún campo para actualizar, devolvemos un error.
    if (!title && !author && !genre && !publication_date) {
        return res.status(400).json({
            message: 'Al menos uno de los campos (title, author, genre, publication_date) debe ser proporcionado.'
        });
    }

    try {
        const book = res.book;

        // Solo actualizamos los campos que fueron proporcionados en la solicitud.
        if (title) book.title = title;
        if (author) book.author = author;
        if (genre) book.genre = genre;
        if (publication_date) book.publication_date = publication_date;

        const updatedBook = await book.save(); // Guardamos los cambios.
        res.json(updatedBook); // Respondemos con el libro actualizado.
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Eliminar un libro [DELETE]
router.delete('/:id', getBook, async (req, res) => {
    try {
        await res.book.deleteOne(); // Eliminamos el libro de la base de datos.
        res.json({ message: 'El libro ha sido eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Exportamos el enrutador para que pueda ser utilizado en la aplicación principal.
module.exports = router;
