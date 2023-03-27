"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Spot.belongsTo(models.User, { as: "Owner", foreignKey: "ownerId" });
      Spot.hasMany(models.SpotImage, { foreignKey: "spotId", onDelete: "CASCADE", hooks: true });
      Spot.hasMany(models.Review, { foreignKey: "spotId", onDelete: "CASCADE", hooks: true });
      Spot.hasMany(models.Booking, { foreignKey: "spotId", onDelete: "CASCADE", hooks: true });
    }
  }
  Spot.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      ownerId: DataTypes.INTEGER,
      address: DataTypes.STRING,
      city: DataTypes.STRING,
      state: DataTypes.STRING,
      country: DataTypes.STRING,
      lat: { type: DataTypes.DECIMAL, validate: { isDecimal: true, min: -90, max: 90 } },
      lng: { type: DataTypes.DECIMAL, validate: { isDecimal: true, min: -180, max: 180 } },
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      price: DataTypes.DECIMAL,
    },
    {
      sequelize,
      modelName: "Spot",
    }
  );
  return Spot;
};
