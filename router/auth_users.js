const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticateUser = (username, password) => {
  return users.find((user) => user.username === username && user.password === password);
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Проверяем, были ли предоставлены имя пользователя и пароль
  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Проверяем учетные данные пользователя
  const user = authenticateUser(username, password);
  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Создаем JWT
  const accessToken = jwt.sign({ username: user.username }, process.env.JWT_SECRET_KEY, { expiresIn: "1h" });
  res.json({ accessToken });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.username; // Предполагается, что имя пользователя хранится в req.user

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }

  // Обновление или добавление обзора
  if (!books[isbn].reviews) {
    books[isbn].reviews = {};
  }

  books[isbn].reviews[username] = review;

  res.status(200).json({ message: "Review added/updated successfully" });
});

// delete review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.username; // Предполагается, что имя пользователя хранится в req.user

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews || !books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  }

  delete books[isbn].reviews[username];

  res.json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
