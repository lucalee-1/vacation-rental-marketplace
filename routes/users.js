const express = require("express");
const router = express.Router();
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
module.exports = router;
