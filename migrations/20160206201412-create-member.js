'use strict';
module.exports = {
    up: function (queryInterface, Sequelize) {
        return queryInterface.createTable('members', {
            id: {
                type: Sequelize.STRING,
                allowNull: false,
                primaryKey: true
            },
            fio: {
                type: Sequelize.STRING
            },
            gender: {
                type: Sequelize.ENUM('F', 'M')
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
        return queryInterface.dropTable('members');
    }
};