'use strict';
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('user', {
        uid: DataTypes.STRING,
        name: DataTypes.STRING,
        age: DataTypes.INTEGER,
        allowsAnonymAccess: DataTypes.BOOLEAN,
        allowsMessagingOnlyForFriends: DataTypes.BOOLEAN,
        birthday: DataTypes.DATE,
        gender: DataTypes.ENUM('F', 'M'),
        lastOnline: DataTypes.DATE,
        city: DataTypes.STRING,
        country: DataTypes.STRING,
        photoId: DataTypes.STRING,
        pic5: DataTypes.STRING,
        picFull: DataTypes.STRING,
        hasServiceInvisible: DataTypes.BOOLEAN,
        private: DataTypes.BOOLEAN
    }, {
        classMethods: {
            associate: function (models) {
                // associations can be defined here
            }
        }
    });
};