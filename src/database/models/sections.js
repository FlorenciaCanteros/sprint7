'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sections extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sections.hasMany(models.Products, {
        as: "products",
        foreignKey: 'sectionId'
        
      });
    }
  }
  Sections.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Sections',
  });
  return Sections;
};