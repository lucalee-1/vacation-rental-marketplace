const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
  res.render("users/register", { title: "New user registration" });
};

module.exports.registerNewUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash(
        "success",
        `Welcome to Vacation Place, ${user.username}!`
      );
      const redirectUrl = req.session.returnTo || "/rentals";
      delete req.session.returnTo;
      res.redirect(redirectUrl);
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/register");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login", { title: "Log In" });
};

module.exports.loginRedirect = (req, res) => {
  req.flash("success", `Welcome back, ${req.body.username}!`);
  const redirectUrl = req.session.returnTo || "/rentals";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.loginRefresh = (req, res) => {
  req.flash("success", `Welcome back, ${req.body.username}!`);
  res.redirect("back");
};

module.exports.logout = (req, res) => {
  req.logout();
  req.flash("success", "You have logged out.");
  res.redirect("/rentals");
};
