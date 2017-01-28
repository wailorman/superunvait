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
            queryInterface.addColumn(
                'invite-candidates',
                'friendsStatus',
                {
                    type: Sequelize.ENUM('NOT_FETCHED', 'FETCHED', 'RESTRICTED', 'NOT_FOUND'),
                    allowNull: false,
                    defaultValue: 'NOT_FETCHED'
                }
            )
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
            queryInterface.removeColumn(
                'invite-candidates',
                'friendsStatus'
            )
        ];
    }
};
