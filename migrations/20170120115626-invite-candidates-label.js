'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

      return [
          queryInterface.addColumn('invite-candidates', 'label', {
              type: Sequelize.ENUM('NORMAL', 'BAD'),
              defaultValue: 'NORMAL',
              allowNull: false
          })
      ];
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
      return [
          queryInterface.removeColumn('invite-candidates', 'label')
      ];
  }
};
