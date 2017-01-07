'use strict';
module.exports = function(sequelize, DataTypes) {
  let Variable = sequelize.define('variable', {
    key: DataTypes.STRING,
    value: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Variable;
};