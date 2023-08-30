// Importar los módulos y paquetes necesarios
const app = require("./app");
require("../config/orm.config");

// Importar las variables de configuración del entorno
const { APP_PORT, APP_URL, APP_NAME } = require("../config/env.config");

// Iniciar el servidor y escuchar en el puerto especificado
app.listen(APP_PORT, () => {
  console.log("");
  console.log(
    `Servidor ejecutándose en el puerto ${APP_PORT}, en modo ${app.get(
      "env"
    )}. Puedes acceder a él en ${APP_URL}:${APP_PORT}/${APP_NAME}/auth/signin.`
  );
  console.log("");
});
