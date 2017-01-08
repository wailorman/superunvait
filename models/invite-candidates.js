'use strict';
module.exports = function(sequelize, DataTypes) {
  var InviteCandidates = sequelize.define('invite-candidates', {
    userId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return InviteCandidates;
};