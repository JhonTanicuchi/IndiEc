const express = require("express");
const router = express.Router();

const authController = require("../controllers/auth.controller");
const { not_auth } = require("../middlewares/authentication");


// Define las rutas y los métodos correspondientes
const routes = [
  { path: "/signin", method: "viewSignin", httpMethod: "get", middleware: not_auth },
  { path: "/signin", method: "signin", httpMethod: "post" },
  { path: "/signup", method: "viewSignup", httpMethod: "get", middleware: not_auth },
  { path: "/signup", method: "signup", httpMethod: "post" },
  { path: "/signout", method: "signout", httpMethod: "get" },
];

// Crea las rutas utilizando un bucle
routes.forEach(({ path, method, httpMethod, middleware }) => {
  if (middleware) {
    router[httpMethod](path, middleware, authController[method]);
  } else {
    router[httpMethod](path, authController[method]);
  }
});

module.exports = router;
