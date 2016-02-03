'use strict';

module.exports = {
    up: function (queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */
        return queryInterface.changeColumn(
            'invites',
            'userId',
            {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: ""
            }
        );
    },

    down: function (queryInterface, Sequelize) {
        /*
         Add reverting commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.dropTable('users');
         */
        return queryInterface.changeColumn(
            'invites',
            'userId',
            {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: ""
            }
        );
    }
};
