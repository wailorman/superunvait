'use strict';
module.exports = function(sequelize, DataTypes) {
    const InviteCandidate = sequelize.define('invite-candidate', {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            }
        }
    });
    return InviteCandidate;
};