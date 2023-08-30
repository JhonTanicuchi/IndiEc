const {sequelize} = require('./db.config');
const { v4: uuidv4 } = require('uuid');

// Define un hook global antes de crear cualquier registro
sequelize.addHook('beforeCreate', (model, options) => {
  if (!model.id) {
    model.id = uuidv4();
  }
});

// Importa los modelos
const Person = require('../src/models/person.model');
const User = require('../src/models/user.model');
const Artist = require('../src/models/artist.model');
const Song = require('../src/models/song.model');
const Album = require('../src/models/album.model');
const AlbumSong = require('../src/models/album_song.model');

// Relaciones
Person.hasOne(Artist, { foreignKey: 'person_id', onDelete: 'CASCADE' });
Artist.belongsTo(Person, { foreignKey: 'person_id', onDelete: 'CASCADE' });

Artist.hasOne(User, { foreignKey: 'artist_id', onDelete: 'CASCADE' });
User.belongsTo(Artist, { foreignKey: 'artist_id', onDelete: 'CASCADE' });

Artist.hasMany(Song, { foreignKey: 'artist_id', onDelete: 'CASCADE' });
Song.belongsTo(Artist, { foreignKey: 'artist_id', onDelete: 'CASCADE' });

Artist.hasMany(Album, { foreignKey: 'artist_id', onDelete: 'CASCADE' });
Album.belongsTo(Artist, { foreignKey: 'artist_id', onDelete: 'CASCADE' });

Album.belongsToMany(Song, { through: AlbumSong, foreignKey: 'album_id', onDelete: 'CASCADE' });
Song.belongsToMany(Album, { through: AlbumSong, foreignKey: 'song_id', onDelete: 'CASCADE' });



//Sincronizar tablas
(async () => {
  try {
    await sequelize.sync();
    console.log('Tablas sincronizadas con la base de datos.');
  } catch (error) {
    console.error('Error al sincronizar las tablas:', error);
  }
})();

// Exporta los modelos y la instancia de sequelize
module.exports = {
  sequelize,
  Person,
  User,
};
