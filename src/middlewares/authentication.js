const { APP_NAME } = require("../../config/env.config");

module.exports = {
  auth(req, res, next) {
    if (req.isAuthenticated()) return next();
    return res.redirect(`/${APP_NAME}/auth/signin`);
  },
  not_auth(req, res, next) {
    if (!req.isAuthenticated()) return next();
    return res.redirect(`/${APP_NAME}/dashboard`);
  },
};
