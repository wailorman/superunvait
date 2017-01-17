'use strict';

const retry = require('../src/lib/sequelize-retry');

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('invite', {
        userId: DataTypes.STRING,
        city: DataTypes.STRING,
        senderId: DataTypes.STRING
    }, {
        classMethods: {
            associate: function(models) {
                // associations can be defined here
            },
            findAll: function(...args) {
                return retry(
                    this.constructor.prototype.findAll.bind(this)
                )(...args);
            },
            create: function(...args) {
                return retry(
                    this.constructor.prototype.create.bind(this)
                )(...args);
            },
            find: function(...args) {
                return retry(
                    this.constructor.prototype.find.bind(this)
                )(...args);
            }
        }
    });
};