'use strict';

const retry = require('../src/lib/sequelize-retry').forSequelize;

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('invite-candidate', {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true
        }
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            },
            bulkCreate: retry.call(this, 'bulkCreate')
        }
    });
};