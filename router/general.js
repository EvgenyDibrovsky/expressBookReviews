const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  const userExists = users.some((user) => user.username === username);
  if (userExists) {
    return res.status(409).json({ message: "Username already exists" });
  }

  users.push({ username, password });
  res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop

// public_users.get("/", function (req, res) {
//   res.json(books); // Отправляем список книг в формате JSON
// });

// Task 10:
public_users.get("/", function (req, res) {
  // Имитация асинхронной операции
  new Promise((resolve, reject) => {
    if (books) {
      resolve(books);
    } else {
      reject("Books not found");
    }
  })
    .then((bookList) => {
      res.json(bookList);
    })
    .catch((error) => {
      res.status(500).json({ message: error });
    });
});

// Get book details based on ISBN
// public_users.get("/isbn/:isbn", function (req, res) {
//   const isbn = req.params.isbn;
//   const book = books[isbn];

//   if (book) {
//     res.json(book);
//   } else {
//     res.status(404).json({ message: "Book not found" });
//   }
// });

// Task 11
// Get book details based on ISBN using Promise
public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;

  // Имитация асинхронной операции с использованием Promise
  new Promise((resolve, reject) => {
    const book = books[isbn];
    if (book) {
      resolve(book);
    } else {
      reject("Book not found");
    }
  })
    .then((bookDetails) => {
      res.json(bookDetails);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Get book details based on author
// public_users.get("/author/:author", function (req, res) {
//   const author = req.params.author; // Получаем имя автора из параметров запроса
//   const booksByAuthor = Object.values(books).filter((book) => book.author === author); // Фильтруем книги по автору

//   if (booksByAuthor.length > 0) {
//     res.json(booksByAuthor); // Если находим книги, отправляем их список
//   } else {
//     res.status(404).json({ message: "No books found for this author" }); // Если книги не найдены, отправляем 404 ошибку
//   }
// });

// Task 12
// Get book details based on author using Promise
public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;

  new Promise((resolve, reject) => {
    const booksByAuthor = Object.values(books).filter((book) => book.author === author);
    if (booksByAuthor.length > 0) {
      resolve(booksByAuthor);
    } else {
      reject("No books found for this author");
    }
  })
    .then((books) => {
      res.json(books);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

// Get all books based on title
// public_users.get("/title/:title", function (req, res) {
//   const title = req.params.title.toLowerCase(); // Получаем название книги из параметров запроса и приводим к нижнему регистру для упрощения сравнения
//   const foundBooks = Object.values(books).filter((book) => book.title.toLowerCase().includes(title)); // Ищем все книги, чьё название содержит заданное

//   if (foundBooks.length > 0) {
//     res.json(foundBooks); // Если найдены книги, отправляем их данные
//   } else {
//     res.status(404).json({ message: "No books found with the given title" }); // Если книги не найдены, отправляем 404 ошибку
//   }
// });

// Task 13
// Get all books based on title using Promise
public_users.get("/title/:title", function (req, res) {
  const title = req.params.title.toLowerCase();

  new Promise((resolve, reject) => {
    const foundBooks = Object.values(books).filter((book) => book.title.toLowerCase().includes(title));
    if (foundBooks.length > 0) {
      resolve(foundBooks);
    } else {
      reject("No books found with the given title");
    }
  })
    .then((books) => {
      res.json(books);
    })
    .catch((error) => {
      res.status(404).json({ message: error });
    });
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  const isbn = req.params.isbn; // Получаем ISBN из параметров запроса
  const book = books[isbn]; // Ищем книгу по ISBN

  if (book && book.reviews) {
    res.json(book.reviews); // Если книга найдена и у неё есть рецензии, отправляем их
  } else {
    res.status(404).json({ message: "Book not found or no reviews available" }); // Если книга не найдена или у неё нет рецензий, отправляем 404 ошибку
  }
});

module.exports.general = public_users;
