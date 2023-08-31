const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth-routes");
const profileRoutes = require("./routes/profile-router");
require("./config/passport.js");
const session = require("express-session");
const passport = require("passport");
const flash = require("connect-flash");
const methodOverride = require("method-override");

mongoose
  .connect(process.env.MONGODB)
  .then(() => {
    console.log("conecting to mongodb...");
  })
  .catch((e) => {
    console.log(e);
  });

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

//設定middleware
app.use(express.static(path.join(__dirname, "public")));
app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); //讓網頁發出put or delete等http request
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});

//設定routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

app.get("/", (req, res) => {
  return res.render("home", { user: req.user });
});
