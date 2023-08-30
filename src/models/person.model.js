const { Sequelize, DataTypes, Model } = require("sequelize");
const { sequelize } = require("../../config/db.config");

class Person extends Model {}

Person.init(
  {
    id: { type: DataTypes.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
    identification: { type: DataTypes.STRING, allowNull: false, unique: true },
    names: { type: DataTypes.STRING, allowNull: false },
    surnames: { type: DataTypes.STRING, allowNull: false },
    birthday: { type: DataTypes.DATE },
    phone: { type: DataTypes.INTEGER },
    direction: { type: DataTypes.STRING },
    province: { type: DataTypes.STRING },
    canton: { type: DataTypes.STRING },
    parish: { type: DataTypes.STRING },
    deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
  },
  {
    sequelize,
    modelName: "Person",
  }
);

module.exports = Person;
