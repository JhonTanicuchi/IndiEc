const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/db.config");

class Album extends Model {}

Album.init(
  {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    release_date: { type: DataTypes.DATE, allowNull: false },
    cover_path: { type: DataTypes.STRING },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "Album",
  }
);

module.exports = Album;
