'use strict';
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('invite', {
    userId: DataTypes.STRING,
    city: DataTypes.STRING,
    senderId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
};