'use strict';

module.exports = {
    up: function(queryInterface, Sequelize) {
        /*
         Add altering commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.createTable('users', { id: Sequelize.INTEGER });
         */

        return queryInterface.addColumn('users', 'score', {
            type: Sequelize.FLOAT,
            defaultValue: 0,
            allowNull: true
        });
    },

    down: function(queryInterface, Sequelize) {
        /*
         Add reverting commands here.
         Return a promise to correctly handle asynchronicity.

         Example:
         return queryInterface.dropTable('users');
         */
        return queryInterface.removeColumn('users', 'score');
    }
};
