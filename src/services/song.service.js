const SongModel = require("../models/song.model");
const PersonModel = require("../models/person.model");
const ArtistModel = require("../models/artist.model");

// Servicio para la gestión de canciones
const SongService = {};

/**
 * Obtiene todas las canciones.
 * @returns {Promise<Array>} Lista de canciones.
 * @throws {Error} Si ocurre un error al obtener las canciones.
 */
SongService.getAllSongs = async (queryOptions) => {
  try {
    const result = await SongModel.findAndCountAll({
      where: queryOptions,
      include: [
        {
          model: ArtistModel,
          include: [{ model: PersonModel, as: "Person" }],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const list = result.rows.map((song) => song.toJSON());

    return {
      list,
      totalCount: result.count
    };
  } catch (error) {
    throw new Error("Error al obtener la lista de canciones.");
  }
};


/**
 * Obtiene una canción por su ID.
 * @param {number} id - ID de la canción.
 * @returns {Promise<Object>} Objeto de la canción.
 * @throws {Error} Si la canción no se encuentra.
 */
SongService.getSongById = async (id) => {
  try {
    const item = await SongModel.findByPk(id);
    if (!item) {
      throw new Error("Canción no encontrada.");
    }
    return item.toJSON();
  } catch (error) {
    throw new Error("Error al obtener la canción.");
  }
};

/**
 * Obtiene el total de canciones publicadas por el usuario autenticado.
 * @param {object} user - Usuario autenticado con datos del artista.
 * @returns {Promise<number>} Total de canciones publicadas por el usuario autenticado.
 * @throws {Error} Si ocurre un error al obtener el total.
 */
SongService.getTotalPublishedSongsForUser = async (user) => {
  try {
    const total = await SongModel.count({
      where: {
        deleted: false,
        is_published: true,
        artist_id: user.Artist.id,
      },
    });

    return total;
  } catch (error) {
    throw new Error("Error al obtener el total de canciones publicadas.");
  }
};

/**
 * Crea una nueva canción.
 * @param {Object} songData - Datos de la canción a crear.
 * @throws {Error} Si ocurre un error al crear la canción.
 */
SongService.createSong = async (songData) => {
  try {
    return await SongModel.create(songData);
  } catch (error) {
    throw new Error("Error al subir la canción. Por favor, inténtalo de nuevo.");
  }
};

/**
 * Actualiza una canción existente.
 * @param {number} id - ID de la canción a actualizar.
 * @param {Object} songData - Datos de la canción a actualizar.
 * @throws {Error} Si la canción no se encuentra o si ocurre un error al actualizar.
 */
SongService.updateSong = async (id, songData) => {
  try {
    const [rowsUpdated] = await SongModel.update(songData, {
      where: {
        id,
      },
    });

    if (rowsUpdated === 0) {
      throw new Error("Canción no encontrada para actualizar.");
    }
  } catch (error) {
    throw new Error("Error al actualizar la canción. Por favor, intenta nuevamente.");
  }
};

/**
 * Publica una canción por su ID.
 * @param {number} id - ID de la canción a publicar.
 * @throws {Error} Si la canción no se encuentra o si ocurre un error al publicar.
 */
SongService.publishSong = async (id) => {
  try {
    const song = await SongModel.findByPk(id);

    if (!song) {
      throw new Error("Canción no encontrada para publicar.");
    }

    await song.update({ is_published: true });
  } catch (error) {
    throw new Error("Error al publicar la canción. Por favor, intenta nuevamente.");
  }
};

/**
 * Despublica una canción por su ID.
 * @param {number} id - ID de la canción a despublicar.
 * @throws {Error} Si la canción no se encuentra o si ocurre un error al despublicar.
 */
SongService.unpublishSong = async (id) => {
  try {
    const song = await SongModel.findByPk(id);

    if (!song) {
      throw new Error("Canción no encontrada para despublicar.");
    }

    await song.update({ is_published: false });
  } catch (error) {
    throw new Error("Error al despublicar la canción. Por favor, intenta nuevamente.");
  }
};

/**
 * Elimina una canción por su ID.
 * @param {number} id - ID de la canción a eliminar.
 * @throws {Error} Si la canción no se encuentra o si ocurre un error al eliminar.
 */
SongService.deleteSong = async (id) => {
  try {
    const song = await SongModel.findByPk(id);

    if (!song) {
      throw new Error("Canción no encontrada para eliminar.");
    }

    await song.update({ deleted: true });
  } catch (error) {
    throw new Error("Error al eliminar la canción. Por favor, intenta nuevamente.");
  }
};

// Exporta el serice de Song
module.exports = SongService;
