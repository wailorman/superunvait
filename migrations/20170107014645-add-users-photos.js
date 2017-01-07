'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        return [
            queryInterface.addColumn('users', 'pic5', Sequelize.STRING),
            queryInterface.addColumn('users', 'picFull', Sequelize.STRING)
        ];
    },

    down: function(queryInterface, Sequelize) {
        /*
         Add reverting commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.dropTable('users');
         */
        return [
            queryInterface.removeColumn('users', 'pic5'),
            queryInterface.removeColumn('users', 'picFull')
        ];
    }
};
