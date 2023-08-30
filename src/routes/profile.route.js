const express = require("express");
const router = express.Router();

const profileController  = require("../controllers/profile.controller");
const { auth } = require("../middlewares/authentication");

// Define las rutas y los métodos correspondientes
const routes = [
  { path: "/", method: "getProfile", httpMethod: "get", middleware: auth },
  { path: "/update", method: "updateProfile", httpMethod: "post", middleware: auth },
];

// Crea las rutas utilizando un bucle
routes.forEach(({ path, method, httpMethod, middleware }) => {
  router[httpMethod](path, middleware, profileController[method]);
});

module.exports = router;
