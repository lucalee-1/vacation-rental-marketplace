const express = require("express");
const router = express.Router();
const passport = require("passport");
const catchAsync = require("../helpers/catchAsync");
const users = require("../controllers/users");
const User = require("../models/user");

router.get("/register", users.renderRegisterForm);

router.post("/register", catchAsync(users.registerNewUser));

router.get("/login", users.renderLoginForm);

router.post(
  "/login",
  passport.authenticate("local", {
    failureFlash: true,
    failureRedirect: "/login",
  }),
  users.loginRedirect
);

router.post("/logout", users.logout);

module.exports = router;
