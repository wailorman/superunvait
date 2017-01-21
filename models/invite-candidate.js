'use strict';

const retry = require('../src/lib/sequelize-retry').forSequelize;

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('invite-candidate', {
        userId: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        label: {
            type: DataTypes.ENUM('NORMAL', 'BAD'),
            defaultValue: 'NORMAL',
            allowNull: false
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