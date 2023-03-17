'use strict';

const { DataTypes } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return Promise.all([ queryInterface.addColumn('Users', 'firstName', {type: DataTypes.STRING}),
    queryInterface.addColumn('Users', 'lastName', {type: DataTypes.STRING})])


    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'firstName')
    await queryInterface.removeColumn('Users', 'lastName')

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
