const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { comparePassword, encryptPassword } = require("../helpers/handleBcrypt");

// Modelos
const UserModel = require("../models/user.model");
const PersonModel = require("../models/person.model");
const ArtistModel = require("../models/artist.model");

// Estrategia para registrarse
passport.use(
  "signup",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const hashedPassword = await encryptPassword(password);
        const { identification, names, surnames, nickname } = req.body;

        // Buscar si el usuario ya existe
        UserModel.findOne({ where: { username } })
          .then(async (existingUser) => {
            if (existingUser) {
              return done(
                null,
                false,
                req.flash("auth_info_msg", "El usuario ya existe.")
              );
            }
            
            // Crear una nueva persona
            const newPerson = await PersonModel.create({
              identification,
              names,
              surnames,
            });

            // Crear un nuevo artista relacionado con la persona
            const newArtist = await ArtistModel.create({
              person_id: newPerson.id,
              nickname
            });

            // Crear un nuevo usuario relacionado con el artista
            const newUser = await UserModel.create({
              username,
              password: hashedPassword,
              artist_id: newArtist.id,
            });

            return done(null, newUser);
          })
          .catch((error) => done(error));
      } catch (error) {
        return done(error);
      }
    }
  )
);


// Estrategia para iniciar sesión
passport.use(
  "signin",
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const user = await UserModel.findOne({ where: { username } });

        if (!user) {
          return done(
            null,
            false,
            req.flash("auth_info_msg", "Usuario no encontrado.")
          );
        }

        const isMatch = await comparePassword(password, user.password);
        if (!isMatch) {
          return done(
            null,
            false,
            req.flash("auth_error_msg", "Contraseña incorrecta")
          );
        }
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialización del usuario para almacenar en la sesión
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialización del usuario al obtenerlo de la sesión
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findByPk(id, {
      include: [{ model: ArtistModel, include: [{ model: PersonModel, as: "Person" }] }],
    });

    if (!user) {
      return done(null, false);
    }

    const userData = { ...user.dataValues };
    const artistData = user.Artist?.dataValues || null;
    const personData = artistData.Person?.dataValues || null;
    const combinedData = { ...userData, Artist: artistData, Person: personData };

    return done(null, combinedData);
  } catch (err) {
    return done(err);
  }
});



// Exportar el módulo de passport configurado
module.exports = passport;
