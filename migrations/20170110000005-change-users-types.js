'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      */
      return [
          queryInterface.changeColumn(
              'users',
              'friends',
              {
                  type: Sequelize.INTEGER,
                  allowNull: true
              }
          ),
          queryInterface.changeColumn(
              'users',
              'photos',
              {
                  type: Sequelize.INTEGER,
                  allowNull: true
              }
          ),
          queryInterface.changeColumn(
              'users',
              'groups',
              {
                  type: Sequelize.INTEGER,
                  allowNull: true
              }
          ),
          queryInterface.changeColumn(
              'users',
              'games',
              {
                  type: Sequelize.INTEGER,
                  allowNull: true
              }
          ),
          queryInterface.changeColumn(
              'users',
              'notes',
              {
                  type: Sequelize.INTEGER,
                  allowNull: true
              }
          )
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
          queryInterface.changeColumn(
              'users',
              'friends',
              {
                  type: Sequelize.STRING,
                  allowNull: true
              }
          ),
          queryInterface.changeColumn(
              'users',
              'photos',
              {
                  type: Sequelize.STRING,
                  allowNull: true
              }
          ),
          queryInterface.changeColumn(
              'users',
              'groups',
              {
                  type: Sequelize.STRING,
                  allowNull: true
              }
          ),
          queryInterface.changeColumn(
              'users',
              'games',
              {
                  type: Sequelize.STRING,
                  allowNull: true
              }
          ),
          queryInterface.changeColumn(
              'users',
              'notes',
              {
                  type: Sequelize.STRING,
                  allowNull: true
              }
          )
      ];
  }
};
