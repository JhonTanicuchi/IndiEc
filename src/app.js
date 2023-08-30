// Importar los módulos y paquetes necesarios
const express = require("express");
const session = require("express-session");
const MySQLStore = require("express-mysql-session")(session);
const exphbs = require("express-handlebars");
const passport = require("passport");
const flash = require("connect-flash");
const path = require("path");
const cors = require("cors");
const morgan = require("morgan");
const fileUpload = require('express-fileupload');

// Importar las variables de configuración
const { options } = require("../config/db.config");
const { SESSION_SECRET, APP_NAME } = require("../config/env.config");

// Inicializar la aplicación Express
const app = express();
app.use(cors());
app.disable("x-powered-by");

// Configurar passport para la autenticación
require("./lib/passport");
app.use(fileUpload());

// Establecer el directorio de vistas y usar Handlebars como motor de vistas
app.set("views", path.join(__dirname, "views"));
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"),
    partialsDir: path.join(app.get("views"), "partials"),
    extname: ".hbs",
    helpers: require("./lib/handlebars"),
  })
);
app.set("view engine", ".hbs");

// Aplicar middlewares
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));

app.use(
  session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MySQLStore(options),
  })
);

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  // Establecer variables locales para mensajes flash y datos de usuario
  app.locals.auth_info_msg = req.flash("auth_info_msg");
  app.locals.auth_error_msg = req.flash("auth_error_msg");
  app.locals.auth_success_msg = req.flash("auth_success_msg");
  app.locals.auth_warning_msg = req.flash("auth_warning_msg");
  app.locals.success_msg = req.flash("success_msg");
  app.locals.error_msg = req.flash("error_msg");
  app.locals.User = req.user;
  app.locals.APP_NAME = APP_NAME;
  next();
});

// Servir archivos estáticos desde el directorio "public"
app.use(express.static(path.join(__dirname, "public")));

// Definir y usar rutas
const mainRoutes = [
  { path: "/auth", route: require("./routes/auth.route") },
  { path: "/profile", route: require("./routes/profile.route") },
  { path: "/dashboard", route: require("./routes/dashboard.route") },
  { path: "/songs", route: require("./routes/song.route") },
];

// Agregar rutas principales con prefijo "/APP"
mainRoutes.forEach(({ path, route }) => {
  app.use(`/${APP_NAME}${path}`, route);
});

app.use(`/${APP_NAME}/*`, (req, res) => {
  res.render('errors/404');;
});

module.exports = app;
