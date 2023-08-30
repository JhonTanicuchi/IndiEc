const passport = require("passport");
const { APP_NAME } = require("../../config/env.config");

const AuthController = {};

AuthController.viewSignin = (req, res) => {
  res.render("users/auth/signin");
};

AuthController.signin = passport.authenticate("signin", {
  successRedirect: `/${APP_NAME}/dashboard`,
  failureRedirect: `/${APP_NAME}/auth/signin`,
  failureFlash: true,
});

AuthController.viewSignup = (req, res) => {
  res.render("users/auth/signup");
};

AuthController.signup = passport.authenticate("signup", {
  successRedirect: `/${APP_NAME}/dashboard`,
  failureRedirect: `/${APP_NAME}/auth/signup`,
  failureFlash: true,
});

AuthController.signout = (req, res) => {
  req.logOut();
  res.redirect(`/${APP_NAME}/auth/signin`);
};

module.exports = AuthController;
