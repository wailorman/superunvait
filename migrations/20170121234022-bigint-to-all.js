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
            queryInterface.changeColumn(
                'invite-candidates',
                'userId',
                {
                    type: Sequelize.BIGINT.UNSIGNED
                }
            ),
            queryInterface.changeColumn(
                'invites',
                'userId',
                {
                    type: Sequelize.BIGINT.UNSIGNED
                }
            ),
            queryInterface.changeColumn(
                'members',
                'id',
                {
                    type: Sequelize.BIGINT.UNSIGNED
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
            queryInterface.changeColumn(
                'invite-candidates',
                'userId',
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                'invites',
                'userId',
                {
                    type: Sequelize.STRING
                }
            ),
            queryInterface.changeColumn(
                'members',
                'id',
                {
                    type: Sequelize.STRING
                }
            )
        ];
    }
};
