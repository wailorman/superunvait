'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('users', {
            uid: {
                type: Sequelize.STRING,
                primaryKey: true,
                allowNull: false
            },
            name: {
                type: Sequelize.STRING
            },
            age: {
                type: Sequelize.INTEGER
            },
            allowsAnonymAccess: {
                type: Sequelize.BOOLEAN
            },
            allowsMessagingOnlyForFriends: {
                type: Sequelize.BOOLEAN
            },
            birthday: {
                type: Sequelize.DATE
            },
            gender: {
                type: Sequelize.ENUM('F', 'M')
            },
            lastOnline: {
                type: Sequelize.DATE
            },
            city: {
                type: Sequelize.STRING
            },
            countryName: {
                type: Sequelize.STRING
            },
            photoId: {
                type: Sequelize.STRING
            },
            hasServiceInvisible: {
                type: Sequelize.BOOLEAN
            },
            private: {
                type: Sequelize.BOOLEAN
            },

            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    down: function (queryInterface, Sequelize) {
        return queryInterface.dropTable('users');
    }
};