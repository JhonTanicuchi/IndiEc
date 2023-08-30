const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/db.config");

class AlbumSong extends Model {}

AlbumSong.init(
  {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "Album_Song",
  }
);

module.exports = AlbumSong;
