const UserModel = require("../models/user.model");
const PersonModel = require("../models/person.model");
const ArtistModel = require("../models/artist.model");

const ProfileService = {};

ProfileService.getProfile = async (userId) => {
  try {
    const user = await UserModel.findByPk(userId, {
      include: [{ model: ArtistModel, include: [{ model: PersonModel, as: "Person" }] }],
    });

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    const userData = user.toJSON();
    const artistData = userData.Artist ? userData.Artist : null;
    const personData = artistData && artistData.Person ? artistData.Person : null;

    return {
      user: userData,
      artist: artistData,
      person: personData,
    };
  } catch (error) {
    throw new Error("Error al obtener el perfil.");
  }
};

ProfileService.updateProfile = async (userId, newData) => {
  try {
    const user = await UserModel.findByPk(userId);

    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    if (newData.artist) {
      // Actualizar datos del artista si se proporcionan
      const artist = await ArtistModel.findByPk(user.artist_id);

      if (!artist) {
        throw new Error("Artista no encontrado");
      }

      await artist.update(newData.artist);
    }

    if (newData.person) {
      // Actualizar datos de la persona si se proporcionan
      const artist = await ArtistModel.findByPk(user.artist_id);

      if (!artist) {
        throw new Error("Artista no encontrado");
      }

      const person = await PersonModel.findByPk(artist.person_id);

      if (!person) {
        throw new Error("Persona no encontrada");
      }

      await person.update(newData.person);
    }

    // Actualizar datos del usuario si se proporcionan
    await user.update(newData.user);

    return true;
  } catch (error) {
    throw new Error("Error al actualizar el perfil.");
  }
};

module.exports = ProfileService;