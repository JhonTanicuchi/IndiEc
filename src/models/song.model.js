const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/db.config");

class Song extends Model {}

Song.init(
  {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    genre: { type: DataTypes.STRING, allowNull: false },
    release_date: { type: DataTypes.DATE, allowNull: false },
    song_path: { type: DataTypes.STRING, allowNull: false },
    cover_path: { type: DataTypes.STRING },
    is_published: { type: DataTypes.BOOLEAN, defaultValue: false },
    play_count: { type: DataTypes.INTEGER, defaultValue: 0 },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "Song",
  }
);

module.exports = Song;
