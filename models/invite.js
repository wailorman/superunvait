'use strict';

const retry = require('../src/lib/sequelize-retry').forSequelize;

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('invite', {
        userId: DataTypes.BIGINT.UNSIGNED,
        status: {
            type: DataTypes.ENUM('SENT', 'FAILURE'),
            defaultValue: 'SENT',
            allowNull: false
        },
        city: DataTypes.STRING,
        senderId: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            },
            findAll: retry.call(this, 'findAll'),
            create: retry.call(this, 'create'),
            find: retry.call(this, 'find')
        }
    });
};