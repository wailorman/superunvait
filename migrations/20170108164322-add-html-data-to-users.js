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
            queryInterface.addColumn('users', 'friends', Sequelize.STRING),
            queryInterface.addColumn('users', 'photos', Sequelize.STRING),
            queryInterface.addColumn('users', 'groups', Sequelize.STRING),
            queryInterface.addColumn('users', 'games', Sequelize.STRING),
            queryInterface.addColumn('users', 'notes', Sequelize.STRING)
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
            queryInterface.removeColumn('users', 'friends'),
            queryInterface.removeColumn('users', 'photos'),
            queryInterface.removeColumn('users', 'groups'),
            queryInterface.removeColumn('users', 'games'),
            queryInterface.removeColumn('users', 'notes')
        ];
    }
};
