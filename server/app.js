const express = require('express');
const app = express();

app.use(express.json());

let books = [
  {
    id: 1,
    title: "Harry Potter and the Philosopher's Stone",
    author: 'J.K. Rowling',
  },
  { id: 2, title: 'To Kill a Mockingbird', author: 'Harper Lee' },
  { id: 3, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
];

app.get('/api/books', (req, res) => {
  res.json(books);
});

app.get('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const book = books.find((book) => book.id === bookId);
  if (!book) return res.status(404).send('Book not found');
  res.json(book);
});

app.post('/api/books', (req, res) => {
  const { title, author } = req.body;
  const newBook = { id: books[books.length - 1].id + 1, title, author };
  books.push(newBook);
  res.status(201).json(newBook);
});

app.put('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);
  if (bookIndex === -1) return res.status(404).send('Book not found');
  const { title, author } = req.body;
  books[bookIndex] = { ...books[bookIndex], title, author };
  res.json(books[bookIndex]);
});

app.delete('/api/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  books = books.filter((book) => book.id !== bookId);
  res.status(204).send();
});

app.listen(3000, () => {
  console.log(`Server is running on port 3000`);
});
