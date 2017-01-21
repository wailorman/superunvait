'use strict';
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('member', {
        id: {
            primaryKey: true,
            allowNull: false,
            type: DataTypes.BIGINT.UNSIGNED
        },
        fio: DataTypes.STRING,
        gender: DataTypes.ENUM('F', 'M')
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
};