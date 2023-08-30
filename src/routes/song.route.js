const express = require("express");
const router = express.Router();

const songController = require("../controllers/song.controller");
const { auth } = require("../middlewares/authentication");

// Define las rutas y los métodos correspondientes
const routes = [
  { path: "/form", method: "getForm", httpMethod: "get" },
  { path: "/list", method: "getItems", httpMethod: "get" }, 
  { path: "/:id/form", method: "getItem", httpMethod: "get" },
  { path: "/create", method: "createItem", httpMethod: "post" },
  { path: "/:id/update", method: "updateItem", httpMethod: "post" },
  { path: "/:id/delete", method: "deleteItem", httpMethod: "get" },
  { path: "/:id/publish", method: "publishItem", httpMethod: "get" },
  { path: "/:id/unpublish", method: "unpublishItem", httpMethod: "get" },
];

// Crea las rutas utilizando un bucle
routes.forEach(({ path, method, httpMethod }) => {
  router[httpMethod](path, auth, songController[method]);
});

module.exports = router;
