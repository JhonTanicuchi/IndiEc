// Importar el servicio de Song
const SongService = require("../services/song.service");
const { APP_NAME } = require("../../config/env.config");
const { uploadFile } = require("../helpers/fileUtils");
const { Op } = require("sequelize");

const path = require("path");

//Controlador de canciones.
const SongController = {};

/**
 * Renderiza el formulario de creación de canciones.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
SongController.getForm = async (req, res) => {
  res.render("modules/songs/form");
};

/**
 * Obtiene y renderiza la lista de canciones.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
SongController.getItems = async (req, res) => {
  try {
    const filter = req.query.filter;
    const search = req.query.search;

    const queryOptions = { deleted: false };

    if (filter === "public") {
      queryOptions.is_published = true;
    } else if (filter === "private") {
      queryOptions.is_published = false;
    }

    if (search) {
      queryOptions.title = { [Op.like]: `%${search}%` };
    }

    const { list, totalCount } = await SongService.getAllSongs(queryOptions);

    const listWithDetails = list.map((song) => {
      const artist = song.Artist;
      const person = artist.Person;

      const songWithDetails = {
        ...song,
        artist: {
          ...artist,
          person: person || null,
        },
      };

      return songWithDetails;
    });

    res.render("modules/songs/list", {
      list: listWithDetails,
      totalCount,
      filter,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send(error.message);
  }
};

/**
 * Obtiene una canción por su ID y renderiza el formulario de edición.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
SongController.getItem = async (req, res) => {
  try {
    const item = await SongService.getSongById(req.params.id);
    res.render("modules/songs/form", { item });
  } catch (error) {
    console.log(error);
    res.status(404).send(error.message);
  }
};

/**
 * Crea una nueva canción.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
SongController.createItem = async (req, res) => {
  try {
    const { title, genre, release_date, is_published } = req.body;

    const songFileName = await uploadFile(req.files.song_file, "../public/upload/songs", "song");
    const imageFileName = await uploadFile(
      req.files.song_image_file,
      "../public/upload/imgs/songs",
      "song-image"
    );

    const currentUser = req.user;

    await SongService.createSong({
      title,
      genre,
      release_date,
      is_published: is_published == "on",
      song_path: songFileName,
      cover_path: imageFileName,
      artist_id: currentUser.Artist.id,
    });

    req.flash("success_msg", "¡Canción subida exitosamente!");
    res.redirect(`/${APP_NAME}/songs/list`);
  } catch (error) {
    console.error(error);
    req.flash("error_msg", "Hubo un error al subir la canción.");
    res.redirect(`/${APP_NAME}/songs/list`);
  }
};

/**
 * Actualiza una canción existente.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
SongController.updateItem = async (req, res) => {
  const { title, genre, is_published, release_date } = req.body;
  const songData = {
    title,
    genre,
    release_date,
    is_published: is_published == "on",
  };
  try {
    await SongService.updateSong(req.params.id, songData);
    req.flash("success_msg", `¡Canción actualizada con éxito!`);
  } catch (error) {
    console.log(error);
    req.flash("error_msg", error.message);
  }
  res.redirect(`/${APP_NAME}/songs/list`);
};

/**
 * Publica una canción por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
SongController.publishItem = async (req, res) => {
  try {
    await SongService.publishSong(req.params.id);
    req.flash("success_msg", `¡Canción publicada exitosamente!`);
  } catch (error) {
    console.log(error);
    req.flash("error_msg", error.message);
  }
  res.redirect(`/${APP_NAME}/songs/list`);
};

/**
 * Despublica una canción por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
SongController.unpublishItem = async (req, res) => {
  try {
    await SongService.unpublishSong(req.params.id);
    req.flash("success_msg", `¡Canción despublicada exitosamente!`);
  } catch (error) {
    console.log(error);
    req.flash("error_msg", error.message);
  }
  res.redirect(`/${APP_NAME}/songs/list`);
};

/**
 * Elimina una canción por su ID.
 * @param {Object} req - Objeto de solicitud.
 * @param {Object} res - Objeto de respuesta.
 */
SongController.deleteItem = async (req, res) => {
  try {
    await SongService.deleteSong(req.params.id);
    req.flash("success_msg", `¡Canción eliminada exitosamente!`);
  } catch (error) {
    console.log(error);
    req.flash("error_msg", error.message);
  }
  res.redirect(`/${APP_NAME}/songs/list`);
};

// Exporta el controlador de Song
module.exports = SongController;
