const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/db.config");

class User extends Model {}

User.init(
  {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true },
    profile_path: { type: DataTypes.STRING },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "User",
  }
);

module.exports = User;
