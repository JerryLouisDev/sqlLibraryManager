var express = require("express");
var router = express.Router();
const Book = require("../models/").Book;

// /* GET all books and shows the listing of them
router.get("/", async (req, res, next) => {
  const books = await Book.findAll();
  // console.log(books);
  res.render("books/all-books", {
    title: "Book Collection",
    books,
  });
});

//Form to create new book
router.get("/new", (req, res) => {
  res.render("books/new-book", {
    title: "New Book",
    book: {},
  });
});

//Post new book to the database
router.post("/new", async (req, res) => {
  let book;
  try {
    book = await Book.create(req.body);
    res.redirect("/books");
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      res.render("books/new-book", {
        title: "Create A New Book",
        book,
        errors: error.errors,
      });
    } else {
      //handling any errors
      throw error;
    }
  }
});
//Book form details
router.get("/:id", async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    res.render("books/update-book", {
      title: book.title,
      book: book,
    });
  } else {
    throw error;
  }
});
//Update Book Info
router.post("/:id", async (req, res, next) => {
  let book;
  try {
    book = await Book.findByPk(req.params.id);
    if (book) {
      await book.update(req.body);
      res.redirect("/books");
    } else {
      const err = new Error();
      err.message =
        "This book does not exist in our library. Please try another book.";
      err.status = 404;
      next(err);
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      book = await Book.build(req.body);
      book.id = req.params.id;
      res.render("books/update-book", {
        title: book.title,
        book,
        errors: error.errors,
      });
    } else {
      throw error;
    }
  }
});
//Deletes a book
router.post("/:id/delete", async (req, res, next) => {
  const book = await Book.findByPk(req.params.id);
  if (book) {
    await book.destroy();
    res.redirect("/books");
  } else {
    throw error;
  }
});

module.exports = router;
