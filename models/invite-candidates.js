'use strict';
module.exports = function(sequelize, DataTypes) {
  var InviteCandidate = sequelize.define('invite-candidate', {
    userId: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return InviteCandidate;
};