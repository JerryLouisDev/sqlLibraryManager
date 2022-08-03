var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

//importing instance of sequelize
const { sequelize } = require("./models");
var indexRouter = require("./routes/index");
// var usersRouter = require('./routes/users');
//importing books model
var booksRouter = require("./routes/books");
var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
// app.use('/users', usersRouter);
app.use("/books", booksRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
//Use the sequelize.authenticate() method to asynchronously connect to the database and log out a message indicating that a connection has/hasn’t been established
(async () => {
  try {
    //connection validate
    await sequelize.authenticate();
    console.log(
      "Houston We Have Lift-Off 🚀! Connection with all models has been established "
    );
    //console logging error
  } catch (error) {
    console.log("Houston We Have a Problem 🚧 !!", error);
  }
})();

module.exports = app;
