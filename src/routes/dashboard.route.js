const express = require("express");
const router = express.Router();

const dashboardController  = require("../controllers/dashboard.controller");
const { auth } = require("../middlewares/authentication");

// Define las rutas y los métodos correspondientes
const routes = [
  { path: "/", method: "dashboard", httpMethod: "get", middleware: auth },
];

// Crea las rutas utilizando un bucle
routes.forEach(({ path, method, httpMethod, middleware }) => {
  router[httpMethod](path, middleware, dashboardController[method]);
});

module.exports = router;
