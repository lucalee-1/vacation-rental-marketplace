const express = require("express");
const router = express.Router();
const passport = require("passport")
const catchAsync = require("../helpers/catchAsync");
const User = require("../models/user");

router.get("/register", (req, res) => {
  res.render("users/register", { title: "New user registration" });
});

router.post(
  "/register",
  catchAsync(async (req, res) => {
    try {
      const { email, username, password } = req.body;
      const user = new User({ email, username });
      const registeredUser = await User.register(user, password);
      console.log(registeredUser);
      req.flash(
        "success",
        `Welcome to Vacation Rental Marketplace, ${user.username}!`
      );
      res.redirect("/rentals");
    } catch (e) {
      req.flash("error", e.message);
      res.redirect("/register");
    }
  })
);

router.get("/login", (req, res) => {
  res.render("users/login", { title: "Log In" });
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  (req, res) => {
    req.flash("success", `Welcome back, ${req.body.username}!`);
    res.redirect("/rentals");
  }
);

module.exports = router;
